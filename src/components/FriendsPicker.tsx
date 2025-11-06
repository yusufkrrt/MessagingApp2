import React, { useEffect, useState } from 'react';
import { View, Modal, FlatList, Text, TouchableOpacity, ActivityIndicator, Image, TextInput, Alert } from 'react-native';
import { FriendshipUseCases } from '../useCases/FriendshipUseCases';
import { FriendshipRepository } from "../repositories/FriendshipRepository";
import { getUnreadMessageCount } from '../helpers/MessageHelper';
import styles from '../styles/FriendsPicker.styles';

const friendshipUseCases = new FriendshipUseCases(new FriendshipRepository());

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (partnerId: string, partner?: any) => void;
  userId: string;
}

export const FriendsPicker: React.FC<Props> = ({ visible, onClose, onSelect, userId }) => {
  const [friends, setFriends] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [adding, setAdding] = useState(false);

  const loadFriends = async () => {
    setLoading(true);
    try {
      const list = await friendshipUseCases.getFriendsList(userId);
      const enriched = await Promise.all(
        (list || []).map(async (f: any) => {
          const partner = f.friend ?? f;
          let unread = 0;
          try {
            unread = await getUnreadMessageCount(partner.id, userId);
          } catch (err) {
            console.warn('count err', err);
          }
          return { ...f, unreadCount: unread };
        })
      );
      setFriends(enriched);
    } catch (e) {
      console.warn('Friends load error', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!visible) return;
    loadFriends();
  }, [visible, userId]);

  const handleAddFriend = async () => {
    if (!identifier.trim()) {
      Alert.alert('Hata', 'Lütfen kullanıcı adı veya e-posta girin');
      return;
    }

    setAdding(true);
    try {
      await friendshipUseCases.sendFriendRequest(userId, identifier.trim());
      Alert.alert('Başarılı', 'Arkadaşlık isteği gönderildi');
      setIdentifier('');
      // Arkadaş listesini yenile (bekleyen istekler için)
      loadFriends();
    } catch (error) {
      Alert.alert('Hata', error instanceof Error ? error.message : 'Arkadaşlık isteği gönderilemedi');
    } finally {
      setAdding(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose} transparent>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Arkadaşlar</Text>
          
          {/* Arkadaş Ekleme Bölümü */}
          <View style={styles.addFriendSection}>
            <Text style={styles.addFriendLabel}>Arkadaş Ekle</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Kullanıcı adı veya e-posta"
                placeholderTextColor="#666"
                value={identifier}
                onChangeText={setIdentifier}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity 
                style={[styles.addButton, adding && styles.addButtonDisabled]} 
                onPress={handleAddFriend}
                disabled={adding}
              >
                {adding ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.addButtonText}>Ekle</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {loading ? (
            <ActivityIndicator style={styles.loader} />
          ) : (
            <FlatList
              data={friends}
              keyExtractor={(item) => item.friend?.id ?? item.id}
              renderItem={({ item }) => {
                const p = item.friend ?? item;
                return (
                  <TouchableOpacity style={styles.row} onPress={() => { onSelect(p.id, p); onClose(); }}>
                    {p.avatar_url ? <Image source={{ uri: p.avatar_url }} style={styles.avatar} /> : <View style={styles.avatarPlaceholder}><Text style={{color:'#fff'}}>{(p.first_name||'')[0]||'?'}</Text></View>}
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text style={styles.name}>{p.first_name ? `${p.first_name} ${p.last_name ?? ''}` : p.id}</Text>
                      {item.unreadCount > 0 ? <View style={styles.badge}><Text style={styles.badgeText}>{item.unreadCount}</Text></View> : null}
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          )}
          <TouchableOpacity style={styles.close} onPress={onClose}>
            <Text style={styles.closeText}>Kapat</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
