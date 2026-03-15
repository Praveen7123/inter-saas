import { Evaluation } from "@/types/session";

export const evaluationService = {
  async generateEvaluation(sessionId: string, metrics: any, transcript?: string): Promise<Evaluation> {
    // In a real app, this would call an AI function (e.g. OpenAI or Gemini)
    // For now, we simulate the logic based on average metrics
    const avgConfidence = metrics.confidence || 70;
    const avgEngagement = metrics.engagement || 75;

    return {
      sessionId,
      communicationScore: Math.round((avgConfidence + avgEngagement) / 2),
      discoveryScore: 75, // Sample static value
      objectionHandlingScore: 80, // Sample static value
      productPitchScore: 70, // Sample static value
      feedback: "Strong candidate with good engagement. Confidence dipped slightly during objection handling.",
    };
  }
};
