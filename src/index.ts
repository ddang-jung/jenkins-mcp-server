#!/usr/bin/env node

import 'dotenv/config';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { 
  CallToolRequestSchema, 
  ListToolsRequestSchema 
} from '@modelcontextprotocol/sdk/types.js';
import { JenkinsClient } from './jenkins-client.js';
import { JENKINS_TOOLS } from './tools.js';
import { JenkinsConfig } from './types.js';

class JenkinsMCPServer {
  private server: Server;
  private jenkinsClient: JenkinsClient;

  constructor() {
    this.validateEnvironment();

    this.server = new Server({
      name: 'jenkins-mcp-server',
      version: '1.0.0'
    }, {
      capabilities: {
        tools: {}
      }
    });

    const config: JenkinsConfig = {
      url: process.env.JENKINS_URL!,
      username: process.env.JENKINS_USERNAME!,
      apiToken: process.env.JENKINS_API_TOKEN!
    };

    this.jenkinsClient = new JenkinsClient(config);
    this.setupHandlers();
  }

  private validateEnvironment(): void {
    const requiredEnvVars = ['JENKINS_URL', 'JENKINS_USERNAME', 'JENKINS_API_TOKEN'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
      console.error('Please set these variables or create a .env file');
      process.exit(1);
    }
  }

  private setupHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: JENKINS_TOOLS
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'list_jenkins_jobs': {
            const jobs = await this.jenkinsClient.getJobs();
            return {
              content: [{
                type: 'text',
                text: JSON.stringify(jobs, null, 2)
              }]
            };
          }

          case 'get_job_details': {
            if (!args?.jobName) {
              throw new Error('jobName is required');
            }
            const jobDetails = await this.jenkinsClient.getJobDetails(args.jobName as string);
            return {
              content: [{
                type: 'text',
                text: JSON.stringify(jobDetails, null, 2)
              }]
            };
          }

          case 'trigger_build': {
            if (!args?.jobName) {
              throw new Error('jobName is required');
            }
            const buildResult = await this.jenkinsClient.triggerBuild(
              args.jobName as string,
              args.parameters as any
            );
            return {
              content: [{
                type: 'text',
                text: `Build triggered successfully: ${buildResult}`
              }]
            };
          }

          case 'get_build_log': {
            if (!args?.jobName || typeof args.buildNumber !== 'number') {
              throw new Error('jobName and buildNumber are required');
            }
            const log = await this.jenkinsClient.getBuildLog(
              args.jobName as string,
              args.buildNumber as number
            );
            return {
              content: [{
                type: 'text',
                text: log
              }]
            };
          }

          case 'get_build_status': {
            if (!args?.jobName || typeof args.buildNumber !== 'number') {
              throw new Error('jobName and buildNumber are required');
            }
            const status = await this.jenkinsClient.getBuildStatus(
              args.jobName as string,
              args.buildNumber as number
            );
            return {
              content: [{
                type: 'text',
                text: JSON.stringify(status, null, 2)
              }]
            };
          }

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        console.error(`Error executing tool ${name}:`, errorMessage);
        return {
          content: [{
            type: 'text',
            text: `Error: ${errorMessage}`
          }],
          isError: true
        };
      }
    });
  }

  async run(): Promise<void> {
    try {
      const transport = new StdioServerTransport();
      await this.server.connect(transport);
      console.error('Jenkins MCP Server started successfully');
    } catch (error) {
      console.error('Failed to start Jenkins MCP Server:', error);
      process.exit(1);
    }
  }
}

const server = new JenkinsMCPServer();
server.run().catch((error) => {
  console.error('Unexpected error:', error);
  process.exit(1);
});