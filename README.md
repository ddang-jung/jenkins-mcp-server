# Jenkins MCP Server

A Model Context Protocol (MCP) server that enables Claude to interact with Jenkins through various automation tools. This server provides comprehensive Jenkins management capabilities including job monitoring, build control, and queue management.

## Features

- **Job Management**: List jobs, get job configurations, and monitor job status
- **Build Control**: Trigger builds with parameters, stop running builds, and check build status
- **Build History**: Retrieve build history and detailed build information
- **Console Logs**: Access build console output for debugging
- **Queue Management**: Monitor Jenkins build queue and stuck builds
- **Folder Support**: Navigate Jenkins folders and organizational structures

## Installation

1. Clone the repository:
```bash
git clone https://github.com/ddang-jung/jenkins-mcp-server.git
cd jenkins-mcp-server
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

## Configuration

### Environment Variables

Set the following environment variables for Jenkins authentication:

- `JENKINS_URL`: Your Jenkins server URL (e.g., `http://localhost:8080`)
- `JENKINS_USER`: Your Jenkins username
- `JENKINS_TOKEN`: Your Jenkins API token (recommended) or password

### Getting Jenkins API Token

1. Log into Jenkins
2. Go to **Manage Jenkins** → **Manage Users** → Click your username
3. Click **Configure** → **API Token** → **Add new Token**
4. Copy the generated token

### Git Configuration

The project includes a comprehensive `.gitignore` file that excludes:
- Build artifacts (`build/`, `dist/`)
- Dependencies (`node_modules/`)
- Environment variables (`.env*`)
- Jenkins credentials and configuration files
- IDE files (`.vscode/`, `.idea/`)
- System files (`.DS_Store`, `Thumbs.db`)

**Important**: Never commit Jenkins credentials or API tokens to version control.

## Claude Desktop Configuration

Add this configuration to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "jenkins": {
      "command": "node",
      "args": ["/path/to/jenkins-mcp-server/build/index.js"],
      "env": {
        "JENKINS_URL": "http://your-jenkins-server:8080",
        "JENKINS_USER": "your-username",
        "JENKINS_TOKEN": "your-api-token"
      }
    }
  }
}
```

## Usage

### Starting the Server

```bash
npm start
```

The server runs on stdio and communicates with Claude through the MCP protocol.

### Development Mode

For development with auto-rebuild:
```bash
npm run watch
```

For debugging with MCP Inspector:
```bash
npm run inspector
```

## Available Tools

### 1. `get_build_status`
Get the status of a specific Jenkins build.

**Parameters:**
- `jobPath` (required): Path to the Jenkins job (e.g., "job/MyProject/job/main")
- `buildNumber` (optional): Build number or "lastBuild" for most recent

**Example:**
```json
{
  "jobPath": "job/MyProject",
  "buildNumber": "lastBuild"
}
```

### 2. `trigger_build`
Trigger a new Jenkins build with optional parameters.

**Parameters:**
- `jobPath` (required): Path to the Jenkins job
- `parameters` (optional): Build parameters as key-value pairs

**Example:**
```json
{
  "jobPath": "job/MyProject",
  "parameters": {
    "BRANCH": "main",
    "DEPLOY_ENV": "staging"
  }
}
```

### 3. `get_build_log`
Retrieve the console output of a specific build.

**Parameters:**
- `jobPath` (required): Path to the Jenkins job
- `buildNumber` (required): Build number or "lastBuild"

### 4. `list_jobs`
List all Jenkins jobs in a folder or at root level.

**Parameters:**
- `folderPath` (optional): Path to folder (e.g., "job/MyFolder") or empty for root

### 5. `get_build_history`
Get build history for a specific Jenkins job.

**Parameters:**
- `jobPath` (required): Path to the Jenkins job
- `limit` (optional): Number of recent builds to retrieve (default: 10)

### 6. `stop_build`
Stop a running Jenkins build.

**Parameters:**
- `jobPath` (required): Path to the Jenkins job
- `buildNumber` (required): Build number or "lastBuild"

### 7. `get_queue`
Get the current Jenkins build queue status.

**Parameters:** None

### 8. `get_job_config`
Get the configuration details of a Jenkins job.

**Parameters:**
- `jobPath` (required): Path to the Jenkins job

## Job Path Format

Jenkins job paths follow this format:
- Root level job: `job/JobName`
- Folder job: `job/FolderName/job/JobName`
- Multi-level: `job/Folder1/job/Folder2/job/JobName`

## Error Handling

The server provides comprehensive error handling:
- **Authentication errors**: Check your Jenkins credentials
- **Job not found**: Verify the job path format
- **Permission errors**: Ensure your Jenkins user has appropriate permissions
- **Network errors**: Check Jenkins server connectivity

## Development

### Project Structure

```
jenkins-mcp-server/
├── src/
│   └── index.ts          # Main server implementation
├── build/                # Compiled JavaScript output
├── package.json          # Project configuration
├── tsconfig.json         # TypeScript configuration
├── .gitignore           # Git ignore rules
└── README.md            # This file
```

### Scripts

- `npm run build`: Compile TypeScript to JavaScript
- `npm run watch`: Watch for changes and rebuild
- `npm run inspector`: Start MCP Inspector for debugging
- `npm run prepare`: Prepare build (runs automatically)
- `npm run clean`: Clean build artifacts and dependencies (macOS/Linux)
- `npm run clean:win`: Clean build artifacts and dependencies (Windows)

### Cleaning Project

To reset the project to its initial state (remove build artifacts and dependencies):

**macOS/Linux:**
```bash
npm run clean
# or manually:
rm -rf node_modules build package-lock.json
```

**Windows:**
```bash
npm run clean:win
# or manually:
rmdir /s /q node_modules & rmdir /s /q build & del package-lock.json
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Troubleshooting

### Common Issues

1. **"Jenkins API error"**: Check your Jenkins URL and credentials
2. **"Job not found"**: Verify the job path format (use `job/` prefix)
3. **"Permission denied"**: Ensure your Jenkins user has required permissions
4. **"Connection refused"**: Check if Jenkins server is running and accessible

### Debug Mode

Enable debug logging by setting:
```bash
export DEBUG=jenkins-mcp-server
```

For more information, visit the [Jenkins REST API documentation](https://www.jenkins.io/doc/book/using/remote-access-api/).