import { Tool } from '@modelcontextprotocol/sdk/types.js';

export const JENKINS_TOOLS: Tool[] = [
  {
    name: 'list_jenkins_jobs',
    description: 'Get a list of all available Jenkins jobs',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_job_details',
    description: 'Get detailed information about a specific Jenkins job',
    inputSchema: {
      type: 'object',
      properties: {
        jobName: {
          type: 'string',
          description: 'Name of the Jenkins job'
        }
      },
      required: ['jobName']
    }
  },
  {
    name: 'trigger_build',
    description: 'Trigger a build for a specific Jenkins job',
    inputSchema: {
      type: 'object',
      properties: {
        jobName: {
          type: 'string',
          description: 'Name of the Jenkins job to trigger'
        },
        parameters: {
          type: 'object',
          description: 'Build parameters as key-value pairs',
          additionalProperties: {
            type: ['string', 'number', 'boolean']
          }
        }
      },
      required: ['jobName']
    }
  },
  {
    name: 'get_build_log',
    description: 'Get the console log for a specific build',
    inputSchema: {
      type: 'object',
      properties: {
        jobName: {
          type: 'string',
          description: 'Name of the Jenkins job'
        },
        buildNumber: {
          type: 'number',
          description: 'Build number to get the log for'
        }
      },
      required: ['jobName', 'buildNumber']
    }
  },
  {
    name: 'get_build_status',
    description: 'Get the status of a specific build',
    inputSchema: {
      type: 'object',
      properties: {
        jobName: {
          type: 'string',
          description: 'Name of the Jenkins job'
        },
        buildNumber: {
          type: 'number',
          description: 'Build number to check status for'
        }
      },
      required: ['jobName', 'buildNumber']
    }
  }
];