import { User } from './User';

export interface Friendship {
    id: string;
    requesterId: string;
    receiverId: string;
    status: FriendshipStatus;
    createdAt: Date;
    friend?: User;
    requester?: User;
}

export type FriendshipStatus = 'pending' | 'accepted' | 'rejected';