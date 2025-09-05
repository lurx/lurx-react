# Vanguardis MCP Server

A Model Context Protocol (MCP) server that provides programmatic access to the Vanguardis design system. This server allows MCP clients to discover components, get documentation, generate code examples, and interact with design tokens.

## Overview

The Vanguardis MCP Server exposes the following capabilities:

- **Component Discovery**: List and explore all Vanguardis components with detailed information
- **Documentation Access**: Get comprehensive documentation for components, hooks, and utilities
- **Code Generation**: Generate usage examples with customizable props
- **Design Tokens**: Access design system tokens (colors, spacing, typography, etc.)
- **Search**: Search through all Vanguardis resources by name or functionality

## Installation

```bash
cd libs/vanguardis-mcp-server
npm install
npm run build
```

## Usage

### Running the Server

```bash
npm start
```

The server runs as a stdio transport MCP server, suitable for integration with MCP clients.

### Available Tools

#### `vanguardis_list_components`
List all available Vanguardis components with optional category filtering.

**Parameters:**
- `category` (optional): Filter by category (`animation`, `layout`, `ui`, `provider`)

**Example:**
```json
{
  "name": "vanguardis_list_components",
  "arguments": {
    "category": "animation"
  }
}
```

#### `vanguardis_get_component`
Get detailed information about a specific component including props, TypeScript definitions, and usage examples.

**Parameters:**
- `componentName` (required): Name of the component
- `includeExample` (optional, default: true): Whether to include usage examples

**Example:**
```json
{
  "name": "vanguardis_get_component",
  "arguments": {
    "componentName": "FadeIn",
    "includeExample": true
  }
}
```

#### `vanguardis_get_design_tokens`
Get design tokens from the Vanguardis design system.

**Parameters:**
- `category` (optional, default: "all"): Category of tokens (`colors`, `spacing`, `typography`, `shadows`, `borderRadius`, `animations`, `all`)

**Example:**
```json
{
  "name": "vanguardis_get_design_tokens",
  "arguments": {
    "category": "colors"
  }
}
```

#### `vanguardis_generate_component_example`
Generate a complete usage example for a component with customizable props.

**Parameters:**
- `componentName` (required): Name of the component
- `props` (optional): Object with props to customize the example
- `includeImports` (optional, default: true): Whether to include import statements
- `wrapWithProvider` (optional, default: true): Whether to wrap with VanguardisProvider

**Example:**
```json
{
  "name": "vanguardis_generate_component_example",
  "arguments": {
    "componentName": "FadeIn",
    "props": {
      "delay": 200,
      "duration": 600
    },
    "includeImports": true,
    "wrapWithProvider": true
  }
}
```

#### `vanguardis_get_hooks`
List and get documentation for Vanguardis custom React hooks.

**Parameters:**
- `hookName` (optional): Specific hook name to get documentation for

**Example:**
```json
{
  "name": "vanguardis_get_hooks",
  "arguments": {
    "hookName": "useAnimation"
  }
}
```

#### `vanguardis_get_utils`
List and get documentation for Vanguardis utility functions.

**Parameters:**
- `utilName` (optional): Specific utility function name to get documentation for

**Example:**
```json
{
  "name": "vanguardis_get_utils",
  "arguments": {
    "utilName": "createScope"
  }
}
```

#### `vanguardis_search`
Search through Vanguardis components, hooks, and utilities by name or functionality.

**Parameters:**
- `query` (required): Search query (component name, functionality, or keyword)
- `type` (optional, default: "all"): Type of items to search (`components`, `hooks`, `utils`, `all`)

**Example:**
```json
{
  "name": "vanguardis_search",
  "arguments": {
    "query": "animation",
    "type": "components"
  }
}
```

## Development

### Project Structure

```
src/
├── index.ts          # Main server entry point
├── tools/
│   ├── index.ts      # Core tools implementation
│   └── types.ts      # Type definitions
└── __tests__/        # Test files
```

### Building

```bash
npm run build
```

### Development Mode

```bash
npm run dev
```

### Testing

```bash
npm test
```

### Linting

```bash
npm run lint
```

## Configuration

The server automatically discovers the Vanguardis library by looking for it in these paths:
1. `../vanguardis` (relative to server directory)
2. `../../libs/vanguardis` (monorepo structure)

Ensure the server is run from a location where it can find the Vanguardis library.

## Integration with MCP Clients

This server is designed to work with MCP clients like Claude Code. Add it to your MCP configuration:

```json
{
  "mcpServers": {
    "vanguardis": {
      "command": "node",
      "args": ["path/to/vanguardis-mcp-server/dist/index.js"],
      "env": {}
    }
  }
}
```

## Features

- **Type Safety**: Full TypeScript support with comprehensive type definitions
- **Caching**: Intelligent caching of component, hook, and utility information
- **Error Handling**: Robust error handling with helpful error messages
- **Extensible**: Easy to extend with new tools and capabilities
- **Performance**: Efficient file parsing and information extraction

## Architecture

The server uses the Model Context Protocol SDK to provide a standardized interface for AI assistants to interact with the Vanguardis design system. It parses TypeScript files to extract component information, documentation, and examples, making it easy for AI assistants to understand and use the design system.

Key components:
- **VanguardisServer**: Main server class that handles MCP protocol
- **VanguardisTools**: Core implementation of all tools and functionality
- **File Parsing**: TypeScript and documentation parsing utilities
- **Caching System**: Performance optimization through intelligent caching

## License

MIT - Same as the parent Vanguardis project