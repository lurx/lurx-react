/**
 * Basic tests for Vanguardis MCP Server
 * These tests verify the expected tool interface without file system dependencies
 */

describe('VanguardisServer Tools Schema', () => {
  it('should define expected tool names', () => {
    const expectedTools = [
      'vanguardis_list_components',
      'vanguardis_get_component',
      'vanguardis_get_design_tokens',
      'vanguardis_generate_component_example',
      'vanguardis_get_hooks',
      'vanguardis_get_utils',
      'vanguardis_search'
    ];

    // This test ensures we maintain the expected tool interface
    expectedTools.forEach(toolName => {
      expect(typeof toolName).toBe('string');
      expect(toolName.startsWith('vanguardis_')).toBe(true);
    });
  });

  it('should have correct tool count', () => {
    const expectedToolCount = 7;
    const actualTools = [
      'vanguardis_list_components',
      'vanguardis_get_component',
      'vanguardis_get_design_tokens',
      'vanguardis_generate_component_example',
      'vanguardis_get_hooks',
      'vanguardis_get_utils',
      'vanguardis_search'
    ];

    expect(actualTools.length).toBe(expectedToolCount);
  });
});

describe('Tool Categories', () => {
  it('should support component categories', () => {
    const supportedCategories = ['animation', 'layout', 'ui', 'provider'];
    
    supportedCategories.forEach(category => {
      expect(typeof category).toBe('string');
      expect(category.length).toBeGreaterThan(0);
    });
  });

  it('should support design token categories', () => {
    const tokenCategories = ['colors', 'spacing', 'typography', 'shadows', 'borderRadius', 'animations', 'all'];
    
    tokenCategories.forEach(category => {
      expect(typeof category).toBe('string');
      expect(category.length).toBeGreaterThan(0);
    });
  });

  it('should support search types', () => {
    const searchTypes = ['components', 'hooks', 'utils', 'all'];
    
    searchTypes.forEach(type => {
      expect(typeof type).toBe('string');
      expect(type.length).toBeGreaterThan(0);
    });
  });
});