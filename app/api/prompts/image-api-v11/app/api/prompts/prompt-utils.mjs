export function normalizeStory(story) {
  return story.trim().replace(/\s+/g, " ");
}

const STYLE_PROFILES = {
  cinematic: {
    primary: [
      "Establishing shot, cinematic composition, controlled lighting, high-detail realism.",
      "Narrative progression with intentional movement, visual tension, and editorial framing.",
      "Emotion-focused close framing, expressive subject detail, textured atmosphere.",
      "Resolution beat with decisive visual payoff, dramatic contrast, polished film finish.",
    ],
    alternate: [
      "Opening frame with disciplined wide angle, layered depth, and calibrated exposure.",
      "Advancing beat with motivated motion, visual rhythm, and continuity-aware framing.",
      "Character-intimate framing with nuanced expression and atmospheric density.",
      "Closure frame with strong contrast logic, compositional authority, and premium finish.",
    ],
  },
  trailer: {
    primary: [
      "Opening frame with iconic silhouette, high contrast lighting, and immediate stakes.",
      "Escalation beat with kinetic motion, impact-driven framing, and rhythmic visual momentum.",
      "Character pressure point shown through tight framing, urgency, and charged atmosphere.",
      "Final payoff frame with headline-worthy spectacle, dramatic scale, and premium finish.",
    ],
    alternate: [
      "Cold-open image with unmistakable shape language, sharp contrast, and instant tension.",
      "Acceleration beat with aggressive pace, forceful blocking, and trailer-grade cadence.",
      "Crisis close frame emphasizing jeopardy, compressed space, and emotional pressure.",
      "Signature end beat with theatrical scale, hard impact, and memorable visual punctuation.",
    ],
  },
  documentary: {
    primary: [
      "Grounded establishing frame with authentic environment detail and natural light fidelity.",
      "Observational progression shot focused on real-world process, context, and continuity.",
      "Human-centered close shot emphasizing expression, texture, and truthful emotional detail.",
      "Concluding frame that synthesizes insight, place, and narrative clarity.",
    ],
    alternate: [
      "Context-rich opener with verifiable setting cues and unembellished visual honesty.",
      "Process-driven middle frame documenting action, sequence, and practical cause-and-effect.",
      "Portrait-leaning detail frame prioritizing lived emotion and tactile realism.",
      "Reflective closing frame connecting evidence, people, and takeaway with restraint.",
    ],
  },
  ad: {
    primary: [
      "Brand-forward establishing frame with clean composition, premium lighting, and clear subject hierarchy.",
      "Benefit-focused action frame showcasing product use, confidence, and persuasive visual direction.",
      "Lifestyle close frame reinforcing trust, desirability, and aspirational tone.",
      "Conversion-oriented closing frame with memorable payoff and polished commercial finish.",
    ],
    alternate: [
      "Hero opener with immediate product readability, curated lighting, and premium visual language.",
      "Demonstration beat proving utility through precise action, clarity, and controlled pacing.",
      "Affinity close shot connecting brand promise to emotion, comfort, and social credibility.",
      "Decision-ready final frame with strong recall, concise emphasis, and campaign-grade polish.",
    ],
  },
  "brand-story": {
    primary: [
      "Identity-setting opening frame with signature color mood and intentional composition language.",
      "Value-driven progression frame showing craft, purpose, and brand character in action.",
      "Connection frame highlighting people, emotion, and authentic brand voice.",
      "Legacy-oriented closing frame with distinct recall cues and refined narrative closure.",
    ],
    alternate: [
      "Origin-focused opener with visual cues that establish heritage, ethos, and distinct tone.",
      "Craft-centered middle frame emphasizing standards, process discipline, and brand integrity.",
      "Community-facing close frame revealing empathy, trust signals, and human connection.",
      "Enduring final frame that consolidates meaning, memory hooks, and long-term brand recall.",
    ],
  },
};

function normalizeForComparison(value) {
  return value.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

function toKeywordTokens(value) {
  const stopWords = new Set([
    "the",
    "a",
    "an",
    "and",
    "or",
    "with",
    "for",
    "of",
    "to",
    "in",
    "on",
    "by",
    "is",
    "are",
    "that",
    "this",
    "through",
  ]);

  return normalizeForComparison(value)
    .split(" ")
    .filter((token) => token.length > 2 && !stopWords.has(token));
}

function analyzeSceneQuality(scenes) {
  const report = {
    checks: {
      sceneCount: { passed: false, expected: 4, actual: Array.isArray(scenes) ? scenes.length : 0 },
      uniqueScenes: { passed: false, uniqueCount: 0, totalCount: Array.isArray(scenes) ? scenes.length : 0 },
      minKeywordsPerScene: { passed: false, minRequired: 8, counts: [] },
      overlapLimit: { passed: false, maxAllowed: 0.72, maxFound: 0 },
    },
    reasons: [],
  };

  if (!Array.isArray(scenes)) {
    report.reasons.push("Invalid scenes payload.");
    return report;
  }

  report.checks.sceneCount.actual = scenes.length;
  report.checks.uniqueScenes.totalCount = scenes.length;
  report.checks.sceneCount.passed = scenes.length === 4;
  if (!report.checks.sceneCount.passed) {
    report.reasons.push("Scene count must be exactly 4.");
  }

  const normalizedScenes = scenes.map((scene) => normalizeForComparison(scene));
  const uniqueCount = new Set(normalizedScenes).size;
  report.checks.uniqueScenes.uniqueCount = uniqueCount;
  report.checks.uniqueScenes.passed = uniqueCount === scenes.length;
  if (!report.checks.uniqueScenes.passed) {
    report.reasons.push("Duplicate scene phrasing detected.");
  }

  const keywordGroups = scenes.map((scene) => new Set(toKeywordTokens(scene)));
  const keywordCounts = keywordGroups.map((group) => group.size);
  report.checks.minKeywordsPerScene.counts = keywordCounts;
  report.checks.minKeywordsPerScene.passed = keywordCounts.every((count) => count >= 8);
  if (!report.checks.minKeywordsPerScene.passed) {
    report.reasons.push("One or more scenes do not have enough meaningful keywords.");
  }

  let maxOverlap = 0;
  for (let i = 0; i < keywordGroups.length; i += 1) {
    for (let j = i + 1; j < keywordGroups.length; j += 1) {
      const a = keywordGroups[i];
      const b = keywordGroups[j];
      let overlap = 0;
      for (const token of a) {
        if (b.has(token)) {
          overlap += 1;
        }
      }
      const union = new Set([...a, ...b]).size;
      const overlapRatio = union > 0 ? overlap / union : 0;
      maxOverlap = Math.max(maxOverlap, overlapRatio);
    }
  }

  report.checks.overlapLimit.maxFound = Number(maxOverlap.toFixed(3));
  report.checks.overlapLimit.passed = maxOverlap <= report.checks.overlapLimit.maxAllowed;
  if (!report.checks.overlapLimit.passed) {
    report.reasons.push("Scene-to-scene lexical overlap is above the quality threshold.");
  }

  return report;
}

export function normalizeStyle(style) {
  if (typeof style !== "string") {
    return "cinematic";
  }

  const normalized = style.trim().toLowerCase();
  if (Object.hasOwn(STYLE_PROFILES, normalized)) {
    return normalized;
  }

  return "cinematic";
}

function splitIntoBeats(story) {
  return story
    .split(/[.!?]+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function uniqueBeats(beats) {
  const unique = [];
  for (const beat of beats) {
    const normalized = beat.toLowerCase();
    if (!unique.some((entry) => entry.toLowerCase() === normalized)) {
      unique.push(beat);
    }
  }
  return unique;
}

export function buildPromptScenes(story, style = "cinematic") {
  return buildPromptScenesWithQuality(story, style).scenes;
}

export function buildPromptScenesWithQuality(story, style = "cinematic") {
  const normalizedStory = normalizeStory(story);
  const normalizedStyle = normalizeStyle(style);

  if (!normalizedStory) {
    throw new Error("Story is required");
  }

  if (normalizedStory.length < 8) {
    throw new Error("Story is too short");
  }

  const beats = splitIntoBeats(normalizedStory);
  const baseBeats = uniqueBeats(beats.length > 0 ? beats : [normalizedStory]);
  const pickBeat = (index) => baseBeats[index] ?? baseBeats.at(-1) ?? normalizedStory;
  const profile = STYLE_PROFILES[normalizedStyle];
  const directiveSets = [
    { name: "primary", directives: profile.primary },
    { name: "alternate", directives: profile.alternate },
  ];

  for (const candidateSet of directiveSets) {
    const candidate = [
      `${pickBeat(0)}. ${candidateSet.directives[0]}`,
      `${pickBeat(1)}. ${candidateSet.directives[1]}`,
      `${pickBeat(2)}. ${candidateSet.directives[2]}`,
      `${pickBeat(3)}. ${candidateSet.directives[3]}`,
    ];
    const quality = analyzeSceneQuality(candidate);
    const passed = quality.checks.sceneCount.passed
      && quality.checks.uniqueScenes.passed
      && quality.checks.minKeywordsPerScene.passed
      && quality.checks.overlapLimit.passed;

    if (passed) {
      return {
        scenes: candidate,
        qualityReport: {
          passed: true,
          selectedStyle: normalizedStyle,
          variantUsed: candidateSet.name,
          checks: quality.checks,
          reasons: [],
        },
      };
    }
  }

  const fallbackScenes = [
    `${pickBeat(0)}. ${profile.alternate[0]}`,
    `${pickBeat(1)}. ${profile.alternate[1]}`,
    `${pickBeat(2)}. ${profile.alternate[2]}`,
    `${pickBeat(3)}. ${profile.alternate[3]}`,
  ];
  const fallbackQuality = analyzeSceneQuality(fallbackScenes);

  return {
    scenes: fallbackScenes,
    qualityReport: {
      passed: false,
      selectedStyle: normalizedStyle,
      variantUsed: "alternate",
      checks: fallbackQuality.checks,
      reasons: fallbackQuality.reasons,
    },
  };
}
