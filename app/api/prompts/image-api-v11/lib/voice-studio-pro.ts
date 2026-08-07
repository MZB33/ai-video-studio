export type VoiceCharacter = {
  id: string;
  name: string;
  archetype: string;
  vocalSignature: string;
  strengths: string[];
  recommendedUseCaseIds: string[];
  languageStrengths?: string[];
  accentStrengths?: string[];
};

export type PronunciationOverride = {
  id: string;
  languageCode: string;
  accent: string;
  term: string;
  phoneme: string;
  replacement: string;
  notes?: string;
};

export type VoiceLanguage = {
  code: string;
  label: string;
  accents: string[];
};

export type VoiceBehavior = {
  id: string;
  name: string;
  pacing: string;
  tone: string;
  emotionalWeight: string;
  guidance: string;
};

export type VoiceUseCase = {
  id: string;
  name: string;
  description: string;
  minWords: number;
  maxWords: number;
  qualityPriorities: string[];
};

export type VoiceRequest = {
  text: string;
  characterId: string;
  languageCode: string;
  accent: string;
  behaviorId: string;
  useCaseId: string;
  speed: number;
  pitch: number;
  energy: number;
  pronunciationOverrides?: PronunciationOverride[];
};

export const VOICE_CHARACTERS: VoiceCharacter[] = [
  {
    id: "orion-executive",
    name: "Orion Executive",
    archetype: "Strategic narrator",
    vocalSignature: "Crisp authority, calm confidence, premium articulation",
    strengths: ["Boardroom narration", "Product positioning", "Investor updates"],
    recommendedUseCaseIds: ["brand-film", "enterprise-demo", "launch-announcement"],
  },
  {
    id: "amara-storyteller",
    name: "Amara Storyteller",
    archetype: "Emotional narrator",
    vocalSignature: "Warm resonance, immersive pacing, emotionally rich contour",
    strengths: ["Narrative arcs", "Documentary intros", "Founder stories"],
    recommendedUseCaseIds: ["brand-film", "documentary", "podcast-intro"],
  },
  {
    id: "kai-energetic",
    name: "Kai Energetic",
    archetype: "High-momentum presenter",
    vocalSignature: "Bright projection, agile cadence, energetic clarity",
    strengths: ["Social ads", "Short-form hooks", "Promo trailers"],
    recommendedUseCaseIds: ["social-ad", "launch-announcement", "explainer"],
  },
  {
    id: "sana-educator",
    name: "Sana Educator",
    archetype: "Instruction specialist",
    vocalSignature: "Precise enunciation, balanced tempo, instructional confidence",
    strengths: ["Training modules", "How-to explainers", "Onboarding"],
    recommendedUseCaseIds: ["training", "explainer", "enterprise-demo"],
  },
  {
    id: "rafael-cinematic",
    name: "Rafael Cinematic",
    archetype: "Trailer voice",
    vocalSignature: "Deep cinematic gravity, dramatic pauses, textured impact",
    strengths: ["Trailers", "Event openers", "Cinematic branding"],
    recommendedUseCaseIds: ["trailer", "brand-film", "launch-announcement"],
  },
  {
    id: "mila-conversational",
    name: "Mila Conversational",
    archetype: "Human-centered guide",
    vocalSignature: "Natural phrasing, relatable warmth, social authenticity",
    strengths: ["Community messaging", "Lifestyle voiceover", "Customer stories"],
    recommendedUseCaseIds: ["podcast-intro", "social-ad", "documentary"],
  },
  {
    id: "darius-newsroom",
    name: "Darius Newsroom",
    archetype: "Editorial anchor",
    vocalSignature: "Fact-forward precision, composed urgency, objective delivery",
    strengths: ["Briefings", "Internal updates", "Crisis communications"],
    recommendedUseCaseIds: ["enterprise-demo", "training", "launch-announcement"],
  },
  {
    id: "yuna-luxury",
    name: "Yuna Luxury",
    archetype: "Premium brand voice",
    vocalSignature: "Velvet texture, intentional pacing, high-end poise",
    strengths: ["Luxury campaigns", "Hospitality narratives", "Beauty spots"],
    recommendedUseCaseIds: ["brand-film", "social-ad", "podcast-intro"],
  },
  {
    id: "leo-mentor",
    name: "Leo Mentor",
    archetype: "Trusted advisor",
    vocalSignature: "Grounded confidence, empathetic guidance, measured emphasis",
    strengths: ["Leadership messages", "Coaching", "Mission statements"],
    recommendedUseCaseIds: ["training", "documentary", "brand-film"],
  },
  {
    id: "nora-tech",
    name: "Nora Tech",
    archetype: "Technical communicator",
    vocalSignature: "Clear articulation, modular phrasing, high information density",
    strengths: ["Product walkthroughs", "API overviews", "Technical explainers"],
    recommendedUseCaseIds: ["explainer", "enterprise-demo", "training"],
  },
  {
    id: "idris-global",
    name: "Idris Global",
    archetype: "Cross-cultural host",
    vocalSignature: "Neutral international rhythm, precise diction, adaptable register",
    strengths: ["Global campaigns", "Multiregional updates", "Localization narration"],
    recommendedUseCaseIds: ["brand-film", "enterprise-demo", "podcast-intro"],
  },
  {
    id: "elena-empathetic",
    name: "Elena Empathetic",
    archetype: "Care-focused communicator",
    vocalSignature: "Gentle cadence, reassuring tone, trust-oriented phrasing",
    strengths: ["Healthcare messaging", "Support education", "Community trust"],
    recommendedUseCaseIds: ["training", "documentary", "explainer"],
    languageStrengths: ["en", "fr", "es"],
    accentStrengths: ["US General", "Canadian French", "Spain Castilian"],
  },
  {
    id: "zara-polyglot",
    name: "Zara Polyglot",
    archetype: "Multilingual campaign lead",
    vocalSignature: "Adaptive articulation, globally neutral rhythm, multilingual agility",
    strengths: ["Cross-market campaigns", "Localization rollouts", "Global launch scripts"],
    recommendedUseCaseIds: ["launch-announcement", "brand-film", "enterprise-demo"],
    languageStrengths: ["en", "es", "fr", "ar"],
    accentStrengths: ["US General", "Mexico", "France Parisian", "MSA"],
  },
  {
    id: "miguel-latin-promo",
    name: "Miguel Latin Promo",
    archetype: "High-energy bilingual promoter",
    vocalSignature: "Punchy cadence, rhythmic emphasis, confident campaign punch",
    strengths: ["Bilingual ads", "Event promos", "Retail announcements"],
    recommendedUseCaseIds: ["social-ad", "launch-announcement", "podcast-intro"],
    languageStrengths: ["es", "en", "pt"],
    accentStrengths: ["Mexico", "Colombia", "Brazilian"],
  },
  {
    id: "aiko-minimal",
    name: "Aiko Minimal",
    archetype: "Precision minimalist narrator",
    vocalSignature: "Clean timing, intentional silence, refined inflection economy",
    strengths: ["Premium product films", "Tech intros", "Luxury explainers"],
    recommendedUseCaseIds: ["brand-film", "explainer", "enterprise-demo"],
    languageStrengths: ["ja", "en"],
    accentStrengths: ["Tokyo", "US General"],
  },
  {
    id: "omar-gulf",
    name: "Omar Gulf",
    archetype: "Regional trust anchor",
    vocalSignature: "Confident depth, modern regional tone, clear formal delivery",
    strengths: ["Government messaging", "Finance communication", "Regional documentaries"],
    recommendedUseCaseIds: ["documentary", "enterprise-demo", "training"],
    languageStrengths: ["ar", "en"],
    accentStrengths: ["Gulf", "MSA", "UK RP"],
  },
  {
    id: "chloe-rp",
    name: "Chloe RP",
    archetype: "Editorial prestige voice",
    vocalSignature: "Elegant diction, measured British precision, premium broadcast tone",
    strengths: ["Luxury narratives", "Public service messaging", "Editorial promos"],
    recommendedUseCaseIds: ["brand-film", "documentary", "podcast-intro"],
    languageStrengths: ["en", "fr"],
    accentStrengths: ["UK RP", "UK Northern", "Belgian"],
  },
  {
    id: "tariq-swahili",
    name: "Tariq Swahili",
    archetype: "East Africa regional host",
    vocalSignature: "Grounded warmth, community-forward pacing, regional clarity",
    strengths: ["Regional campaigns", "Public education", "Community documentaries"],
    recommendedUseCaseIds: ["training", "documentary", "social-ad"],
    languageStrengths: ["sw", "en"],
    accentStrengths: ["Kenyan", "Tanzanian", "East African neutral"],
  },
  {
    id: "lucia-castilian",
    name: "Lucia Castilian",
    archetype: "European narrative specialist",
    vocalSignature: "Controlled projection, elegant phrasing, authoritative flow",
    strengths: ["Cultural storytelling", "Institutional narration", "Premium brand films"],
    recommendedUseCaseIds: ["brand-film", "documentary", "explainer"],
    languageStrengths: ["es", "pt", "fr"],
    accentStrengths: ["Spain Castilian", "European", "France Parisian"],
  },
  {
    id: "jin-seoul-tech",
    name: "Jin Seoul Tech",
    archetype: "Modern product announcer",
    vocalSignature: "Sharp clarity, modern pacing, technical confidence",
    strengths: ["Product launches", "Tech explainers", "App onboarding"],
    recommendedUseCaseIds: ["launch-announcement", "explainer", "enterprise-demo"],
    languageStrengths: ["ko", "ja", "en"],
    accentStrengths: ["Seoul", "Tokyo", "US General"],
  },
];

export const VOICE_LANGUAGES: VoiceLanguage[] = [
  { code: "en", label: "English", accents: ["US General", "US Southern", "UK RP", "UK Northern", "Australian", "Indian", "Nigerian"] },
  { code: "es", label: "Spanish", accents: ["Spain Castilian", "Mexico", "Colombia", "Argentina", "Chile"] },
  { code: "fr", label: "French", accents: ["France Parisian", "Canadian French", "Belgian", "West African French"] },
  { code: "de", label: "German", accents: ["Standard German", "Austrian", "Swiss German"] },
  { code: "it", label: "Italian", accents: ["Standard Italian", "Northern", "Southern"] },
  { code: "pt", label: "Portuguese", accents: ["Brazilian", "European", "Angolan"] },
  { code: "ar", label: "Arabic", accents: ["MSA", "Gulf", "Levantine", "Egyptian", "Maghrebi"] },
  { code: "hi", label: "Hindi", accents: ["Standard Hindi", "Delhi", "Mumbai"] },
  { code: "bn", label: "Bengali", accents: ["Kolkata", "Dhaka", "Sylheti-influenced"] },
  { code: "ur", label: "Urdu", accents: ["Pakistani Standard", "Karachi", "Lahore"] },
  { code: "ja", label: "Japanese", accents: ["Tokyo", "Kansai", "Hokkaido"] },
  { code: "ko", label: "Korean", accents: ["Seoul", "Busan", "Gyeongsang"] },
  { code: "zh", label: "Chinese Mandarin", accents: ["Mainland Standard", "Taiwan", "Singapore"] },
  { code: "id", label: "Indonesian", accents: ["Jakarta", "Javanese-influenced", "Balinese-influenced"] },
  { code: "ms", label: "Malay", accents: ["Malaysia Standard", "Singapore", "Brunei"] },
  { code: "th", label: "Thai", accents: ["Central Thai", "Northern", "Southern"] },
  { code: "tr", label: "Turkish", accents: ["Istanbul", "Anatolian", "Aegean"] },
  { code: "ru", label: "Russian", accents: ["Moscow", "Saint Petersburg", "Neutral broadcast"] },
  { code: "sw", label: "Swahili", accents: ["Kenyan", "Tanzanian", "East African neutral"] },
  { code: "nl", label: "Dutch", accents: ["Netherlands Standard", "Flemish Belgian"] },
];

export const VOICE_BEHAVIORS: VoiceBehavior[] = [
  { id: "executive", name: "Executive", pacing: "Measured", tone: "Confident", emotionalWeight: "Low", guidance: "Prioritize authority, concise cadence, and polished transitions." },
  { id: "conversational", name: "Conversational", pacing: "Natural", tone: "Friendly", emotionalWeight: "Medium", guidance: "Use human rhythm, keep lines approachable, avoid robotic intensity." },
  { id: "dramatic", name: "Dramatic", pacing: "Slow to medium", tone: "Intense", emotionalWeight: "High", guidance: "Insert deliberate pauses and stress pivotal words." },
  { id: "educational", name: "Educational", pacing: "Medium", tone: "Clear", emotionalWeight: "Low", guidance: "Segment concepts clearly and maintain instructional consistency." },
  { id: "urgent", name: "Urgent", pacing: "Fast", tone: "Focused", emotionalWeight: "Medium", guidance: "Drive momentum while preserving intelligibility under speed." },
  { id: "reassuring", name: "Reassuring", pacing: "Medium-slow", tone: "Calm", emotionalWeight: "Medium", guidance: "Soften consonant impact and emphasize supportive language." },
  { id: "luxury", name: "Luxury", pacing: "Slow", tone: "Refined", emotionalWeight: "Medium", guidance: "Keep elegant spacing and premium diction throughout." },
  { id: "storytelling", name: "Storytelling", pacing: "Variable", tone: "Immersive", emotionalWeight: "High", guidance: "Shape arcs with scene-by-scene tonal progression." },
  { id: "journalistic", name: "Journalistic", pacing: "Medium", tone: "Objective", emotionalWeight: "Low", guidance: "Lead with clarity, facts, and neutral emphasis." },
  { id: "motivational", name: "Motivational", pacing: "Medium-fast", tone: "Uplifting", emotionalWeight: "High", guidance: "Use energetic rises and optimistic landing phrases." },
  { id: "playful", name: "Playful", pacing: "Medium-fast", tone: "Bright", emotionalWeight: "Medium", guidance: "Maintain charm without sacrificing script precision." },
  { id: "technical", name: "Technical", pacing: "Medium", tone: "Analytical", emotionalWeight: "Low", guidance: "Honor terminology and structured delivery over flair." },
];

export const VOICE_USE_CASES: VoiceUseCase[] = [
  { id: "brand-film", name: "Brand Film", description: "High-trust storytelling for identity and positioning.", minWords: 70, maxWords: 280, qualityPriorities: ["emotional arc", "brand clarity", "premium pacing"] },
  { id: "social-ad", name: "Social Ad", description: "Fast impact for short-form campaign performance.", minWords: 20, maxWords: 120, qualityPriorities: ["hook speed", "memorability", "conversion clarity"] },
  { id: "explainer", name: "Explainer", description: "Clear concept communication for products or services.", minWords: 60, maxWords: 320, qualityPriorities: ["clarity", "structure", "retention"] },
  { id: "training", name: "Training", description: "Instructional delivery with consistency and low ambiguity.", minWords: 80, maxWords: 450, qualityPriorities: ["accuracy", "step sequence", "cognitive load"] },
  { id: "podcast-intro", name: "Podcast Intro", description: "Distinctive identity voice for recurring episodes.", minWords: 30, maxWords: 140, qualityPriorities: ["personality", "rhythm", "recall"] },
  { id: "trailer", name: "Trailer", description: "Cinematic stakes and dramatic momentum.", minWords: 35, maxWords: 180, qualityPriorities: ["impact", "suspense", "crescendo"] },
  { id: "enterprise-demo", name: "Enterprise Demo", description: "Professional walkthrough for B2B confidence.", minWords: 70, maxWords: 260, qualityPriorities: ["precision", "trust", "value framing"] },
  { id: "launch-announcement", name: "Launch Announcement", description: "Press-ready reveal with clarity and excitement.", minWords: 45, maxWords: 220, qualityPriorities: ["headline clarity", "momentum", "call-to-action"] },
  { id: "documentary", name: "Documentary", description: "Authentic narrative with human-centered detail.", minWords: 90, maxWords: 420, qualityPriorities: ["truthfulness", "human texture", "narrative depth"] },
];

function normalizeText(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

function sentenceChunks(text: string): string[] {
  return text
    .split(/[.!?]+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function countWordOverlapRatio(a: string, b: string): number {
  const aWords = new Set(a.toLowerCase().split(/\W+/).filter((word) => word.length > 3));
  const bWords = new Set(b.toLowerCase().split(/\W+/).filter((word) => word.length > 3));
  let overlap = 0;
  for (const word of aWords) {
    if (bWords.has(word)) {
      overlap += 1;
    }
  }
  const union = new Set([...aWords, ...bWords]).size;
  if (union === 0) {
    return 0;
  }
  return overlap / union;
}

function analyzeRepetition(sentences: string[]): { repeatedPairs: number; maxOverlap: number } {
  let repeatedPairs = 0;
  let maxOverlap = 0;

  for (let i = 0; i < sentences.length; i += 1) {
    for (let j = i + 1; j < sentences.length; j += 1) {
      const overlap = countWordOverlapRatio(sentences[i], sentences[j]);
      maxOverlap = Math.max(maxOverlap, overlap);
      if (overlap > 0.72) {
        repeatedPairs += 1;
      }
    }
  }

  return { repeatedPairs, maxOverlap: Number(maxOverlap.toFixed(3)) };
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function applyPronunciationOverrides(
  text: string,
  languageCode: string,
  accent: string,
  overrides: PronunciationOverride[]
): {
  transformedText: string;
  appliedOverrides: Array<{ id: string; term: string; replacement: string; phoneme: string }>;
} {
  let transformedText = text;
  const appliedOverrides: Array<{ id: string; term: string; replacement: string; phoneme: string }> = [];

  for (const override of overrides) {
    const isLanguageMatch = override.languageCode === languageCode;
    const isAccentMatch = override.accent === "*" || override.accent === accent;
    if (!isLanguageMatch || !isAccentMatch || !override.term.trim() || !override.replacement.trim()) {
      continue;
    }

    const pattern = new RegExp(`\\b${escapeRegExp(override.term.trim())}\\b`, "gi");
    if (!pattern.test(transformedText)) {
      continue;
    }

    transformedText = transformedText.replace(pattern, override.replacement.trim());
    appliedOverrides.push({
      id: override.id,
      term: override.term.trim(),
      replacement: override.replacement.trim(),
      phoneme: override.phoneme.trim(),
    });
  }

  return {
    transformedText,
    appliedOverrides,
  };
}

export function getVoiceStudioCatalog() {
  return {
    characters: VOICE_CHARACTERS,
    languages: VOICE_LANGUAGES,
    behaviors: VOICE_BEHAVIORS,
    useCases: VOICE_USE_CASES,
    compatibility: {
      universalCharacterSupport: true,
      note: "Every character can be paired with every language, accent, and behavior profile.",
    },
    starterTracks: [
      {
        id: "global-launch",
        name: "Global Launch",
        characterIds: ["orion-executive", "zara-polyglot", "jin-seoul-tech"],
        languageCodes: ["en", "es", "fr", "ko"],
      },
      {
        id: "regional-trust",
        name: "Regional Trust",
        characterIds: ["omar-gulf", "tariq-swahili", "elena-empathetic"],
        languageCodes: ["ar", "sw", "en"],
      },
    ],
  };
}

export function buildVoiceStudioPackage(input: VoiceRequest) {
  const text = normalizeText(input.text);
  if (text.length < 20) {
    throw new Error("Script text must be at least 20 characters.");
  }

  const character = VOICE_CHARACTERS.find((item) => item.id === input.characterId) ?? VOICE_CHARACTERS[0];
  const language = VOICE_LANGUAGES.find((item) => item.code === input.languageCode) ?? VOICE_LANGUAGES[0];
  const behavior = VOICE_BEHAVIORS.find((item) => item.id === input.behaviorId) ?? VOICE_BEHAVIORS[0];
  const useCase = VOICE_USE_CASES.find((item) => item.id === input.useCaseId) ?? VOICE_USE_CASES[0];
  const accent = language.accents.includes(input.accent) ? input.accent : language.accents[0];
  const overrides = Array.isArray(input.pronunciationOverrides) ? input.pronunciationOverrides : [];
  const pronunciation = applyPronunciationOverrides(text, language.code, accent, overrides);
  const processedText = pronunciation.transformedText;

  const speed = Math.min(Math.max(input.speed, 0.6), 1.4);
  const pitch = Math.min(Math.max(input.pitch, 0.75), 1.25);
  const energy = Math.min(Math.max(input.energy, 0.5), 1.5);

  const words = processedText.split(/\s+/).filter(Boolean);
  const sentenceList = sentenceChunks(processedText);
  const repetition = analyzeRepetition(sentenceList);

  const qualityChecks = {
    wordRange: {
      passed: words.length >= useCase.minWords && words.length <= useCase.maxWords,
      words: words.length,
      min: useCase.minWords,
      max: useCase.maxWords,
    },
    repetitionControl: {
      passed: repetition.repeatedPairs === 0,
      repeatedPairs: repetition.repeatedPairs,
      maxOverlap: repetition.maxOverlap,
      threshold: 0.72,
    },
    sentenceVariation: {
      passed: sentenceList.length >= 2,
      sentenceCount: sentenceList.length,
      minimum: 2,
    },
    controlBalance: {
      passed: speed >= 0.75 && speed <= 1.25 && pitch >= 0.8 && pitch <= 1.2 && energy >= 0.7 && energy <= 1.3,
      speed,
      pitch,
      energy,
      preferredRange: "speed 0.75-1.25, pitch 0.8-1.2, energy 0.7-1.3",
    },
  };

  const passed = Object.values(qualityChecks).every((check) => check.passed);

  const needs = [] as string[];
  if (words.length < useCase.minWords) {
    needs.push(`Expand the script with more concrete detail for ${useCase.name}.`);
  }
  if (words.length > useCase.maxWords) {
    needs.push(`Condense the script to fit ${useCase.name} attention span limits.`);
  }
  if (repetition.repeatedPairs > 0) {
    needs.push("Reduce repeated phrasing and replace duplicated terms with fresh wording.");
  }
  if (energy > 1.3 && behavior.id === "technical") {
    needs.push("Lower energy for technical narration so terminology remains precise.");
  }
  if (behavior.id === "dramatic" && speed > 1.15) {
    needs.push("Use slightly slower pacing so dramatic pauses can land effectively.");
  }
  if (behavior.id === "urgent" && speed < 1.0) {
    needs.push("Increase speed for urgency-driven delivery.");
  }

  if (needs.length === 0) {
    needs.push("Current settings are production-ready for this use case.");
  }

  const styleSummary = [
    `Character: ${character.name} (${character.archetype})`,
    `Language: ${language.label} | Accent: ${accent}`,
    `Behavior: ${behavior.name} | Tone: ${behavior.tone} | Pacing: ${behavior.pacing}`,
    `Controls: speed ${speed.toFixed(2)}, pitch ${pitch.toFixed(2)}, energy ${energy.toFixed(2)}`,
    `Pronunciation overrides applied: ${pronunciation.appliedOverrides.length}`,
  ].join("\n");

  const renderPrompt = [
    "VOICE STUDIO PRO RENDER BRIEF",
    styleSummary,
    `Use Case: ${useCase.name}`,
    `Narration Priorities: ${useCase.qualityPriorities.join(", ")}`,
    `Character Signature: ${character.vocalSignature}`,
    `Behavior Guidance: ${behavior.guidance}`,
    "Script:",
    processedText,
  ].join("\n");

  return {
    request: {
      text: processedText,
      characterId: character.id,
      languageCode: language.code,
      accent,
      behaviorId: behavior.id,
      useCaseId: useCase.id,
      speed,
      pitch,
      energy,
    },
    profile: {
      character,
      language,
      accent,
      behavior,
      useCase,
      universalCompatibility: true,
    },
    deliveryBlueprint: {
      opening: `Open with ${behavior.tone.toLowerCase()} intent and ${behavior.pacing.toLowerCase()} pacing in ${accent} ${language.label}.`,
      body: `Sustain ${character.vocalSignature.toLowerCase()} while emphasizing ${useCase.qualityPriorities.join(", ")}.`,
      close: "Finish with a deliberate landing line and controlled breath spacing.",
    },
    userNeedsAssessment: {
      priorities: useCase.qualityPriorities,
      recommendations: needs,
    },
    pronunciationReview: {
      appliedCount: pronunciation.appliedOverrides.length,
      entries: pronunciation.appliedOverrides,
      rawText: text,
      transformedText: processedText,
    },
    qualityReview: {
      passed,
      checks: qualityChecks,
    },
    renderPrompt,
  };
}
