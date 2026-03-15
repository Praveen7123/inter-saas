"use client"

import { useState, useEffect } from "react";
import { collection, query, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useAuth } from "@/components/providers/auth-provider";
import { toast } from "sonner";

export interface Assignment {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'completed' | 'not started';
  type: string;
  assignedTo?: string; // Optional: userId or 'all'
  createdAt: any;
}

export function useAssignments() {
  const { user, role } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setAssignments([]);
      setLoading(false);
      return;
    }

    // Fetch all assignments — filter in memory to avoid composite index requirements
    const assignmentsRef = collection(db, "assignments");
    const q = query(assignmentsRef);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Assignment[];

      // Filter for non-admins: only show assignments for this user or 'all'
      if (role !== 'admin') {
        data = data.filter(a => a.assignedTo === 'all' || a.assignedTo === user.uid);
      }

      // Sort by createdAt descending in memory
      data.sort((a, b) => {
        const aTime = a.createdAt?.toMillis?.() ?? 0;
        const bTime = b.createdAt?.toMillis?.() ?? 0;
        return bTime - aTime;
      });

      setAssignments(data);
      setLoading(false);
    }, (error) => {
      console.error("Assignments sync error:", error);
      toast.error("Failed to sync assignments");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, role]);

  const createAssignment = async (assignment: Omit<Assignment, 'id' | 'createdAt'>) => {
    try {
      await addDoc(collection(db, "assignments"), {
        ...assignment,
        createdAt: serverTimestamp()
      });
      toast.success("Assignment created");
    } catch (error: any) {
      toast.error(`Failed to create: ${error.message}`);
    }
  };

  const deleteAssignment = async (id: string) => {
    try {
      await deleteDoc(doc(db, "assignments", id));
      toast.success("Assignment deleted");
    } catch (error: any) {
      toast.error(`Delete failed: ${error.message}`);
    }
  };

  return { assignments, loading, createAssignment, deleteAssignment };
}
