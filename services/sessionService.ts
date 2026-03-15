import { db, storage } from "@/lib/firebase/config";
import { collection, addDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
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
    let videoUrl = "";

    if (videoBlob) {
      const storageRef = ref(storage, `sessions/${sessionId}/video.webm`);
      await uploadBytes(storageRef, videoBlob);
      videoUrl = await getDownloadURL(storageRef);
    }

    await updateDoc(sessionRef, {
      status: 'completed',
      completedAt: serverTimestamp(),
      videoUrl,
    });
  },

  async uploadSnapshot(sessionId: string, blob: Blob, timestamp: number) {
    const storageRef = ref(storage, `sessions/${sessionId}/snapshots/${timestamp}.jpg`);
    await uploadBytes(storageRef, blob);
    return getDownloadURL(storageRef);
  }
};
