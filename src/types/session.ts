export interface Session {
  id: string;
  userId: string;
  type: 'video' | 'call' | 'assignment';
  status: 'pending' | 'completed' | 'reviewed';
  startedAt: any;
  completedAt?: any;
  score?: number;
  videoUrl?: string;
  transcript?: string;
}

export interface Snapshot {
  id: string;
  sessionId: string;
  timestamp: number;
  metrics: {
    eyeContact: number;
    engagement: number;
    confidence: number;
  };
  imageUrl?: string;
}

export interface Evaluation {
  sessionId: string;
  communicationScore: number;
  discoveryScore: number;
  objectionHandlingScore: number;
  productPitchScore: number;
  feedback: string;
}
