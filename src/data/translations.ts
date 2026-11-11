export interface TranslationStrings {
  appName: string;
  creatorTag: string;
  newChat: string;
  history: string;
  searchHistory: string;
  profile: string;
  settings: string;
  about: string;
  translator: string;
  askPlaceholder: string;
  send: string;
  thinking: string;
  helloTitle: string;
  howCanHelp: string;
  coreOnline: string;
  changePhoto: string;
  uploadPhoto: string;
  removePhoto: string;
  fullName: string;
  username: string;
  guestUser: string;
  save: string;
  cancel: string;
  clearHistory: string;
  clearHistoryConfirm: string;
  exportChat: string;
  readAloud: string;
  stopSpeaking: string;
  copy: string;
  copied: string;
  regenerate: string;
  preferredLanguage: string;
  audioFeedback: string;
  voiceAutoRead: string;
  responseStyle: string;
  allRegions: string;
  searchLanguages: string;
  popularLanguages: string;
  autoDetect: string;
  translateText: string;
  sourceLang: string;
  targetLang: string;
  translateButton: string;
  translating: string;
  originalText: string;
  translatedResult: string;
  voiceInput: string;
  voiceListening: string;
  voiceUnsupported: string;
  noHistory: string;
  today: string;
  yesterday: string;
  older: string;
}

const EN_STRINGS: TranslationStrings = {
  appName: 'HINDUSTAN AI',
  creatorTag: 'Created by Zala Virendra Sinh',
  newChat: 'New Chat',
  history: 'Search Archives',
  searchHistory: 'Search chat history & keywords...',
  profile: 'User Profile',
  settings: 'HUD Settings',
  about: 'About Core',
  translator: 'AI Translator',
  askPlaceholder: 'Ask HINDUSTAN AI in any language...',
  send: 'Send message',
  thinking: 'HINDUSTAN AI is thinking...',
  helloTitle: 'HELLO! I AM HINDUSTAN AI',
  howCanHelp: 'How can I help you today?',
  coreOnline: 'CORE: ONLINE',
  changePhoto: 'Change Photo',
  uploadPhoto: 'Upload Photo',
  removePhoto: 'Remove',
  fullName: 'Full Name',
  username: 'Username / Handle',
  guestUser: 'Guest User',
  save: 'Save Changes',
  cancel: 'Cancel',
  clearHistory: 'Clear All History',
  clearHistoryConfirm: 'Are you sure you want to permanently clear all saved conversations?',
  exportChat: 'Export Conversation',
  readAloud: 'Read Aloud (TTS)',
  stopSpeaking: 'Stop Speaking',
  copy: 'Copy',
  copied: 'Copied',
  regenerate: 'Regenerate',
  preferredLanguage: 'Language & Locale',
  audioFeedback: 'JARVIS Audio Feedback FX',
  voiceAutoRead: 'Voice Auto-Read Response',
  responseStyle: 'AI Response Style Mode',
  allRegions: 'All Regions',
  searchLanguages: 'Search across 7,000+ languages, scripts or countries...',
  popularLanguages: 'Popular Worldwide Languages',
  autoDetect: 'Auto-Detect Language',
  translateText: 'Translate Any Text with Gemini',
  sourceLang: 'Source Language',
  targetLang: 'Target Language',
  translateButton: 'Translate Now',
  translating: 'Translating with Gemini 3.8 Flash...',
  originalText: 'Enter text to translate...',
  translatedResult: 'Translation will appear here...',
  voiceInput: 'Voice Input',
  voiceListening: 'Listening... Speak now',
  voiceUnsupported: 'Speech recognition is not supported in this browser.',
  noHistory: 'No history saved yet',
  today: 'Today',
  yesterday: 'Yesterday',
  older: 'Older',
};

const HI_STRINGS: TranslationStrings = {
  ...EN_STRINGS,
  appName: 'हिन्दुस्तान एआई',
  creatorTag: 'निर्माता: झाला विरेन्द्र सिंह',
  newChat: 'नई बातचीत',
  history: 'बातचीत इतिहास',
  searchHistory: 'इतिहास व कीवर्ड्स खोजें...',
  profile: 'उपयोगकर्ता प्रोफ़ाइल',
  settings: 'सेटिंग्स',
  about: 'परिचय',
  translator: 'एआई अनुवादक',
  askPlaceholder: 'हिन्दुस्तान एआई से किसी भी भाषा में पूछें...',
  send: 'संदेश भेजें',
  thinking: 'हिन्दुस्तान एआई सोच रहा है...',
  helloTitle: 'नमस्ते! मैं हिन्दुस्तान एआई हूँ',
  howCanHelp: 'आज मैं आपकी क्या सहायता कर सकता हूँ?',
  coreOnline: 'सिस्टम: सक्रिय',
  changePhoto: 'फ़ोटो बदलें',
  uploadPhoto: 'फ़ोटो अपलोड करें',
  removePhoto: 'हटाएं',
  fullName: 'पूरा नाम',
  username: 'यूज़रनेम',
  guestUser: 'अतिथि उपयोगकर्ता (Guest)',
  save: 'परिवर्तन सहेजें',
  cancel: 'रद्द करें',
  clearHistory: 'समस्त इतिहास हटाएं',
  clearHistoryConfirm: 'क्या आप सचमुच सभी पुरानी बातचीत हटाना चाहते हैं?',
  exportChat: 'बातचीत डाउनलोड करें',
  readAloud: 'सुनें (बोलकर पढ़ें)',
  stopSpeaking: 'आवाज़ बंद करें',
  copy: 'कॉपी करें',
  copied: 'कॉपी हो गया',
  regenerate: 'पुनः उत्तर दें',
  preferredLanguage: 'भाषा व क्षेत्र',
  audioFeedback: 'जार्विस ऑडियो प्रभाव',
  voiceAutoRead: 'उत्तर स्वतः बोलकर पढ़ें',
  responseStyle: 'उत्तर शैली मोड',
  allRegions: 'सभी क्षेत्र',
  searchLanguages: '7,000+ विश्व भाषाओं या देशों में खोजें...',
  popularLanguages: 'लोकप्रिय विश्व भाषाएं',
  autoDetect: 'स्वतः भाषा पहचानें',
  translateText: 'जेमिनी द्वारा किसी भी भाषा में अनुवाद',
  sourceLang: 'मूल भाषा',
  targetLang: 'अनुवाद भाषा',
  translateButton: 'अनुवाद करें',
  translating: 'अनुवाद हो रहा है...',
  originalText: 'अनुवाद के लिए पाठ दर्ज करें...',
  translatedResult: 'अनुवाद यहाँ दिखाई देगा...',
  voiceInput: 'आवाज़ से बोलें',
  voiceListening: 'सुन रहा हूँ... बोलिए',
  noHistory: 'कोई इतिहास सुरक्षित नहीं है',
  today: 'आज',
  yesterday: 'कल',
  older: 'पुराना',
};

const GU_STRINGS: TranslationStrings = {
  ...EN_STRINGS,
  appName: 'હિન્દુસ્તાન એઆઈ',
  creatorTag: 'નિર્માતા: ઝાલા વિરેન્દ્ર સિંહ',
  newChat: 'નવી વાતચીત',
  history: 'ઇતિહાસ આર્કાઇવ',
  searchHistory: 'વાતચીત અને કીવર્ડ્સ શોધો...',
  profile: 'પ્રોફાઇલ',
  settings: 'સેટિંગ્સ',
  about: 'વિશે માહિતી',
  translator: 'એઆઈ અનુવાદક',
  askPlaceholder: 'હિન્દુસ્તાન એઆઈને કોઈપણ ભાષામાં પૂછો...',
  send: 'સંદેશ મોકલો',
  thinking: 'હિન્દુસ્તાન એઆઈ વિચારી રહ્યું છે...',
  helloTitle: 'કેમ છો! હું હિન્દુસ્તાન એઆઈ છું',
  howCanHelp: 'હું આજે તમારી શું મદદ કરી શકું?',
  coreOnline: 'કોર: ઓનલાઈન',
  changePhoto: 'ફોટો બદલો',
  uploadPhoto: 'ફોટો અપલોડ કરો',
  removePhoto: 'દૂર કરો',
  fullName: 'પૂરું નામ',
  username: 'યુઝરનેમ',
  guestUser: 'મહેમાન વપરાશકર્તા (Guest)',
  save: 'સાચવો',
  cancel: 'રદ કરો',
  clearHistory: 'તમામ ઇતિહાસ સાફ કરો',
  clearHistoryConfirm: 'શું તમે ખરેખર બધી જૂની વાતચીત કાયમ માટે સાફ કરવા માંગો છો?',
  exportChat: 'વાતચીત ડાઉનલોડ કરો',
  readAloud: 'સાંભળો (વાંચી સંભળાવો)',
  stopSpeaking: 'બોલવાનું બંધ કરો',
  copy: 'કોપી',
  copied: 'કોપી થઈ ગયું',
  regenerate: 'ફરીથી જવાબ આપો',
  preferredLanguage: 'ભાષા અને વિસ્તાર',
  audioFeedback: 'ઓડિયો અવાજ ઇફેક્ટ્સ',
  voiceAutoRead: 'જવાબ આપમેળે બોલીને સંભળાવો',
  responseStyle: 'જવાબ આપવાની શૈલી',
  allRegions: 'બધા પ્રદેશો',
  searchLanguages: '7,000+ વિશ્વની ભાષાઓ અથવા દેશો શોધો...',
  popularLanguages: 'લોકપ્રિય વૈશ્વિક ભાષાઓ',
  autoDetect: 'આપમેળે ભાષા ઓળખો',
  translateText: 'કોઈપણ લખાણનો સચોટ અનુવાદ કરો',
  sourceLang: 'મૂળ ભાષા',
  targetLang: 'લક્ષ્ય ભાષા',
  translateButton: 'અનુવાદ કરો',
  translating: 'અનુવાદ થઈ રહ્યો છે...',
  originalText: 'અનુવાદ માટે લખાણ લખો...',
  translatedResult: 'અનુવાદ અહીં દેખાશે...',
  voiceInput: 'અવાજથી બોલો',
  voiceListening: 'સાંભળી રહ્યો છું... બોલો',
  noHistory: 'કોઈ ઇતિહાસ મળ્યો નથી',
  today: 'આજે',
  yesterday: 'ગઈકાલે',
  older: 'જૂનું',
};

const SA_STRINGS: TranslationStrings = {
  ...EN_STRINGS,
  appName: 'हिन्दुस्तान एआई',
  creatorTag: 'निर्माता: झाला विरेन्द्र सिंहः',
  newChat: 'नूतनसंवादः',
  history: 'संवादसङ्ग्रहः',
  profile: 'उपयोक्तृविवरणम्',
  settings: 'समायोजनानि',
  about: 'परिचयः',
  askPlaceholder: 'संस्कृतेन वा अन्यभाषया पृच्छतु...',
  thinking: 'हिन्दुस्तान एआई विचारयति...',
  helloTitle: 'नमस्ते! अहं हिन्दुस्तान एआई अस्मि',
  howCanHelp: 'अद्य भवतः कां साहाय्यं करवाणि?',
  save: 'संरक्षतु',
  cancel: 'निरस्यतु',
  copy: 'प्रतिलिपिं कुरु',
  copied: 'प्रतिलिपिकृतम्',
};

const AR_STRINGS: TranslationStrings = {
  ...EN_STRINGS,
  appName: 'هندوستان للذكاء الاصطناعي',
  creatorTag: 'تم التطوير بواسطة زالا فيريندرا سينغ',
  newChat: 'محادثة جديدة',
  history: 'أرشيف المحادثات',
  searchHistory: 'ابحث في السجل والكلمات المفتاحية...',
  profile: 'الملف الشخصي',
  settings: 'الإعدادات',
  about: 'حول النظام',
  translator: 'المترجم الذكي',
  askPlaceholder: 'اسأل هندوستان بأي لغة بالعالم...',
  send: 'إرسال',
  thinking: 'هندوستان يفكر الآن...',
  helloTitle: 'مرحبًا! أنا هندوستان للذكاء الاصطناعي',
  howCanHelp: 'كيف يمكنني مساعدتك اليوم؟',
  coreOnline: 'النظام: متصل',
  fullName: 'الاسم الكامل',
  username: 'اسم المستخدم',
  guestUser: 'مستخدم ضيف',
  save: 'حفظ التغييرات',
  cancel: 'إلغاء',
  clearHistory: 'مسح كل السجل',
  copy: 'نسخ',
  copied: 'تم النسخ',
  preferredLanguage: 'اللغة والمنطقة',
  searchLanguages: 'ابحث بين أكثر من 7000 لغة عالمية...',
  autoDetect: 'التعرف التلقائي على اللغة',
  translateText: 'ترجمة أي نص مع جيميني',
  translateButton: 'ترجم الآن',
};

const ES_STRINGS: TranslationStrings = {
  ...EN_STRINGS,
  appName: 'HINDUSTAN AI',
  creatorTag: 'Creado por Zala Virendra Sinh',
  newChat: 'Nueva conversación',
  history: 'Historial de búsqueda',
  searchHistory: 'Buscar en el historial y palabras clave...',
  profile: 'Perfil de usuario',
  settings: 'Ajustes',
  about: 'Acerca de',
  translator: 'Traductor IA',
  askPlaceholder: 'Pregunta a HINDUSTAN AI en cualquier idioma...',
  send: 'Enviar mensaje',
  thinking: 'HINDUSTAN AI está pensando...',
  helloTitle: '¡HOLA! SOY HINDUSTAN AI',
  howCanHelp: '¿Cómo puedo ayudarte hoy?',
  save: 'Guardar cambios',
  cancel: 'Cancelar',
  clearHistory: 'Borrar todo el historial',
  copy: 'Copiar',
  copied: 'Copiado',
  preferredLanguage: 'Idioma y región',
  searchLanguages: 'Buscar entre más de 7.000 idiomas...',
  autoDetect: 'Detectar idioma automáticamente',
  translateText: 'Traducir cualquier texto con Gemini',
  translateButton: 'Traducir ahora',
};

const FR_STRINGS: TranslationStrings = {
  ...EN_STRINGS,
  appName: 'HINDUSTAN AI',
  creatorTag: 'Créé par Zala Virendra Sinh',
  newChat: 'Nouvelle discussion',
  history: 'Historique',
  profile: 'Profil utilisateur',
  settings: 'Paramètres',
  about: 'À propos',
  translator: 'Traducteur IA',
  askPlaceholder: 'Posez votre question dans n’importe quelle langue...',
  thinking: 'HINDUSTAN AI réfléchit...',
  helloTitle: 'BONJOUR ! JE SUIS HINDUSTAN AI',
  howCanHelp: 'Comment puis-je vous aider aujourd’hui ?',
  save: 'Enregistrer',
  cancel: 'Annuler',
  copy: 'Copier',
  copied: 'Copié',
  preferredLanguage: 'Langue & Région',
  autoDetect: 'Détection automatique de la langue',
};

const DE_STRINGS: TranslationStrings = {
  ...EN_STRINGS,
  appName: 'HINDUSTAN AI',
  creatorTag: 'Erstellt von Zala Virendra Sinh',
  newChat: 'Neuer Chat',
  history: 'Suchverlauf',
  profile: 'Benutzerprofil',
  settings: 'Einstellungen',
  about: 'Über das System',
  translator: 'KI-Übersetzer',
  askPlaceholder: 'Fragen Sie HINDUSTAN AI in jeder Sprache...',
  thinking: 'HINDUSTAN AI denkt nach...',
  helloTitle: 'HALLO! ICH BIN HINDUSTAN AI',
  howCanHelp: 'Wie kann ich Ihnen heute helfen?',
  save: 'Speichern',
  cancel: 'Abbrechen',
  copy: 'Kopieren',
  copied: 'Kopiert',
  preferredLanguage: 'Sprache & Region',
  autoDetect: 'Sprache automatisch erkennen',
};

const JA_STRINGS: TranslationStrings = {
  ...EN_STRINGS,
  appName: 'HINDUSTAN AI',
  creatorTag: '開発者: Zala Virendra Sinh',
  newChat: '新しいチャット',
  history: '検索履歴',
  profile: 'プロフィール',
  settings: '設定',
  about: 'システム情報',
  translator: 'AI翻訳ツール',
  askPlaceholder: 'どの言語でも自由に質問してください...',
  thinking: 'HINDUSTAN AIが思考中...',
  helloTitle: 'こんにちは！HINDUSTAN AIです',
  howCanHelp: '本日はどのようなご用件でしょうか？',
  save: '保存する',
  cancel: 'キャンセル',
  copy: 'コピー',
  copied: 'コピー完了',
  preferredLanguage: '言語と地域',
  autoDetect: '言語を自動検出',
  translateButton: '今すぐ翻訳',
};

const ZH_STRINGS: TranslationStrings = {
  ...EN_STRINGS,
  appName: 'HINDUSTAN AI',
  creatorTag: '创作者: Zala Virendra Sinh',
  newChat: '新对话',
  history: '历史记录',
  profile: '个人资料',
  settings: '设置',
  about: '关于核心',
  translator: 'AI翻译器',
  askPlaceholder: '用任何语言向 HINDUSTAN AI 提问...',
  thinking: 'HINDUSTAN AI 正在思考...',
  helloTitle: '您好！我是 HINDUSTAN AI',
  howCanHelp: '今天有什么我可以帮您的？',
  save: '保存修改',
  cancel: '取消',
  copy: '复制',
  copied: '已复制',
  preferredLanguage: '语言与区域',
  autoDetect: '自动检测语言',
  translateButton: '立即翻译',
};

const RU_STRINGS: TranslationStrings = {
  ...EN_STRINGS,
  appName: 'HINDUSTAN AI',
  creatorTag: 'Создатель: Zala Virendra Sinh',
  newChat: 'Новый чат',
  history: 'История поиска',
  profile: 'Профиль',
  settings: 'Настройки',
  about: 'О системе',
  translator: 'ИИ-Переводчик',
  askPlaceholder: 'Задайте вопрос на любом языке...',
  thinking: 'HINDUSTAN AI думает...',
  helloTitle: 'ПРИВЕТ! Я HINDUSTAN AI',
  howCanHelp: 'Чем я могу помочь вам сегодня?',
  save: 'Сохранить',
  cancel: 'Отмена',
  copy: 'Копировать',
  copied: 'Скопировано',
  preferredLanguage: 'Язык и регион',
  autoDetect: 'Автоопределение языка',
};

const TRANSLATION_MAP: Record<string, TranslationStrings> = {
  en: EN_STRINGS,
  hi: HI_STRINGS,
  gu: GU_STRINGS,
  sa: SA_STRINGS,
  ar: AR_STRINGS,
  es: ES_STRINGS,
  fr: FR_STRINGS,
  de: DE_STRINGS,
  ja: JA_STRINGS,
  zh: ZH_STRINGS,
  ru: RU_STRINGS,
};

export function getTranslations(langCode: string): TranslationStrings {
  const code = (langCode || 'en').toLowerCase().split('-')[0];
  return TRANSLATION_MAP[code] || EN_STRINGS;
}
