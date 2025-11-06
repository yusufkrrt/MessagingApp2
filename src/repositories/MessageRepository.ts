import { supabase } from "../lib/supabase";
import { Message } from "../entities/Message";
import IMessageRepository, { ConversationItem, PartnerProfile } from "./IMessageRepository";

export class MessageRepository implements IMessageRepository {
  async getMessagesBetween(userId: string, otherId: string): Promise<Message[]> {
    const { data: friendshipData, error: friendshipError } = await supabase
      .from('friends')
      .select('id')
      .or(`and(requester_id.eq.${userId},receiver_id.eq.${otherId}),and(requester_id.eq.${otherId},receiver_id.eq.${userId})`)
      .eq('status', 'accepted')
      .limit(1);

    if (friendshipError) throw friendshipError;
    if (!friendshipData || friendshipData.length === 0) return [];

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .or(`and(sender_id.eq.${userId},receiver_id.eq.${otherId}),and(sender_id.eq.${otherId},receiver_id.eq.${userId})`)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return (data as unknown) as Message[];
  }

  async sendMessage(senderId: string, receiverId: string, content: string): Promise<Message> {
    const { data: friendshipData, error: friendshipError } = await supabase
      .from('friends')
      .select('id')
      .or(`and(requester_id.eq.${senderId},receiver_id.eq.${receiverId}),and(requester_id.eq.${receiverId},receiver_id.eq.${senderId})`)
      .eq('status', 'accepted')
      .limit(1);

    if (friendshipError) throw friendshipError;
    if (!friendshipData || friendshipData.length === 0) throw new Error('Sadece onaylı arkadaşlara mesaj gönderilebilir');

    const { data, error } = await supabase
      .from("messages")
      .insert([{ sender_id: senderId, receiver_id: receiverId, content }])
      .select()
      .single();

    if (error) throw error;
    return (data as unknown) as Message;
  }

  async getConversations(userId: string): Promise<ConversationItem[]> {
    const { data: friendsData, error: friendsError } = await supabase
      .from('friends')
      .select(`
        id,
        requester_id,
        receiver_id,
        requester:profiles!requester_id(id,first_name,last_name,avatar_url),
        receiver:profiles!receiver_id(id,first_name,last_name,avatar_url)
      `)
      .or(`requester_id.eq.${userId},receiver_id.eq.${userId}`)
      .eq('status', 'accepted');

    if (friendsError) throw friendsError;

    const result: ConversationItem[] = [];

    for (const item of (friendsData || [])) {
      const partnerId = item.requester_id === userId ? item.receiver_id : item.requester_id;
      let partnerRaw: any = item.requester_id === userId ? item.receiver : item.requester;
      if (Array.isArray(partnerRaw)) partnerRaw = partnerRaw[0];
      const partner: PartnerProfile = {
        id: partnerRaw?.id,
        first_name: partnerRaw?.first_name,
        last_name: partnerRaw?.last_name,
        avatar_url: partnerRaw?.avatar_url,
      };

      const { data: lastMsgData, error: lastMsgError } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${userId},receiver_id.eq.${partnerId}),and(sender_id.eq.${partnerId},receiver_id.eq.${userId})`)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (lastMsgError && lastMsgError.code !== 'PGRST116') {
        throw lastMsgError;
      }

      const lastMessage = (lastMsgData as unknown) as Message | undefined;

      let unreadCount = 0;
      try {
        const { count, error: countError } = await supabase
          .from('messages')
          .select('id', { count: 'exact', head: false })
          .eq('sender_id', partnerId)
          .eq('receiver_id', userId)
          .eq('read', false);
        if (count && typeof count === 'number') unreadCount = count;
        if (countError) {
          console.warn('Unread count error', countError);
        }
      } catch (e) {
        console.warn('Unread count exception', e);
      }

      result.push({ partnerId, partner, lastMessage, unreadCount });
    }

    return result;
  }
}

export default MessageRepository;
