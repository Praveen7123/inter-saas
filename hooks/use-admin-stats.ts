"use client"

import { useState, useEffect } from "react";
import { collection, query, onSnapshot, getCountFromServer } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useAuth } from "@/components/providers/auth-provider";

export function useAdminStats() {
  const { role } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSessions: 0,
    avgScore: 0,
    needsReview: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (role !== 'admin') {
      setLoading(false);
      return;
    }

    // Listen to collections for real-time counts
    const unsubUsers = onSnapshot(collection(db, "users"), (snap) => {
      setStats(prev => ({ ...prev, totalUsers: snap.size }));
    });

    const unsubSessions = onSnapshot(collection(db, "sessions"), (snap) => {
      const docs = snap.docs.map(d => d.data());
      const total = snap.size;
      const completed = docs.filter(d => d.status === 'completed');
      const sumScore = completed.reduce((acc, curr) => acc + (curr.score || 0), 0);
      const avg = completed.length > 0 ? Math.round(sumScore / completed.length) : 0;
      const pending = docs.filter(d => d.status === 'pending').length;

      setStats(prev => ({ 
        ...prev, 
        totalSessions: total,
        avgScore: avg,
        needsReview: pending
      }));
      setLoading(false);
    });

    return () => {
      unsubUsers();
      unsubSessions();
    };
  }, [role]);

  return { stats, loading };
}
