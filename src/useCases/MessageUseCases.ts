import IMessageRepository, { ConversationItem } from "../repositories/IMessageRepository";
import { Message } from "../entities/Message";

// Mesajlaşma ile ilgili tüm orchestrasyon, interface ve veri yönetimi bu class üzerinden sağlanır
export class MessageUseCases {
  private repo: IMessageRepository;

  // Mesaj işlemlerinin repository'ini constructor ile enjekte eder
  constructor(repo: IMessageRepository) {
    this.repo = repo;
  }

  // İki kullanıcı arasındaki mesajları getirir
  async getMessagesBetween(userId: string, otherId: string): Promise<Message[]> {
    return this.repo.getMessagesBetween(userId, otherId);
  }

  // Yeni mesaj gönderir
  async sendMessage(senderId: string, receiverId: string, content: string): Promise<Message> {
    return this.repo.sendMessage(senderId, receiverId, content);
  }

  // Kullanıcının dahil olduğu sohbetlerin özetlerini getirir
  async getConversations(userId: string): Promise<ConversationItem[]> {
    return this.repo.getConversations(userId);
  }
}

// Varsayılan dışa aktarım (MessageUseCases'in kendisi)
export default MessageUseCases;
