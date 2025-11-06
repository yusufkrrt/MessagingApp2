// Arkadaşlık işlemleri ile ilgili iş mantığı ve koordinasyonu yöneten use-case'ler.
import { IFriendshipRepository } from '../repositories/IFriendshipRepository';
import { Friendship } from '../entities/Friendship';


export class FriendshipUseCases {
    constructor(private friendshipRepository: IFriendshipRepository) {}

    async sendFriendRequest(requesterId: string, identifier: string): Promise<void> {
        try {
            if (!requesterId) {
                throw new Error('Oturum açmanız gerekiyor');
            }
            if (!identifier) {
                throw new Error('Kullanıcı adı veya e-posta gerekli');
            }

            const user = await this.friendshipRepository.findUserByIdentifier(identifier);
            if (!user) {
                throw new Error('Kullanıcı bulunamadı. Lütfen kullanıcı adını kontrol edin.');
            }
            if (user.id === requesterId) {
                throw new Error('Kendinize arkadaşlık isteği gönderemezsiniz');
            }
            const friendsList = await this.friendshipRepository.getFriendsList(requesterId);
            const isAlreadyFriend = friendsList.some(
                f => f.friend?.id === user.id
            );
            if (isAlreadyFriend) {
                throw new Error('Bu kullanıcı zaten arkadaşınız');
            }
            await this.friendshipRepository.sendFriendRequest(requesterId, user.id);
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Arkadaşlık isteği gönderilirken bir hata oluştu');
        }
    }

    async respondToFriendRequest(
        friendshipId: string, 
        status: 'accepted' | 'rejected'
    ): Promise<void> {
        try {
            await this.friendshipRepository.respondToFriendRequest(friendshipId, status);
        } catch (error) {
            throw error;
        }
    }

    async getFriendsList(userId: string): Promise<Friendship[]> {
        try {
            return await this.friendshipRepository.getFriendsList(userId);
        } catch (error) {
            throw error;
        }
    }

    async getPendingRequests(userId: string): Promise<Friendship[]> {
        try {
            return await this.friendshipRepository.getPendingRequests(userId);
        } catch (error) {
            throw error;
        }
    }
}