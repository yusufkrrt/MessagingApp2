import { Friendship } from '../entities/Friendship';


export interface IFriendshipRepository {
    sendFriendRequest(requesterId: string, receiverId: string): Promise<void>;

    respondToFriendRequest(friendshipId: string, status: 'accepted' | 'rejected'): Promise<void>;
    
    getFriendsList(userId: string): Promise<Friendship[]>;
    
    getPendingRequests(userId: string): Promise<Friendship[]>;

    findUserByIdentifier(identifier: string): Promise<{ id: string; email?: string; username?: string } | null>;
}