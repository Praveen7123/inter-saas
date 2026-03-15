import { db } from "@/lib/firebase/config";
import { collection, addDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { Session } from "@/types/session";

export const sessionService = {
  async createSession(userId: string, type: 'video' | 'call' | 'assignment'): Promise<string> {
    const docRef = await addDoc(collection(db, "sessions"), {
      userId,
      type,
      status: 'pending',
      startedAt: serverTimestamp(),
    });
    return docRef.id;
  },

  async completeSession(sessionId: string, videoBlob?: Blob) {
    const sessionRef = doc(db, "sessions", sessionId);

    // Skip video upload to Storage as per user request (credit concerns)
    await updateDoc(sessionRef, {
      status: 'completed',
      completedAt: serverTimestamp(),
      videoUrl: "", // No persistent video URL without Storage
    });
  },

  async uploadSnapshot(sessionId: string, blob: Blob, timestamp: number) {
    // Skip snapshot upload to Storage
    console.log("Snapshot captured but skip upload (Storage disabled)");
    return ""; // No URL available
  }
};
