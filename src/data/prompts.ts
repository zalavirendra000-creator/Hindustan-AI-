export interface DynamicPromptSuggestion {
  id: string;
  lang: string;
  label: string;
  prompt: string;
  category: string;
}

export const PROMPT_SUGGESTIONS: DynamicPromptSuggestion[] = [
  // Hindi prompts
  {
    id: 'hi-1',
    lang: 'hi',
    label: 'नमस्ते और परिचय',
    prompt: 'नमस्ते! आप हिन्दुस्तान एआई हैं, अपने बारे में और आप कैसे मेरी मदद कर सकते हैं विस्तार से बताएं।',
    category: 'सामान्य',
  },
  {
    id: 'hi-2',
    lang: 'hi',
    label: 'भारत की संस्कृति',
    prompt: 'भारत के प्रमुख त्योहारों और उनकी ऐतिहासिक सांस्कृतिक महत्ता के बारे में बताइए।',
    category: 'ज्ञान',
  },

  // Gujarati prompts
  {
    id: 'gu-1',
    lang: 'gu',
    label: 'કેમ છો અને પરિચય',
    prompt: 'કેમ છો! તમે હિન્દુસ્તાન એઆઈ છો, તમારા વિશે જણાવો અને તમે ગુજરાતીમાં કેવી રીતે મદદ કરી શકો છો?',
    category: 'પરિચય',
  },
  {
    id: 'gu-2',
    lang: 'gu',
    label: 'ગુજરાતના પ્રખ્યાત સ્થળો',
    prompt: 'ગુજરાતના જોવાલાયક ઐતિહાસિક અને કુદરતી પ્રવાસન સ્થળો વિશે માહિતી આપો.',
    category: 'પ્રવાસન',
  },

  // Sanskrit prompts
  {
    id: 'sa-1',
    lang: 'sa',
    label: 'संस्कृतसुभाषितम्',
    prompt: 'संस्कृतभाषायां परोपकारस्य महत्तां वर्णयन् एकं प्रसिद्धं सुभाषितं सार्थं लिखतु।',
    category: 'सुभाषितम्',
  },
  {
    id: 'sa-2',
    lang: 'sa',
    label: 'भगवद्गीता ज्ञानम्',
    prompt: 'श्रीमद्भगवद्गीतायाः कर्मयोगस्य मुख्यसिद्धान्तं संक्षेपेण संस्कृतभाषायां विवृणोतु।',
    category: 'दर्शनम्',
  },

  // English prompts
  {
    id: 'en-1',
    lang: 'en',
    label: 'Introduction & Capabilities',
    prompt: 'Hello! Please introduce yourself as HINDUSTAN AI and explain what you can do for me.',
    category: 'General',
  },
  {
    id: 'en-2',
    lang: 'en',
    label: 'Explain Quantum Computing',
    prompt: 'Explain quantum computing and qubits in simple, intuitive terms with everyday analogies.',
    category: 'Science',
  },

  // Arabic prompts
  {
    id: 'ar-1',
    lang: 'ar',
    label: 'مقدمة وترحيب',
    prompt: 'مرحبًا! من أنت وما هي قدرات هندوستان للذكاء الاصطناعي في دعم اللغات المختلفة؟',
    category: 'عام',
  },
  {
    id: 'ar-2',
    lang: 'ar',
    label: 'حكمة عربية أصيلة',
    prompt: 'شاركني حكمة عربية أصيلة وتاريخية عن الصبر والنجاح مع شرح موجز.',
    category: 'أدب',
  },

  // Spanish prompts
  {
    id: 'es-1',
    lang: 'es',
    label: 'Presentación',
    prompt: '¡Hola! Por favor preséntate como HINDUSTAN AI y explica tus capacidades multilingües.',
    category: 'General',
  },

  // French prompts
  {
    id: 'fr-1',
    lang: 'fr',
    label: 'Salutations & Introduction',
    prompt: 'Bonjour ! Présentez-vous en tant que HINDUSTAN AI et expliquez comment vous pouvez m\'aider.',
    category: 'Général',
  },
];
