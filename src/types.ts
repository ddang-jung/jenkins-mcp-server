export interface JenkinsConfig {
  url: string;
  username: string;
  apiToken: string;
}

export interface JenkinsJob {
  name: string;
  url: string;
  color: string;
  buildable: boolean;
}

export interface JenkinsBuild {
  number: number;
  url: string;
  result: string | null;
  building: boolean;
  timestamp: number;
  duration: number;
}

export interface JenkinsJobDetail {
  name: string;
  description: string;
  buildable: boolean;
  builds: JenkinsBuild[];
  lastBuild: JenkinsBuild | null;
  nextBuildNumber: number;
}

export interface BuildParameters {
  [key: string]: string | number | boolean;
}