/**
 * Type definitions for Vanguardis MCP Server
 */

export interface ComponentInfo {
  name: string;
  category: 'animation' | 'layout' | 'ui' | 'provider';
  description: string;
  filePath: string;
  props: ComponentProp[];
  hasTests: boolean;
  typeDefinition?: string;
}

export interface ComponentProp {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: string;
  description?: string;
}

export interface HookInfo {
  name: string;
  description: string;
  filePath: string;
  parameters: HookParameter[];
  returnType: string;
  returnDescription?: string;
  example?: string;
}

export interface HookParameter {
  name: string;
  type: string;
  required: boolean;
  description?: string;
  defaultValue?: string;
}

export interface UtilInfo {
  name: string;
  description: string;
  filePath: string;
  parameters: UtilParameter[];
  returnType: string;
  returnDescription?: string;
  example?: string;
}

export interface UtilParameter {
  name: string;
  type: string;
  required: boolean;
  description?: string;
  defaultValue?: string;
}

export interface DesignToken {
  name: string;
  description: string;
  definition: string;
  values: string[];
  category: string;
}

export interface VanguardisConfig {
  version: string;
  description: string;
  componentsPath: string;
  hooksPath: string;
  utilsPath: string;
  typesPath: string;
  stylesPath: string;
}

export interface SearchResult {
  type: 'component' | 'hook' | 'util';
  name: string;
  description: string;
  filePath: string;
  category?: string;
}