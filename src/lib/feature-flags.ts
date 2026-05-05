type FlagName =
  | "workflowModes"
  | "retentionLayer"
  | "pwaReliability"
  | "adExperiments"
  | "localeKeywordExpansion"
  | "studyClusterLinks";

const DEFAULTS: Record<FlagName, boolean> = {
  workflowModes: false,
  retentionLayer: false,
  pwaReliability: false,
  adExperiments: false,
  localeKeywordExpansion: false,
  studyClusterLinks: true,
};

const ENV_KEYS: Record<FlagName, string> = {
  workflowModes: "NEXT_PUBLIC_FLAG_WORKFLOW_MODES",
  retentionLayer: "NEXT_PUBLIC_FLAG_RETENTION_LAYER",
  pwaReliability: "NEXT_PUBLIC_FLAG_PWA_RELIABILITY",
  adExperiments: "NEXT_PUBLIC_FLAG_AD_EXPERIMENTS",
  localeKeywordExpansion: "NEXT_PUBLIC_FLAG_LOCALE_KEYWORDS",
  studyClusterLinks: "NEXT_PUBLIC_FLAG_STUDY_CLUSTER_LINKS",
};

function parseFlag(value: string | undefined): boolean | undefined {
  if (value == null) return undefined;
  const normalized = value.trim().toLowerCase();
  if (["1", "true", "yes", "on"].includes(normalized)) return true;
  if (["0", "false", "no", "off"].includes(normalized)) return false;
  return undefined;
}

export function isFeatureEnabled(name: FlagName): boolean {
  const parsed = parseFlag(process.env[ENV_KEYS[name]]);
  return parsed ?? DEFAULTS[name];
}

export function getFeatureFlagSnapshot(): Record<FlagName, boolean> {
  return {
    workflowModes: isFeatureEnabled("workflowModes"),
    retentionLayer: isFeatureEnabled("retentionLayer"),
    pwaReliability: isFeatureEnabled("pwaReliability"),
    adExperiments: isFeatureEnabled("adExperiments"),
    localeKeywordExpansion: isFeatureEnabled("localeKeywordExpansion"),
    studyClusterLinks: isFeatureEnabled("studyClusterLinks"),
  };
}
