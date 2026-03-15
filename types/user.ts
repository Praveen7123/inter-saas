export type UserRole = 'admin' | 'user';

export interface UserData {
  id: string;
  email: string;
  role: UserRole;
  createdAt: any; // Firestore Timestamp
  displayName?: string;
  photoURL?: string;
}
