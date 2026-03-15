"use client"

import { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useAuth } from "@/components/providers/auth-provider";
import { toast } from "sonner";
import { UserData } from "@/types/user";

export function useUsers() {
  const { role } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only admins should fetch all users
    if (role !== 'admin') {
      setUsers([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "users"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as UserData[];
      setUsers(userData);
      setLoading(false);
    }, (error) => {
      console.error("Users sync error:", error);
      toast.error(`Failed to sync users: ${error.message}`);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [role]);

  const updateUserRole = async (userId: string, newRole: 'admin' | 'user') => {
    try {
      await updateDoc(doc(db, "users", userId), { role: newRole });
      toast.success("User role updated");
    } catch (error: any) {
      toast.error(`Update failed: ${error.message}`);
    }
  };

  return { users, loading, updateUserRole };
}
