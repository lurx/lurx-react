/**
 * Vanguardis MCP Tools
 * 
 * Core implementation of tools for interacting with the Vanguardis design system.
 * Provides methods to discover, document, and generate code examples for components.
 */

import * as fs from 'fs-extra';
import * as path from 'path';
import { glob } from 'glob';
import { ComponentInfo, DesignToken, HookInfo, UtilInfo } from './types.js';

export class VanguardisTools {
  private vanguardisPath: string;
  private componentsCache: ComponentInfo[] | null = null;
  private hooksCache: HookInfo[] | null = null;
  private utilsCache: UtilInfo[] | null = null;

  constructor() {
    // Find Vanguardis library path relative to the MCP server
    this.vanguardisPath = path.resolve(process.cwd(), '../vanguardis');
    
    // If not found, try alternative paths
    if (!fs.existsSync(this.vanguardisPath)) {
      this.vanguardisPath = path.resolve(process.cwd(), '../../libs/vanguardis');
    }
    
    if (!fs.existsSync(this.vanguardisPath)) {
      throw new Error('Vanguardis library not found. Please ensure the MCP server is run from the correct location.');
    }
  }

  /**
   * List all available components with optional category filtering
   */
  async listComponents(category?: string): Promise<string> {
    try {
      const components = await this.getComponentsInfo();
      let filteredComponents = components;

      if (category) {
        filteredComponents = components.filter(comp => comp.category === category);
      }

      if (filteredComponents.length === 0) {
        return category 
          ? `No components found in category: ${category}`
          : 'No components found';
      }

      const componentsList = filteredComponents.map(comp => {
        return `## ${comp.name}
- **Category**: ${comp.category}
- **Description**: ${comp.description}
- **File**: ${comp.filePath}
${comp.props.length > 0 ? `- **Props**: ${comp.props.length} available` : '- **Props**: None'}
${comp.hasTests ? '- **Tests**: ✅ Available' : '- **Tests**: ❌ Not available'}
`;
      }).join('\\n');

      return `# Vanguardis Components (${filteredComponents.length} found)

${componentsList}

**Categories available**: animation, layout, ui, provider

**Usage**: Use \`vanguardis_get_component\` to get detailed information about a specific component.`;
    } catch (error) {
      throw new Error(`Failed to list components: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get detailed information about a specific component
   */
  async getComponent(componentName: string, includeExample = true): Promise<string> {
    try {
      const components = await this.getComponentsInfo();
      const component = components.find(comp => 
        comp.name.toLowerCase() === componentName.toLowerCase() ||
        comp.name.toLowerCase().replace(/([A-Z])/g, '-$1').slice(1) === componentName.toLowerCase()
      );

      if (!component) {
        const availableComponents = components.map(c => c.name).join(', ');
        return `Component '${componentName}' not found. Available components: ${availableComponents}`;
      }

      let result = `# ${component.name}

${component.description}

## Information
- **Category**: ${component.category}
- **File**: ${component.filePath}
- **Tests**: ${component.hasTests ? '✅ Available' : '❌ Not available'}

`;

      // Add props information
      if (component.props.length > 0) {
        result += `## Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
${component.props.map(prop => 
  `| ${prop.name} | \`${prop.type}\` | ${prop.required ? '✅' : '❌'} | ${prop.defaultValue || 'N/A'} | ${prop.description || 'N/A'} |`
).join('\\n')}

`;
      } else {
        result += '## Props\n\nNo props available for this component.\n\n';
      }

      // Add TypeScript definition
      if (component.typeDefinition) {
        result += `## TypeScript Definition

\`\`\`typescript
${component.typeDefinition}
\`\`\`

`;
      }

      // Add usage example
      if (includeExample) {
        const example = await this.generateComponentExample(componentName, {}, true, true);
        result += `## Usage Example

${example}

`;
      }

      return result;
    } catch (error) {
      throw new Error(`Failed to get component info: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get design tokens from the design system
   */
  async getDesignTokens(category = 'all'): Promise<string> {
    try {
      const designTokensPath = path.join(this.vanguardisPath, 'src/types/design-system.types.ts');
      
      if (!fs.existsSync(designTokensPath)) {
        return 'Design tokens file not found';
      }

      const content = await fs.readFile(designTokensPath, 'utf-8');
      
      // Extract relevant type definitions based on category
      const tokens = this.parseDesignTokens(content, category);
      
      if (!tokens || tokens.length === 0) {
        return `No design tokens found for category: ${category}`;
      }

      let result = `# Vanguardis Design Tokens${category !== 'all' ? ` - ${category}` : ''}

`;

      tokens.forEach(token => {
        result += `## ${token.name}

${token.description ? token.description + '\\n' : ''}
\`\`\`typescript
${token.definition}
\`\`\`

**Available values**: ${token.values.join(', ')}

`;
      });

      return result;
    } catch (error) {
      throw new Error(`Failed to get design tokens: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate a component usage example
   */
  async generateComponentExample(
    componentName: string,
    props: Record<string, unknown> = {},
    includeImports = true,
    wrapWithProvider = true
  ): Promise<string> {
    try {
      const components = await this.getComponentsInfo();
      const component = components.find(comp => 
        comp.name.toLowerCase() === componentName.toLowerCase()
      );

      if (!component) {
        return `Component '${componentName}' not found`;
      }

      let example = '';

      // Add imports
      if (includeImports) {
        const imports = [component.name];
        if (wrapWithProvider && component.name !== 'VanguardisProvider') {
          imports.push('VanguardisProvider');
        }
        
        example += `\`\`\`typescript
import { ${imports.join(', ')} } from '@lurx-react/vanguardis';
import '@lurx-react/vanguardis/style';

`;
      } else {
        example += `\`\`\`typescript
`;
      }

      // Generate props string
      const propsString = this.generatePropsString(component, props);

      // Generate component usage
      const componentUsage = `<${component.name}${propsString}${this.isVoidElement(component.name) ? ' />' : `>
  {/* Component content */}
</${component.name}>`}`;

      // Wrap with provider if needed
      if (wrapWithProvider && component.name !== 'VanguardisProvider') {
        example += `export function Example() {
  return (
    <VanguardisProvider>
      ${componentUsage}
    </VanguardisProvider>
  );
}`;
      } else {
        example += `export function Example() {
  return (
    ${componentUsage}
  );
}`;
      }

      example += '\\n```';

      return example;
    } catch (error) {
      throw new Error(`Failed to generate example: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get information about available hooks
   */
  async getHooks(hookName?: string): Promise<string> {
    try {
      const hooks = await this.getHooksInfo();

      if (hookName) {
        const hook = hooks.find(h => h.name.toLowerCase() === hookName.toLowerCase());
        if (!hook) {
          const availableHooks = hooks.map(h => h.name).join(', ');
          return `Hook '${hookName}' not found. Available hooks: ${availableHooks}`;
        }

        return `# ${hook.name}

${hook.description}

## Parameters
${hook.parameters.length > 0 
  ? hook.parameters.map(param => `- **${param.name}**: \`${param.type}\` ${param.required ? '(required)' : '(optional)'} - ${param.description || 'N/A'}`).join('\\n')
  : 'No parameters'
}

## Returns
\`${hook.returnType}\` - ${hook.returnDescription || 'N/A'}

## Usage Example

\`\`\`typescript
${hook.example || `const result = ${hook.name}();`}
\`\`\`

**File**: ${hook.filePath}
`;
      }

      // List all hooks
      const hooksList = hooks.map(hook => {
        return `## ${hook.name}
- **Description**: ${hook.description}
- **Parameters**: ${hook.parameters.length}
- **Returns**: \`${hook.returnType}\`
- **File**: ${hook.filePath}
`;
      }).join('\\n');

      return `# Vanguardis Hooks (${hooks.length} found)

${hooksList}

**Usage**: Use \`vanguardis_get_hooks\` with a specific hook name to get detailed information.`;
    } catch (error) {
      throw new Error(`Failed to get hooks info: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get information about utility functions
   */
  async getUtils(utilName?: string): Promise<string> {
    try {
      const utils = await this.getUtilsInfo();

      if (utilName) {
        const util = utils.find(u => u.name.toLowerCase() === utilName.toLowerCase());
        if (!util) {
          const availableUtils = utils.map(u => u.name).join(', ');
          return `Utility '${utilName}' not found. Available utilities: ${availableUtils}`;
        }

        return `# ${util.name}

${util.description}

## Parameters
${util.parameters.length > 0 
  ? util.parameters.map(param => `- **${param.name}**: \`${param.type}\` ${param.required ? '(required)' : '(optional)'} - ${param.description || 'N/A'}`).join('\\n')
  : 'No parameters'
}

## Returns
\`${util.returnType}\` - ${util.returnDescription || 'N/A'}

## Usage Example

\`\`\`typescript
${util.example || `const result = ${util.name}();`}
\`\`\`

**File**: ${util.filePath}
`;
      }

      // List all utils
      const utilsList = utils.map(util => {
        return `## ${util.name}
- **Description**: ${util.description}
- **Parameters**: ${util.parameters.length}
- **Returns**: \`${util.returnType}\`
- **File**: ${util.filePath}
`;
      }).join('\\n');

      return `# Vanguardis Utilities (${utils.length} found)

${utilsList}

**Usage**: Use \`vanguardis_get_utils\` with a specific utility name to get detailed information.`;
    } catch (error) {
      throw new Error(`Failed to get utils info: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Search through components, hooks, and utilities
   */
  async search(query: string, type = 'all'): Promise<string> {
    try {
      const results: string[] = [];
      const searchQuery = query.toLowerCase();

      if (type === 'all' || type === 'components') {
        const components = await this.getComponentsInfo();
        const matchingComponents = components.filter(comp =>
          comp.name.toLowerCase().includes(searchQuery) ||
          comp.description.toLowerCase().includes(searchQuery) ||
          comp.category.toLowerCase().includes(searchQuery)
        );

        if (matchingComponents.length > 0) {
          results.push(`## Components (${matchingComponents.length} found)\\n` +
            matchingComponents.map(comp => `- **${comp.name}** (${comp.category}): ${comp.description}`).join('\\n')
          );
        }
      }

      if (type === 'all' || type === 'hooks') {
        const hooks = await this.getHooksInfo();
        const matchingHooks = hooks.filter(hook =>
          hook.name.toLowerCase().includes(searchQuery) ||
          hook.description.toLowerCase().includes(searchQuery)
        );

        if (matchingHooks.length > 0) {
          results.push(`## Hooks (${matchingHooks.length} found)\\n` +
            matchingHooks.map(hook => `- **${hook.name}**: ${hook.description}`).join('\\n')
          );
        }
      }

      if (type === 'all' || type === 'utils') {
        const utils = await this.getUtilsInfo();
        const matchingUtils = utils.filter(util =>
          util.name.toLowerCase().includes(searchQuery) ||
          util.description.toLowerCase().includes(searchQuery)
        );

        if (matchingUtils.length > 0) {
          results.push(`## Utilities (${matchingUtils.length} found)\\n` +
            matchingUtils.map(util => `- **${util.name}**: ${util.description}`).join('\\n')
          );
        }
      }

      if (results.length === 0) {
        return `No results found for query: "${query}" in ${type === 'all' ? 'all categories' : type}`;
      }

      return `# Search Results for "${query}"\\n\\n${results.join('\\n\\n')}`;
    } catch (error) {
      throw new Error(`Failed to search: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Private helper methods

  private async getComponentsInfo(): Promise<ComponentInfo[]> {
    if (this.componentsCache) {
      return this.componentsCache;
    }

    const componentsPath = path.join(this.vanguardisPath, 'src/components');
    const componentFiles = await glob('**/*.tsx', { cwd: componentsPath, ignore: ['**/*.test.tsx', '**/__tests__/**'] });

    const components: ComponentInfo[] = [];

    for (const file of componentFiles) {
      const fullPath = path.join(componentsPath, file);
      const content = await fs.readFile(fullPath, 'utf-8');
      const componentInfo = this.parseComponent(content, file);
      if (componentInfo) {
        components.push(componentInfo);
      }
    }

    this.componentsCache = components;
    return components;
  }

  private async getHooksInfo(): Promise<HookInfo[]> {
    if (this.hooksCache) {
      return this.hooksCache;
    }

    const hooksPath = path.join(this.vanguardisPath, 'src/hooks');
    const hookFiles = await glob('**/*.ts', { cwd: hooksPath, ignore: ['**/*.test.ts', '**/__tests__/**'] });

    const hooks: HookInfo[] = [];

    for (const file of hookFiles) {
      const fullPath = path.join(hooksPath, file);
      const content = await fs.readFile(fullPath, 'utf-8');
      const hooksFromFile = this.parseHooks(content, file);
      hooks.push(...hooksFromFile);
    }

    this.hooksCache = hooks;
    return hooks;
  }

  private async getUtilsInfo(): Promise<UtilInfo[]> {
    if (this.utilsCache) {
      return this.utilsCache;
    }

    const utilsPath = path.join(this.vanguardisPath, 'src/utils');
    const utilFiles = await glob('**/*.ts', { cwd: utilsPath, ignore: ['**/*.test.ts', '**/__tests__/**'] });

    const utils: UtilInfo[] = [];

    for (const file of utilFiles) {
      const fullPath = path.join(utilsPath, file);
      const content = await fs.readFile(fullPath, 'utf-8');
      const utilsFromFile = this.parseUtils(content, file);
      utils.push(...utilsFromFile);
    }

    this.utilsCache = utils;
    return utils;
  }

  private parseComponent(content: string, filePath: string): ComponentInfo | null {
    // Extract component name from file or content
    const fileName = path.basename(filePath, '.tsx');
    const componentNameMatch = content.match(/export\s+(?:default\s+)?(?:function|const)\s+(\w+)/);
    const componentName = componentNameMatch ? componentNameMatch[1] : this.toPascalCase(fileName);

    // Basic category detection
    let category: 'animation' | 'layout' | 'ui' | 'provider' = 'ui';
    if (filePath.includes('animation')) category = 'animation';
    else if (filePath.includes('layout')) category = 'layout';
    else if (fileName.includes('provider')) category = 'provider';

    // Extract description from comments
    const descriptionMatch = content.match(/\/\*\*\s*\n\s*\*\s*(.*?)\n/);
    const description = descriptionMatch ? descriptionMatch[1].trim() : `${componentName} component`;

    // Check for tests
    const testPath = filePath.replace('.tsx', '.test.tsx').replace('src/components/', 'src/components/__tests__/');
    const hasTests = fs.existsSync(path.join(this.vanguardisPath, testPath));

    // Extract props (basic implementation)
    const propsInterfaceMatch = content.match(/interface\s+\w*Props\s*{([^}]*)}/);
    const props = propsInterfaceMatch ? this.parseProps(propsInterfaceMatch[1]) : [];

    // Extract type definition
    const typeDefMatch = content.match(/(interface\s+\w*Props\s*{[^}]*})/);
    const typeDefinition = typeDefMatch ? typeDefMatch[1] : undefined;

    return {
      name: componentName,
      category,
      description,
      filePath,
      props,
      hasTests,
      typeDefinition,
    };
  }

  private parseHooks(content: string, filePath: string): HookInfo[] {
    const hooks: HookInfo[] = [];
    const hookMatches = content.matchAll(/export\s+(?:function\s+)?(use\w+)/g);

    for (const match of hookMatches) {
      const hookName = match[1];
      
      // Extract description from comments above the hook
      const hookPattern = new RegExp(`/\\*\\*[\\s\\S]*?\\*/[\\s\\S]*?export\\s+(?:function\\s+)?${hookName}`);
      const hookMatch = content.match(hookPattern);
      const description = hookMatch ? this.extractDescription(hookMatch[0]) : `${hookName} hook`;

      hooks.push({
        name: hookName,
        description,
        filePath,
        parameters: [], // TODO: Parse parameters
        returnType: 'unknown', // TODO: Parse return type
        returnDescription: undefined,
        example: undefined,
      });
    }

    return hooks;
  }

  private parseUtils(content: string, filePath: string): UtilInfo[] {
    const utils: UtilInfo[] = [];
    const utilMatches = content.matchAll(/export\s+(?:function\s+)?(\w+)/g);

    for (const match of utilMatches) {
      const utilName = match[1];
      
      // Skip type exports
      if (utilName.endsWith('Type') || utilName.endsWith('Interface')) {
        continue;
      }

      // Extract description from comments above the utility
      const utilPattern = new RegExp(`/\\*\\*[\\s\\S]*?\\*/[\\s\\S]*?export\\s+(?:function\\s+)?${utilName}`);
      const utilMatch = content.match(utilPattern);
      const description = utilMatch ? this.extractDescription(utilMatch[0]) : `${utilName} utility function`;

      utils.push({
        name: utilName,
        description,
        filePath,
        parameters: [], // TODO: Parse parameters
        returnType: 'unknown', // TODO: Parse return type
        returnDescription: undefined,
        example: undefined,
      });
    }

    return utils;
  }

  private parseDesignTokens(content: string, category: string): DesignToken[] {
    const tokens: DesignToken[] = [];
    
    // Categories mapping
    const categoryPatterns: Record<string, RegExp[]> = {
      colors: [/export type ColorVariant/, /export type ColorScale/],
      spacing: [/export type SpacingScale/],
      typography: [/export type FontSize/, /export type FontWeight/, /export type FontFamily/],
      shadows: [/export type BoxShadow/],
      borderRadius: [/export type BorderRadius/],
      animations: [/export type AnimationDuration/, /export type AnimationEasing/],
    };

    const patterns = category === 'all' 
      ? Object.values(categoryPatterns).flat()
      : categoryPatterns[category] || [];

    if (patterns.length === 0) {
      return tokens;
    }

    for (const pattern of patterns) {
      const matches = content.matchAll(new RegExp(pattern.source + '[\\s\\S]*?;', 'g'));
      
      for (const match of matches) {
        const definition = match[0];
        const nameMatch = definition.match(/export type (\w+)/);
        if (!nameMatch) continue;

        const name = nameMatch[1];
        const values = this.extractTypeValues(definition);
        
        tokens.push({
          name,
          description: `${name} design token`,
          definition,
          values,
          category: this.getTokenCategory(name),
        });
      }
    }

    return tokens;
  }

  private parseProps(propsString: string): Array<{ name: string; type: string; required: boolean; defaultValue?: string; description?: string }> {
    const props: Array<{ name: string; type: string; required: boolean; defaultValue?: string; description?: string }> = [];
    
    // Simple prop parsing - this could be enhanced with a proper TypeScript parser
    const propMatches = propsString.matchAll(/(\w+)(\?)?:\s*([^;]+);/g);
    
    for (const match of propMatches) {
      const [, name, optional, type] = match;
      props.push({
        name,
        type: type.trim(),
        required: !optional,
      });
    }

    return props;
  }

  private extractDescription(commentBlock: string): string {
    const match = commentBlock.match(/\/\*\*\s*\n\s*\*\s*(.*?)(?:\n|$)/);
    return match ? match[1].trim() : '';
  }

  private extractTypeValues(definition: string): string[] {
    const values: string[] = [];
    const matches = definition.matchAll(/'([^']+)'/g);
    
    for (const match of matches) {
      values.push(match[1]);
    }

    return values;
  }

  private getTokenCategory(name: string): string {
    const categoryMap: Record<string, string> = {
      ColorVariant: 'colors',
      ColorScale: 'colors',
      SpacingScale: 'spacing',
      FontSize: 'typography',
      FontWeight: 'typography',
      FontFamily: 'typography',
      BoxShadow: 'shadows',
      BorderRadius: 'borderRadius',
      AnimationDuration: 'animations',
      AnimationEasing: 'animations',
    };

    return categoryMap[name] || 'other';
  }

  private generatePropsString(component: ComponentInfo, customProps: Record<string, unknown>): string {
    if (Object.keys(customProps).length === 0) {
      return component.props.length > 0 ? '' : '';
    }

    const propsArray = Object.entries(customProps).map(([key, value]) => {
      if (typeof value === 'string') {
        return `${key}="${value}"`;
      }
      return `${key}={${JSON.stringify(value)}}`;
    });

    return propsArray.length > 0 ? `\\n  ${propsArray.join('\\n  ')}\\n` : '';
  }

  private isVoidElement(componentName: string): boolean {
    // List of components that are self-closing
    const voidElements = ['LoadingScreen'];
    return voidElements.includes(componentName);
  }

  private toPascalCase(str: string): string {
    return str.replace(/(^\w|[-_]\w)/g, (match) => match.replace(/[-_]/, '').toUpperCase());
  }
}

export * from './types.js';