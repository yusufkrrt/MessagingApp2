import { supabase } from '../lib/supabase';
import { IFriendshipRepository } from '../repositories/IFriendshipRepository';
import { Friendship, FriendshipStatus } from '../entities/Friendship';

export class FriendshipRepository implements IFriendshipRepository {
    async sendFriendRequest(requesterId: string, receiverId: string): Promise<void> {
        const { data: existing, error: existingError } = await supabase
            .from('friends')
            .select('*')
            .or(`and(requester_id.eq.${requesterId},receiver_id.eq.${receiverId}),and(requester_id.eq.${receiverId},receiver_id.eq.${requesterId})`)
            .limit(1);

        if (existingError) throw new Error('Arkadaşlık kontrolü yapılamadı');

        if (existing && existing.length > 0) {
            const row: any = existing[0];
            if (row.status === 'accepted') {
                throw new Error('Zaten arkadaşsınız');
            }
            if (row.status === 'pending') {
                if (row.requester_id === requesterId && row.receiver_id === receiverId) {
                    throw new Error('Daha önce isteği gönderdiniz');
                }
                if (row.requester_id === receiverId && row.receiver_id === requesterId) {
                    throw new Error('Bu kullanıcı size istek yolladı. Lütfen arkadaşlık istekleri sayfasından yanıtlayın.');
                }
            }
        }
        const { error } = await supabase
            .from('friends')
            .insert({
                requester_id: requesterId,
                receiver_id: receiverId,
                status: 'pending'
            });

        if (error) throw new Error('Arkadaşlık isteği gönderilemedi');
    }

    async respondToFriendRequest(friendshipId: string, status: 'accepted' | 'rejected'): Promise<void> {
        const { data: rows, error: fetchError } = await supabase
            .from('friends')
            .select('*')
            .eq('id', friendshipId)
            .limit(1);

        if (fetchError) throw new Error('Arkadaşlık isteği bulunamadı');

        if (!rows || rows.length === 0) throw new Error('Arkadaşlık isteği bulunamadı');

        const row: any = rows[0];

        const { error } = await supabase
            .from('friends')
            .update({ status })
            .eq('id', friendshipId);

        if (error) throw new Error('Arkadaşlık isteği yanıtlanamadı');

        if (status === 'accepted') {
            try {
                await supabase
                    .from('friends')
                    .delete()
                    .or(`and(requester_id.eq.${row.receiver_id},receiver_id.eq.${row.requester_id}),and(requester_id.eq.${row.requester_id},receiver_id.eq.${row.receiver_id})`)
                    .not('id', 'eq', friendshipId);
            } catch (e) {
                console.warn('Reverse cleanup failed', e);
            }
        }
    }

    async getFriendsList(userId: string): Promise<Friendship[]> {
        const { data, error } = await supabase
            .from('friends')
            .select(`
                *,
                requester:profiles!requester_id(*),
                receiver:profiles!receiver_id(*)
            `)
            .or(`requester_id.eq.${userId},receiver_id.eq.${userId}`)
            .eq('status', 'accepted');

        if (error) throw new Error('Arkadaş listesi alınamadı');

        return data.map(item => ({
            id: item.id,
            requesterId: item.requester_id,
            receiverId: item.receiver_id,
            status: item.status,
            createdAt: new Date(item.created_at),
            friend: userId === item.requester_id ? item.receiver : item.requester
        }));
    }

    async getPendingRequests(userId: string): Promise<Friendship[]> {
        const { data, error } = await supabase
            .from('friends')
            .select(`
                *,
                requester:profiles!requester_id(*),
                receiver:profiles!receiver_id(*)
            `)
            .eq('receiver_id', userId)
            .eq('status', 'pending');

        if (error) throw new Error('Bekleyen istekler alınamadı');

        return data.map(item => ({
            id: item.id,
            requesterId: item.requester_id,
            receiverId: item.receiver_id,
            status: item.status,
            createdAt: new Date(item.created_at),
            requester: item.requester
        }));
    }

    async findUserByIdentifier(identifier: string): Promise<{ id: string; email?: string; username?: string } | null> {
        try {
            console.log('Aranıyor:', identifier);
            const { data: authData, error: authError } = await supabase.auth
                .getUser();

            console.log('Auth user:', authData?.user);

            const { data: profiles, error: profilesError } = await supabase
                .from('profiles')
                .select('id, username, email');

            console.log('Bulunan profiller:', profiles);

            if (profiles) {
                const foundProfile = profiles.find(profile => 
                    profile.username === identifier || profile.email === identifier
                );
                if (foundProfile) {
                    return {
                        id: foundProfile.id,
                        username: foundProfile.username,
                        email: foundProfile.email
                    };
                }
            }

            if (profilesError) {
                console.error('Profil arama hatası:', profilesError);
            }
            return null;
        } catch (error) {
            console.error('Kullanıcı arama hatası:', error);
            return null;
        }
    }
}