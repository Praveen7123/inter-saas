import { Session, Evaluation } from "./session";

export interface Report {
  id: string;
  userId: string;
  sessionId: string;
  date: any;
  overallScore: number;
  behavioralMetrics: {
    eyeContact: number;
    engagement: number;
    confidence: number;
  };
  evaluation: Evaluation;
}
