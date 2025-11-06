import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MessageUseCases } from '../useCases/MessageUseCases';
import { MessageRepository } from '../repositories/MessageRepository';
import { supabase } from '../lib/supabase';
import { ConversationItem } from '../repositories/IMessageRepository';
import { FriendsPicker } from '../components/FriendsPicker';
import styles from '../styles/ChatListScreen.styles';

const messageUseCases = new MessageUseCases(new MessageRepository());

interface Props {
  navigation: any;
}

export const ChatListScreen: React.FC<Props> = ({ navigation }) => {

  const [conversations, setConversations] = useState<ConversationItem[]>([]); 
  const [loading, setLoading] = useState(true);                             
  const [userId, setUserId] = useState<string | null>(null);             
  const [pickerVisible, setPickerVisible] = useState(false);               


  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);
      const conv = await messageUseCases.getConversations(user.id);
      setConversations(conv);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <ActivityIndicator />;

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <FriendsPicker visible={pickerVisible} onClose={() => setPickerVisible(false)} onSelect={(partnerId, partner) => {
        setConversations(prev => {
          const exists = prev.some(c => c.partnerId === partnerId);
          if (exists) return prev;
          const newConv: ConversationItem = { partnerId, partner, lastMessage: undefined, unreadCount: 0 };
          return [newConv, ...prev];
        });
        navigation.navigate('ChatScreen', { partnerId, partner });
      }} userId={userId ?? ''} />

      {conversations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.empty}>Henüz mesaj yok</Text>
          <Text style={[styles.empty, { fontSize: 14, marginTop: 8 }]}>Yeni bir sohbet başlatmak için + butonuna tıklayın</Text>
        </View>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.partnerId}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() => navigation.navigate('ChatScreen', { partnerId: item.partnerId, partner: item.partner })}
            >
              <View style={styles.avatarContainer}>
                {item.partner?.avatar_url ? (
                  <Image source={{ uri: item.partner.avatar_url }} style={styles.avatarImage} />
                ) : (
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {(item.partner?.first_name?.[0] || item.partnerId[0])?.toUpperCase()}
                    </Text>
                  </View>
                )}
              </View>
              <View style={styles.contentContainer}>
                <Text style={styles.title}>{item.partner?.first_name || item.partnerId} {item.partner?.last_name || ''}</Text>
                <Text style={styles.preview} numberOfLines={1}>
                  {item.lastMessage?.content ?? 'Yeni sohbet'}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
      <TouchableOpacity style={styles.fab} onPress={() => setPickerVisible(true)}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ChatListScreen;
