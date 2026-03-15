"use client"

import { useState, useEffect } from "react";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useAuth } from "@/components/providers/auth-provider";

import { toast } from "sonner";

export function useSessions() {
  const { user, role } = useAuth();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setSessions([]);
      setLoading(false);
      return;
    }

    const sessionsRef = collection(db, "sessions");
    let q;

    if (role === 'admin') {
      q = query(sessionsRef, orderBy("startedAt", "desc"));
    } else {
      q = query(
        sessionsRef,
        where("userId", "==", user.uid),
        orderBy("startedAt", "desc")
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const sessionData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSessions(sessionData);
      setLoading(false);
    }, (error) => {
      console.error("Snapshot error:", error);
      toast.error(`Sync error: ${error.message}`);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, role]);

  return { sessions, loading };
}
