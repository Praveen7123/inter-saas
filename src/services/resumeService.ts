import { db } from "@/lib/firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export const resumeService = {
  async uploadAndAnalyze(userId: string, file: File) {
    // Skip storage upload as per user request
    const url = "local-file-skip-storage"; 

    const analysis = {
      salesMetrics: "Achieved 120% of quota consistently.",
      prospecting: "Cold outreach focus with 15% conversion rate.",
      crm: "Salesforce, HubSpot expertise.",
      suggestions: [
        "Highlight more specific SaaS revenue impact.",
        "Add details about B2B lifecycle management."
      ]
    };

    // Persist to Firestore
    await addDoc(collection(db, "resume_analysis"), {
      userId,
      fileUrl: url,
      fileName: file.name,
      analysis,
      createdAt: serverTimestamp()
    });

    return { url, analysis };
  }
};
