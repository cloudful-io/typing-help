const LANGUAGE_MAP: Record<string, string> = {
  "en-US": "English",
  "zh-Hant": "Chinese (Traditional)",
  "zh-Hans": "Chinese (Simplified)",
  "fr-FR": "French",
  "es-ES": "Spanish",
  // add more as needed
};

export function getLanguageName(languageCode: string): string {
  return LANGUAGE_MAP[languageCode] || languageCode; // fallback to code if not found
}