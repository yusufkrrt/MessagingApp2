export interface User {
    id: string; 
    email?: string;
    username?: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
    isOnline?: boolean;
    lastSeen?: Date;
    createdAt: Date;
}

export interface Profile extends User {
    bio?: string;
    phone?: string;
}