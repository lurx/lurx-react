#!/usr/bin/env node

/**
 * Vanguardis MCP Server
 *
 * Provides programmatic access to the Vanguardis design system through MCP tools.
 * Allows clients to discover components, get documentation, generate code examples,
 * and interact with design tokens.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
	CallToolRequestSchema,
	ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { VanguardisTools } from './tools/index.js';

class VanguardisServer {
	private server: Server;
	private tools: VanguardisTools;

	constructor() {
		this.server = new Server(
			{
				name: 'vanguardis-mcp-server',
				version: '1.0.0',
			},
			{
				capabilities: {
					tools: {},
				},
			},
		);

		this.tools = new VanguardisTools();
		this.setupToolHandlers();
	}

	private setupToolHandlers(): void {
		this.server.setRequestHandler(ListToolsRequestSchema, async () => {
			return {
				tools: [
					{
						name: 'vanguardis_list_components',
						description:
							'List all available Vanguardis components with their descriptions and types',
						inputSchema: {
							type: 'object',
							properties: {
								category: {
									type: 'string',
									description:
										'Optional category filter (animation, layout, ui, provider)',
									enum: ['animation', 'layout', 'ui', 'provider'],
								},
							},
						},
					},
					{
						name: 'vanguardis_get_component',
						description:
							'Get detailed information about a specific Vanguardis component including props, usage examples, and TypeScript definitions',
						inputSchema: {
							type: 'object',
							properties: {
								componentName: {
									type: 'string',
									description: 'Name of the component to get information about',
								},
								includeExample: {
									type: 'boolean',
									description:
										'Whether to include usage examples (default: true)',
									default: true,
								},
							},
							required: ['componentName'],
						},
					},
					{
						name: 'vanguardis_get_design_tokens',
						description:
							'Get design tokens from the Vanguardis design system (colors, spacing, typography, etc.)',
						inputSchema: {
							type: 'object',
							properties: {
								category: {
									type: 'string',
									description: 'Category of design tokens to retrieve',
									enum: [
										'colors',
										'spacing',
										'typography',
										'shadows',
										'borderRadius',
										'animations',
										'all',
									],
									default: 'all',
								},
							},
						},
					},
					{
						name: 'vanguardis_generate_component_example',
						description:
							'Generate a complete usage example for a Vanguardis component with customizable props',
						inputSchema: {
							type: 'object',
							properties: {
								componentName: {
									type: 'string',
									description: 'Name of the component to generate example for',
								},
								props: {
									type: 'object',
									description: 'Props to customize the component example',
									additionalProperties: true,
								},
								includeImports: {
									type: 'boolean',
									description:
										'Whether to include import statements (default: true)',
									default: true,
								},
								wrapWithProvider: {
									type: 'boolean',
									description:
										'Whether to wrap example with VanguardisProvider (default: true)',
									default: true,
								},
							},
							required: ['componentName'],
						},
					},
					{
						name: 'vanguardis_get_hooks',
						description:
							'List and get documentation for Vanguardis custom React hooks',
						inputSchema: {
							type: 'object',
							properties: {
								hookName: {
									type: 'string',
									description:
										'Specific hook name to get documentation for (optional)',
								},
							},
						},
					},
					{
						name: 'vanguardis_get_utils',
						description:
							'List and get documentation for Vanguardis utility functions',
						inputSchema: {
							type: 'object',
							properties: {
								utilName: {
									type: 'string',
									description:
										'Specific utility function name to get documentation for (optional)',
								},
							},
						},
					},
					{
						name: 'vanguardis_search',
						description:
							'Search through Vanguardis components, hooks, and utilities by name or functionality',
						inputSchema: {
							type: 'object',
							properties: {
								query: {
									type: 'string',
									description:
										'Search query (component name, functionality, or keyword)',
								},
								type: {
									type: 'string',
									description: 'Type of items to search in',
									enum: ['components', 'hooks', 'utils', 'all'],
									default: 'all',
								},
							},
							required: ['query'],
						},
					},
				],
			};
		});

		this.server.setRequestHandler(CallToolRequestSchema, async request => {
			const { name, arguments: args } = request.params;

			try {
				switch (name) {
					case 'vanguardis_list_components':
						return {
							content: [
								{
									type: 'text',
									text: await this.tools.listComponents(
										args?.category as string,
									),
								},
							],
						};

					case 'vanguardis_get_component':
						return {
							content: [
								{
									type: 'text',
									text: await this.tools.getComponent(
										args?.componentName as string,
										args?.includeExample !== false,
									),
								},
							],
						};

					case 'vanguardis_get_design_tokens':
						return {
							content: [
								{
									type: 'text',
									text: await this.tools.getDesignTokens(
										(args?.category as string) || 'all',
									),
								},
							],
						};

					case 'vanguardis_generate_component_example':
						return {
							content: [
								{
									type: 'text',
									text: await this.tools.generateComponentExample(
										args?.componentName as string,
										(args?.props as Record<string, unknown>) || {},
										args?.includeImports !== false,
										args?.wrapWithProvider !== false,
									),
								},
							],
						};

					case 'vanguardis_get_hooks':
						return {
							content: [
								{
									type: 'text',
									text: await this.tools.getHooks(args?.hookName as string),
								},
							],
						};

					case 'vanguardis_get_utils':
						return {
							content: [
								{
									type: 'text',
									text: await this.tools.getUtils(args?.utilName as string),
								},
							],
						};

					case 'vanguardis_search':
						return {
							content: [
								{
									type: 'text',
									text: await this.tools.search(
										args?.query as string,
										(args?.type as string) || 'all',
									),
								},
							],
						};

					default:
						throw new Error(`Unknown tool: ${name}`);
				}
			} catch (error) {
				const errorMessage =
					error instanceof Error ? error.message : 'Unknown error occurred';
				return {
					content: [
						{
							type: 'text',
							text: `Error executing tool '${name}': ${errorMessage}`,
						},
					],
					isError: true,
				};
			}
		});
	}

	async run(): Promise<void> {
		const transport = new StdioServerTransport();
		await this.server.connect(transport);
	}
}

// Start the server if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
	const server = new VanguardisServer();
	server.run().catch(error => {
		console.error('Failed to run Vanguardis MCP server:', error);
		process.exit(1);
	});
}

export { VanguardisServer };
