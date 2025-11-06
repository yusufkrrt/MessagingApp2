import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, StyleSheet, Modal, Pressable } from 'react-native';

interface ProfileAvatarProps {
  imageUri: string | null;
  initials: string;
  onPress?: () => void;
  isEditing: boolean;
  isUploading: boolean;
  hasProfile: boolean;              
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  imageUri,
  initials,
  onPress,
  isEditing,
  isUploading,
  hasProfile
}) => {

  const [modalVisible, setModalVisible] = useState(false);

  const handleAvatarPress = () => {
    if (isEditing) {
      onPress && onPress();
    } else if (imageUri) {
      setModalVisible(true);
    }
  };

  return (
    <>
      <TouchableOpacity
        style={styles.avatarContainer}
        onPress={handleAvatarPress}
        disabled={isUploading}
      >
        {isUploading ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.avatarImage} />
        ) : (
          <Text style={styles.avatarText}>{initials}</Text>
        )}
        {(isEditing || !hasProfile) && (
          <View style={styles.cameraIconContainer}>
            <Text style={styles.cameraIcon}>📷</Text>
          </View>
        )}
      </TouchableOpacity>
      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <Pressable
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.85)", justifyContent: "center", alignItems: "center" }}
          onPress={() => setModalVisible(false)}
        >
          <Image
            source={{ uri: imageUri || undefined }}
            style={{ width: 320, height: 320, borderRadius: 16, resizeMode: "contain" }}
          />
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    width: 120, height: 120, borderRadius: 60,       
    backgroundColor: '#4E9F3D',
    justifyContent: 'center', alignItems: 'center', 
    marginBottom: 16,
    shadowColor: '#4E9F3D', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8,
    elevation: 8,                                  
    position: 'relative', overflow: 'hidden',
  },
  avatarImage: {
    width: '100%', height: '100%', borderRadius: 60
  },
  avatarText: {
    fontSize: 40, fontWeight: 'bold', color: '#fff',
  },
  cameraIconContainer: {
    position: 'absolute', bottom: 0, right: 0,       
    backgroundColor: '#1A1A1A', width: 36, height: 36,
    borderRadius: 18, justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: '#4E9F3D',        
  },
  cameraIcon: {
    fontSize: 18,                                 
  },
});