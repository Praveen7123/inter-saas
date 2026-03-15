"use client"

import { useState, useEffect } from "react";
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc } from "firebase/firestore";
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

    // Admin sees all, User sees restricted
    const assignmentsRef = collection(db, "assignments");
    let q;

    if (role === 'admin') {
      q = query(assignmentsRef, orderBy("createdAt", "desc"));
    } else {
      q = query(
        assignmentsRef, 
        where("assignedTo", "in", [user.uid, 'all']), 
        orderBy("createdAt", "desc")
      );
    }

    // Note: Firestore doesn't support 'match-any' easily without multiple queries or array-contains
    // For simplicity, let's just fetch all and filter in memory for now, 
    // OR just use a simpler query if 'all' is the default.
    // Let's stick to a simple query for now.
    
    const unsubscribe = onSnapshot(assignmentsRef, (snapshot) => {
      let data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Assignment[];

      if (role !== 'admin') {
        data = data.filter(a => a.assignedTo === user.uid || a.assignedTo === 'all');
      }

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
