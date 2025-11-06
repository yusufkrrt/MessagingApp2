import { Message } from "../entities/Message";

export interface PartnerProfile {
  id: string; 
  first_name?: string; 
  last_name?: string; 
  avatar_url?: string | null; 
}
// Bir sohbet listesinin gösterimi için gerekli bilgileri tutar
export interface ConversationItem {
  partnerId: string; 
  partner?: PartnerProfile;
  lastMessage?: Message;
  unreadCount?: number;
}
// Mesajlarla ilgili temel veri kaynaklarını belirten arayüz
export interface IMessageRepository {
  // İki kullanıcı arasındaki tüm mesajları getirir
  getMessagesBetween(userId: string, otherId: string): Promise<Message[]>;
  // İki kullanıcı arasında yeni mesaj gönderir
  sendMessage(senderId: string, receiverId: string, content: string): Promise<Message>;
  // Kullanıcının dahil olduğu tüm sohbetlerin özet bilgilerini getirir
  getConversations(userId: string): Promise<ConversationItem[]>;
}

export default IMessageRepository;
