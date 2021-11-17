export interface Verona4LocalizedString {
  value: string;
  lang: string; // Language as ISO 639-1 Alpha-2
}

export const Verona4NotSupportedFeatures = [
  "stop-continue",
  "focus-notify",
  "report-on-demand",
  "log-policy",
  "paging-mode",
  "navigation-denied",
  "report-eager"
];

export type Verona4NotSupportedFeature = typeof Verona4NotSupportedFeatures[number];

export interface Verona4ModuleMetadata {
  "$schema": "https://raw.githubusercontent.com/verona-interfaces/metadata/master/verona-module-metadata.json";
  type: "editor" | "player";
  id: string;
  name: Verona4LocalizedString[];
  version: string;
  specVersion: string;
  description?: Verona4LocalizedString[];
  maintainer?: {
    name: Verona4LocalizedString[];
    email: string;
    url: string;
  }
  code?: {
    repositoryUrl?: string,
    repositoryType?: string,
    licenseType?: string,
    licenseUrl?: string
  },
  notSupportedFeatures?: Verona4NotSupportedFeature[]
}

export const VeronaModuleMetadataVersions = {
  'verona3': 'Unofficial Verona3-Metatag',
  'verona4': 'Verona4 JSON LD',
  'filename': 'Guessed by Filename as done pre Verona3'
}

export interface VeronaModuleMetadata {
  data: Verona4ModuleMetadata,
  metadataVersion: keyof typeof VeronaModuleMetadataVersions;
}


