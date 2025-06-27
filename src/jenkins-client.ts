import axios, { AxiosInstance } from 'axios';
import { JenkinsConfig, JenkinsJob, JenkinsBuild, JenkinsJobDetail, BuildParameters } from './types';

export class JenkinsClient {
  private client: AxiosInstance;
  private config: JenkinsConfig;

  constructor(config: JenkinsConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: config.url,
      auth: {
        username: config.username,
        password: config.apiToken
      },
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  async getJobs(): Promise<JenkinsJob[]> {
    const response = await this.client.get('/api/json?tree=jobs[name,url,color,buildable]');
    return response.data.jobs;
  }

  async getJobDetails(jobName: string): Promise<JenkinsJobDetail> {
    const encodedJobName = encodeURIComponent(jobName);
    const response = await this.client.get(
      `/job/${encodedJobName}/api/json?tree=name,description,buildable,builds[number,url,result,building,timestamp,duration],lastBuild[number,url,result,building,timestamp,duration],nextBuildNumber`
    );
    return response.data;
  }

  async triggerBuild(jobName: string, parameters?: BuildParameters): Promise<string> {
    const encodedJobName = encodeURIComponent(jobName);
    
    if (parameters && Object.keys(parameters).length > 0) {
      const formData = new URLSearchParams();
      Object.entries(parameters).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
      
      const response = await this.client.post(
        `/job/${encodedJobName}/buildWithParameters`,
        formData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
      return response.headers.location || 'Build triggered successfully';
    } else {
      const response = await this.client.post(`/job/${encodedJobName}/build`);
      return response.headers.location || 'Build triggered successfully';
    }
  }

  async getBuildLog(jobName: string, buildNumber: number): Promise<string> {
    const encodedJobName = encodeURIComponent(jobName);
    const response = await this.client.get(
      `/job/${encodedJobName}/${buildNumber}/consoleText`
    );
    return response.data;
  }

  async getBuildStatus(jobName: string, buildNumber: number): Promise<JenkinsBuild> {
    const encodedJobName = encodeURIComponent(jobName);
    const response = await this.client.get(
      `/job/${encodedJobName}/${buildNumber}/api/json?tree=number,url,result,building,timestamp,duration`
    );
    return response.data;
  }
}