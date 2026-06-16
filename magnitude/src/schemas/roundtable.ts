export interface RoundtableResponse {
  agent: string;
  role: string;
  content: string;
  timestamp: number;
}

export interface RoundtableSession {
  id: string;
  topic: string;
  startTime: number;
  endTime: number;
  duration: number;
  responses: RoundtableResponse[];
  synthesis: string;
  metadata: {
    modelVersions: Record<string, string>;
    tags: string[];
  };
}
