import { db, storage } from "@/lib/firebase/config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export const resumeService = {
  async uploadAndAnalyze(userId: string, file: File) {
    const storageRef = ref(storage, `resumes/${userId}/${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);

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
