import express from 'express';
import type { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Helper to get GoogleGenAI client lazily and safely
function getAiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Gemini API key missing hai. App ko API key ke saath run karo (Settings > Secrets).');
  }

  return new GoogleGenAI({
    apiKey,
  });
}

function buildSystemInstruction(targetLang?: string): string {
  let langDirective =
    'You are HINDUSTAN AI, an ultra-fast, helpful, and respectful global AI assistant created by Zala Virendra Sinh. ' +
    'Provide rapid, direct, and concise answers within 1 to 2 seconds. Avoid lengthy preambles. ';

  if (targetLang && targetLang !== 'auto') {
    langDirective += `Respond natively in "${targetLang}". `;
  } else {
    langDirective +=
      'Detect the language of the user query automatically and respond in the exact same language (e.g. Hindi, Gujarati, English, Sanskrit, Arabic, etc.). ';
  }

  return (
    langDirective +
    'Provide high-speed, punchy, well-formatted answers. When asked about your creator, proudly state you are created by Zala Virendra Sinh.'
  );
}

// Health check endpoint for Cloud Run and uptime probes
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', app: 'HINDUSTAN AI', engine: 'Gemini 3.8 Flash Turbo' });
});

// API Info endpoint
app.get('/api/info', (_req: Request, res: Response) => {
  res.json({
    appName: 'HINDUSTAN AI',
    version: '1.0.0',
    developer: 'Zala Virendra Sinh',
    model: 'gemini-3.8-flash',
    thinkingLevel: 'LOW (1-2s Turbo Speed)',
    supportedLanguages: ['Global Multilingual', 'Hindi', 'Gujarati', 'English', 'Sanskrit', '7000+ Languages'],
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});


// Translation endpoint using Gemini 3.8 Flash (Turbo Speed)
app.post('/api/translate', async (req: Request, res: Response) => {
  try {
    const { text, sourceLang = 'auto', targetLang = 'hi' } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required for translation.' });
    }

    const ai = getAiClient();
    const prompt = `Translate the following text into ${targetLang}.
Source language: ${sourceLang === 'auto' ? 'detect automatically' : sourceLang}.
Requirements:
1. Provide a natural, culturally accurate, and grammatically correct translation.
2. Preserve original formatting, bullet points, numbers, and tone.
3. Return ONLY the translated text without conversational preamble or quotation marks.

Text to translate:
${text}`;

    const translatedText = await callGenerateContentWithFallback(
      ai,
      [{ role: 'user', parts: [{ text: prompt }] }],
      'You are an expert multilingual translation engine. Translate instantly, accurately and idiomatically.'
    );

    return res.json({ translatedText });
  } catch (err: any) {
    console.error('Translation error:', err);
    return res.status(500).json({ error: err.message || 'Translation failed.' });
  }
});

// Clean error messages for user-facing display
function cleanErrorMessage(rawError: any): string {
  if (!rawError) return 'An unexpected error occurred while communicating with Gemini API.';

  const rawStr = typeof rawError === 'string' ? rawError : rawError?.message || JSON.stringify(rawError);

  try {
    const parsed = typeof rawError === 'object' && rawError.error ? rawError : JSON.parse(rawStr);
    if (parsed.error) {
      const code = parsed.error.code;
      const msg = parsed.error.message || '';
      if (code === 429 || msg.includes('quota') || msg.includes('RESOURCE_EXHAUSTED')) {
        return 'Gemini API Daily Quota Exceeded on Free Tier. Please retry later or use an upgraded key in Settings > Secrets.';
      }
      if (code === 403 || msg.includes('PERMISSION_DENIED') || msg.includes('API key')) {
        return 'Invalid or unauthorized Gemini API key. Please check your key in Settings > Secrets.';
      }
      if (code === 503 || msg.includes('high demand') || msg.includes('UNAVAILABLE')) {
        return 'Gemini model is currently experiencing high demand. Please retry in a few moments.';
      }
      return msg || `Gemini API Error (Status ${code})`;
    }
  } catch {
    // rawStr is not JSON
  }

  if (rawStr.includes('quota') || rawStr.includes('RESOURCE_EXHAUSTED') || rawStr.includes('429')) {
    return 'Gemini API Daily Quota Exceeded on Free Tier. Please retry later or use an upgraded key in Settings > Secrets.';
  }
  if (rawStr.includes('API key') || rawStr.includes('API_KEY_INVALID') || rawStr.includes('PERMISSION_DENIED')) {
    return 'Gemini API key is invalid or missing. Please verify in Settings > Secrets.';
  }
  if (rawStr.includes('503') || rawStr.includes('high demand')) {
    return 'Gemini model is temporarily busy. Please retry in a few moments.';
  }
  if (rawStr.includes('timeout') || rawStr.includes('ETIMEDOUT') || rawStr.includes('fetch failed')) {
    return 'Network request timed out. Please check your connection and tap Retry.';
  }

  return rawStr;
}

// Multi-model non-streaming generator with fallback
async function callGenerateContentWithFallback(ai: GoogleGenAI, contents: any[], systemInstruction: string): Promise<string> {
  const models = ['gemini-2.5-flash', 'gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
  let lastError: any = null;

  for (const model of models) {
    try {
      const is38 = model === 'gemini-3.8-flash';
      const config: any = { systemInstruction };
      if (is38) {
        config.thinkingConfig = { thinkingLevel: ThinkingLevel.LOW };
      }

      const res = await ai.models.generateContent({
        model,
        contents,
        config,
      });

      if (res.text && res.text.trim()) {
        return res.text;
      }
    } catch (err: any) {
      lastError = err;
      console.warn(`[GenerateContent] Model ${model} error:`, err?.message || err);
    }
  }

  throw new Error(cleanErrorMessage(lastError));
}

// Multi-model streaming generator with fallback
async function streamGeminiWithFallback(
  ai: GoogleGenAI,
  contents: any[],
  systemInstruction: string,
  res: Response
): Promise<void> {
  const models = ['gemini-2.5-flash', 'gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
  let streamSucceeded = false;
  let lastError: any = null;

  for (const model of models) {
    try {
      console.log(`[Stream] Attempting model: ${model}`);
      const is38 = model === 'gemini-3.8-flash';
      const config: any = { systemInstruction };
      if (is38) {
        config.thinkingConfig = { thinkingLevel: ThinkingLevel.LOW };
      }

      const responseStream = await ai.models.generateContentStream({
        model,
        contents,
        config,
      });

      let tokenCount = 0;
      for await (const chunk of responseStream) {
        const text = chunk.text;
        if (text) {
          tokenCount++;
          res.write(`data: ${JSON.stringify({ text })}\n\n`);
        }
      }

      if (tokenCount > 0) {
        streamSucceeded = true;
        console.log(`[Stream] Model ${model} finished with ${tokenCount} chunks`);
        break;
      } else {
        console.warn(`[Stream] Model ${model} yielded 0 tokens, falling back to next model`);
      }
    } catch (err: any) {
      lastError = err;
      console.warn(`[Stream] Model ${model} error:`, err?.message || err);
    }
  }

  if (streamSucceeded) {
    res.write('data: [DONE]\n\n');
    res.end();
  } else {
    const errorMsg = cleanErrorMessage(lastError);
    console.error('[Stream] All models failed. Sending error to client:', errorMsg);
    res.write(`data: ${JSON.stringify({ error: errorMsg })}\n\n`);
    res.end();
  }
}

// Non-streaming chat endpoint (Turbo Speed)
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message, history = [], targetLanguage = 'auto' } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const ai = getAiClient();
    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    // Keep last 6 relevant turns to minimize prompt token processing time
    const recentHistory = Array.isArray(history) ? history.slice(-6) : [];

    for (const item of recentHistory) {
      if (item && item.role && Array.isArray(item.parts) && item.parts.length > 0) {
        const textPart = item.parts[0]?.text;
        if (textPart && typeof textPart === 'string') {
          contents.push({
            role: item.role === 'model' ? 'model' : 'user',
            parts: [{ text: textPart }],
          });
        }
      }
    }

    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const answer = await callGenerateContentWithFallback(ai, contents, buildSystemInstruction(targetLanguage));
    return res.json({ text: answer });
  } catch (error: any) {
    console.error('Chat error:', error);
    const errorMsg = cleanErrorMessage(error);
    return res.status(500).json({ error: errorMsg });
  }
});

// Streaming chat endpoint using Server-Sent Events (Turbo 1-2s Speed)
app.post('/api/chat/stream', async (req: Request, res: Response) => {
  const { message, history = [], targetLanguage = 'auto' } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' });
  }

  let ai: GoogleGenAI;
  try {
    ai = getAiClient();
  } catch (err: any) {
    const errorMsg = cleanErrorMessage(err);
    return res.status(500).json({ error: errorMsg });
  }

  // Disable proxy/Nginx buffering so chunks arrive with 0ms delay
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders?.();

  try {
    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    // Slice to recent 6 turns for rapid prompt evaluation
    const recentHistory = Array.isArray(history) ? history.slice(-6) : [];

    for (const item of recentHistory) {
      if (item && item.role && Array.isArray(item.parts) && item.parts.length > 0) {
        const textPart = item.parts[0]?.text;
        if (textPart && typeof textPart === 'string') {
          contents.push({
            role: item.role === 'model' ? 'model' : 'user',
            parts: [{ text: textPart }],
          });
        }
      }
    }

    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    await streamGeminiWithFallback(ai, contents, buildSystemInstruction(targetLanguage), res);
  } catch (error: any) {
    console.error('Stream fatal error:', error);
    const errorMsg = cleanErrorMessage(error);
    res.write(`data: ${JSON.stringify({ error: errorMsg })}\n\n`);
    res.end();
  }
});

async function startServer() {
  const distPath = path.resolve(__dirname, 'dist');
  const hasDist = fs.existsSync(distPath) && fs.existsSync(path.resolve(distPath, 'index.html'));

  const isProd =
    process.env.NODE_ENV === 'production' ||
    process.env.npm_lifecycle_event === 'start' ||
    (hasDist && process.env.npm_lifecycle_event !== 'dev');

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`HINDUSTAN AI server running on http://0.0.0.0:${port} [mode: ${isProd ? 'production' : 'development'}]`);
  });
}

startServer();
