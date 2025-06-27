# Jenkins MCP Server

MCP (Model Context Protocol) server for Jenkins automation. This server allows Claude to interact with Jenkins through various tools.

## Features

- List all Jenkins jobs
- Get detailed job information
- Trigger builds with parameters
- Get build logs
- Check build status

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

## Configuration

Set the following environment variables:

- `JENKINS_URL`: Your Jenkins server URL (default: http://localhost:8080)
- `JENKINS_USERNAME`: Your Jenkins username
- `JENKINS_API_TOKEN`: Your Jenkins API token

## Claude Desktop Configuration

Add this to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "jenkins": {
      "command": "node",
      "args": ["/path/to/jenkins-mcp-server/dist/index.js"],
      "env": {
        "JENKINS_URL": "http://your-jenkins-server:8080",
        "JENKINS_USERNAME": "your-username",
        "JENKINS_API_TOKEN": "your-api-token"
      }
    }
  }
}
```

## Usage

1. Start the server:
```bash
npm start
```

2. The server will run on stdio and can be used by Claude through the MCP protocol.

## Available Tools

- `list_jenkins_jobs`: Get all available Jenkins jobs
- `get_job_details`: Get detailed information about a specific job
- `trigger_build`: Trigger a build for a specific job
- `get_build_log`: Get console log for a specific build
- `get_build_status`: Get status of a specific build