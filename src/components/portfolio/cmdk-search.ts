// Local BM25-ish full-text search for the portfolio command palette.
// Indexes every translated string under Portfolio.<section>, plus a small
// keyword set per section to catch generic/paraphrased queries.

export type Section =
  | "home"
  | "about"
  | "stack"
  | "journey"
  | "projects"
  | "contact";

export type SearchResult = {
  section: Section;
  score: number;
  snippet: string;
  matched: string[];
};

type Chunk = {
  section: Section;
  text: string;
  tokens: string[];
};

export type SearchIndex = {
  chunks: Chunk[];
  avgLen: number;
  df: Map<string, number>;
  N: number;
};

const STOPWORDS = new Set([
  // FR
  "le", "la", "les", "l", "un", "une", "des", "de", "du", "d", "et", "ou", "a",
  "au", "aux", "ce", "cet", "cette", "ces", "ma", "mon", "mes", "ta", "ton",
  "tes", "sa", "son", "ses", "je", "tu", "il", "elle", "on", "nous", "vous",
  "ils", "elles", "que", "qu", "qui", "quoi", "dont", "ou", "quand", "comme",
  "pour", "par", "sur", "avec", "est", "sont", "ai", "as", "avons", "avez",
  "ont", "pas", "ne", "ni", "si", "se", "leur", "leurs", "en", "y", "lui",
  "me", "te", "moi", "toi", "soi", "dans", "sans", "vers", "chez", "entre",
  "ainsi", "donc", "mais",
  // EN
  "the", "an", "and", "or", "but", "to", "of", "in", "on", "at", "for",
  "with", "by", "from", "is", "are", "was", "were", "be", "been", "being",
  "have", "has", "had", "do", "does", "did", "i", "you", "he", "she", "we",
  "they", "it", "this", "that", "these", "those", "as", "if", "so", "than",
  "then", "too", "very", "can", "will", "just", "into", "about", "over",
]);

export function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/[^a-z0-9'\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(s: string, keepStop = false): string[] {
  return normalize(s)
    .split(" ")
    .filter((t) => t.length >= 2 && (keepStop || !STOPWORDS.has(t)));
}

const SECTION_KEYWORDS_FR: Record<Section, string[]> = {
  home: [
    "accueil", "intro", "presentation", "bienvenue", "hero", "haut", "debut",
    "page principale", "tout en haut",
  ],
  about: [
    "a propos", "qui es-tu", "qui suis-je", "biographie", "bio", "presentation",
    "moi", "personnel", "histoire", "story", "manifeste", "qui",
  ],
  stack: [
    "stack", "technologies", "techno", "outils", "tools", "competences", "skills",
    "frameworks", "langages", "tech", "atelier", "ce que j'utilise",
    "tu utilises quoi", "what do you use", "tech stack",
  ],
  journey: [
    "parcours", "experience professionnelle", "experience pro", "experiences",
    "carriere", "histoire pro", "cv", "curriculum", "timeline", "formation",
    "etudes", "diplome", "alternance", "stage", "emploi", "travail",
    "ou as-tu travaille", "background", "where have you worked",
  ],
  projects: [
    "projets", "realisations", "portfolio", "travaux", "case study",
    "etudes de cas", "exemples", "showcase", "demos", "ce que j'ai fait",
    "what i built", "samples",
  ],
  contact: [
    "contact", "contacter", "me contacter", "ecrire", "email", "mail", "courriel",
    "reseaux", "social", "linkedin", "github", "joindre", "discuter", "embaucher",
    "engager", "comment te contacter", "message", "hire", "reach out",
  ],
};

const SECTION_KEYWORDS_EN: Record<Section, string[]> = {
  home: ["home", "intro", "welcome", "hero", "top", "landing", "main page"],
  about: [
    "about", "about me", "who are you", "who am i", "biography", "bio",
    "personal", "story", "manifesto", "who",
  ],
  stack: [
    "stack", "tech stack", "technologies", "tech", "tools", "skills",
    "frameworks", "languages", "what i use", "what do you use",
  ],
  journey: [
    "journey", "career", "experience", "professional experience", "work experience",
    "background", "history", "cv", "resume", "timeline", "education", "studies",
    "school", "internship", "jobs", "where have you worked", "employment",
  ],
  projects: [
    "projects", "work", "portfolio", "case studies", "showcase", "demos",
    "examples", "samples", "what i built",
  ],
  contact: [
    "contact", "reach out", "get in touch", "email", "mail", "social", "linkedin",
    "github", "hire", "message", "how to reach you",
  ],
};

const SECTION_MAP: Record<string, Section> = {
  hero: "home",
  about: "about",
  stack: "stack",
  journey: "journey",
  projects: "projects",
  contact: "contact",
};

function flattenStrings(node: unknown, acc: string[]) {
  if (node == null) return;
  if (typeof node === "string") {
    const s = node.trim();
    if (s) acc.push(s);
  } else if (Array.isArray(node)) {
    for (const v of node) flattenStrings(v, acc);
  } else if (typeof node === "object") {
    for (const v of Object.values(node as Record<string, unknown>))
      flattenStrings(v, acc);
  }
}

function chunksFromSubtree(obj: unknown, section: Section): Chunk[] {
  const chunks: Chunk[] = [];
  if (obj == null) return chunks;
  if (typeof obj === "string") {
    const tokens = tokenize(obj);
    if (tokens.length) chunks.push({ section, text: obj, tokens });
    return chunks;
  }
  if (Array.isArray(obj)) {
    for (const item of obj) {
      if (item && typeof item === "object") {
        // Concat all string values of the object into one chunk for context
        const acc: string[] = [];
        flattenStrings(item, acc);
        const text = acc.join(" · ");
        const tokens = tokenize(text);
        if (tokens.length) chunks.push({ section, text, tokens });
      } else {
        chunks.push(...chunksFromSubtree(item, section));
      }
    }
    return chunks;
  }
  if (typeof obj === "object") {
    for (const v of Object.values(obj as Record<string, unknown>)) {
      chunks.push(...chunksFromSubtree(v, section));
    }
  }
  return chunks;
}

export function buildIndex(messages: unknown, locale: string): SearchIndex {
  const portfolio =
    (messages as { Portfolio?: Record<string, unknown> })?.Portfolio || {};
  const chunks: Chunk[] = [];

  for (const [key, section] of Object.entries(SECTION_MAP)) {
    const sub = (portfolio as Record<string, unknown>)[key];
    if (sub) chunks.push(...chunksFromSubtree(sub, section));
  }

  const KW = locale === "fr" ? SECTION_KEYWORDS_FR : SECTION_KEYWORDS_EN;
  for (const section of Object.keys(KW) as Section[]) {
    const text = KW[section].join(" · ");
    const tokens = tokenize(text, true);
    if (tokens.length) chunks.push({ section, text, tokens });
  }

  const df = new Map<string, number>();
  for (const c of chunks) {
    const seen = new Set<string>();
    for (const t of c.tokens) {
      if (seen.has(t)) continue;
      seen.add(t);
      df.set(t, (df.get(t) || 0) + 1);
    }
  }

  const totalLen = chunks.reduce((a, c) => a + c.tokens.length, 0);
  const avgLen = chunks.length > 0 ? totalLen / chunks.length : 0;

  return { chunks, avgLen, df, N: chunks.length };
}

export function searchIndex(
  idx: SearchIndex,
  query: string
): SearchResult[] {
  const qTokens = tokenize(query, true);
  if (qTokens.length === 0) return [];

  const k1 = 1.5;
  const b = 0.75;

  type ScoredChunk = {
    chunk: Chunk;
    score: number;
    matches: Set<string>;
  };

  const scored: ScoredChunk[] = [];

  for (const c of idx.chunks) {
    let total = 0;
    const matches = new Set<string>();

    for (const q of qTokens) {
      let tf = 0;
      let bestHit = "";
      for (const t of c.tokens) {
        if (t === q) {
          tf += 1;
          bestHit = t;
        } else if (q.length >= 3 && t.startsWith(q) && t.length <= q.length + 4) {
          tf += 0.7;
          if (!bestHit) bestHit = t;
        } else if (t.length >= 4 && q.startsWith(t)) {
          tf += 0.5;
          if (!bestHit) bestHit = t;
        }
      }
      if (tf > 0) {
        const dfHit = Math.max(idx.df.get(q) || 0, 1);
        const idf = Math.log(1 + (idx.N - dfHit + 0.5) / (dfHit + 0.5));
        const lenNorm =
          tf * (k1 + 1) /
          (tf + k1 * (1 - b + b * (c.tokens.length / Math.max(idx.avgLen, 1))));
        total += idf * lenNorm;
        if (bestHit) matches.add(bestHit);
      }
    }

    if (total > 0) scored.push({ chunk: c, score: total, matches });
  }

  // Aggregate per section: sum of best 3 chunk scores, plus single best chunk used for snippet.
  type Agg = {
    section: Section;
    aggScore: number;
    bestChunk: Chunk;
    bestScore: number;
    matches: Set<string>;
  };
  const bySection = new Map<Section, Agg>();
  const sortedScored = [...scored].sort((a, b) => b.score - a.score);
  for (const s of sortedScored) {
    const cur = bySection.get(s.chunk.section);
    if (!cur) {
      bySection.set(s.chunk.section, {
        section: s.chunk.section,
        aggScore: s.score,
        bestChunk: s.chunk,
        bestScore: s.score,
        matches: new Set(s.matches),
      });
    } else {
      // Add diminished score for additional matching chunks
      cur.aggScore += s.score * 0.4;
      for (const m of s.matches) cur.matches.add(m);
    }
  }

  return Array.from(bySection.values())
    .map((a) => ({
      section: a.section,
      score: a.aggScore,
      snippet: makeSnippet(a.bestChunk.text, [...a.matches]),
      matched: [...a.matches],
    }))
    .sort((x, y) => y.score - x.score);
}

function makeSnippet(text: string, matches: string[]): string {
  const cleaned = text.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
  if (cleaned.length <= 140) return cleaned;
  const lower = normalize(cleaned);
  let earliest = -1;
  for (const m of matches) {
    if (!m) continue;
    const i = lower.indexOf(m);
    if (i >= 0 && (earliest === -1 || i < earliest)) earliest = i;
  }
  const center = earliest >= 0 ? earliest : 0;
  const start = Math.max(0, center - 60);
  const end = Math.min(cleaned.length, start + 140);
  let snip = cleaned.slice(start, end);
  if (start > 0) snip = "…" + snip;
  if (end < cleaned.length) snip = snip + "…";
  return snip;
}
