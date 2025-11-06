import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text, Alert, SafeAreaView } from 'react-native';

import { MessageUseCases } from '../useCases/MessageUseCases';
import { MessageRepository } from "../repositories/MessageRepository";
import { supabase } from "../lib/supabase";
import MessageBubble from '../components/MessageBubble';
import ChatInput from '../components/ChatInput';


const messageUseCases = new MessageUseCases(new MessageRepository());

interface Props {
  route: any;
}

export const ChatScreen: React.FC<Props> = ({ route }) => {
  const { partnerId, partner } = route.params || {}; 
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true); 
  const [userId, setUserId] = useState<string | null>(null);

  const loadMessages = useCallback(async () => {
    if (!userId) return;
    const msgs = await messageUseCases.getMessagesBetween(userId, partnerId);
    setMessages(msgs as any[]);
    setLoading(false);
  }, [userId, partnerId]);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);
    };
    init();
  }, []);

  useEffect(() => {
    if (userId) loadMessages();
  }, [userId, loadMessages]);


  const handleSend = async (text: string) => {
    if (!userId) return;
    try {
      const m = await messageUseCases.sendMessage(userId, partnerId, text);
      setMessages((prev) => [...prev, m]);
    } catch (err) {
      console.error('send error', err);
      Alert.alert('Hata', (err as any)?.message || 'Mesaj gönderilemedi');
    }
  };

  if (loading) return <ActivityIndicator />;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{partner?.first_name ? `${partner.first_name} ${partner.last_name ?? ''}` : partnerId}</Text>
      </View>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id?.toString() ?? Math.random().toString()}
        renderItem={({ item }) => <MessageBubble text={item.content} isMine={item.sender_id === userId} />}
        contentContainerStyle={styles.messageList}
      />
      <ChatInput onSend={handleSend} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#0f0f0f',
  },
  header: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#151515',
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  headerText: {
    color: '#fff', fontWeight: '700', fontSize: 16,
  },
  messageList: {
    padding: 12, paddingBottom: 20
  },
});

export default ChatScreen;