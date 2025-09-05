#!/usr/bin/env node

/**
 * Manual test script for Vanguardis MCP Server
 * This script verifies that the server can be imported and instantiated
 */

import { VanguardisServer } from 'dist/libs/vanguardis-mcp-server/src/index.js';

async function testServer() {
  console.log('🧪 Testing Vanguardis MCP Server...');

  try {
    // Test server instantiation
    console.log('📦 Instantiating VanguardisServer...');
    const server = new VanguardisServer();
    console.log('✅ Server instantiated successfully');

    // Test that server has expected methods
    if (typeof server.run !== 'function') {
      throw new Error('Server missing run method');
    }
    console.log('✅ Server has run method');

    console.log('🎉 All tests passed!');
    console.log('\n📋 Server Information:');
    console.log('  - Tools: 7 available');
    console.log('  - Categories: animation, layout, ui, provider');
    console.log('  - Search: components, hooks, utils');
    console.log('  - Design Tokens: colors, spacing, typography, etc.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

testServer().catch(error => {
  console.error('💥 Unexpected error:', error);
  process.exit(1);
});
