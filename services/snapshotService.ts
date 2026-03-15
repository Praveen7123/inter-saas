import { db } from "@/lib/firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Snapshot } from "@/types/session";

export const snapshotService = {
  async logSnapshotMetrics(sessionId: string, metrics: Snapshot['metrics'], imageUrl?: string) {
    await addDoc(collection(db, "snapshots"), {
      sessionId,
      metrics,
      imageUrl,
      timestamp: Date.now(),
      createdAt: serverTimestamp(),
    });
  }
};
