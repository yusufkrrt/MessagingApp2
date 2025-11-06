import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Friendship } from '../entities/Friendship';

// request: Arkadaşlık isteği nesnesi, onResponse: Kabul-red callback'i
interface FriendRequestCardProps {
    request: Friendship;
    onResponse: (requestId: string, status: 'accepted' | 'rejected') => void;
}

export const FriendRequestCard: React.FC<FriendRequestCardProps> = ({ request, onResponse }) => {

        const { id, requester } = request;

    if (!requester) {
        return null;
    }

 return (
        <View style={styles.container}>
            <View style={styles.info}>
                {/* İstek gönderen kişinin adı-soyadı */}
                <Text style={styles.name}>
                    {`${requester.firstName} ${requester.lastName}`}
                </Text>
                {/* Kullanıcı adı */}
                <Text style={styles.username}>
                    @{requester.username || 'unnamed'}
                </Text>
            </View>
            <View style={styles.actions}>
                {/* Kabul tuşu: callback ile kabulü dışarı bildirir */}
                <TouchableOpacity
                    style={[styles.button, styles.acceptButton]}
                    onPress={() => onResponse(id, 'accepted')}
                >
                    <Text style={styles.acceptButtonText}>Kabul Et</Text>
                </TouchableOpacity>
                {/* Red tuşu: callback ile red durumunu bildirir */}
                <TouchableOpacity
                    style={[styles.button, styles.rejectButton]}
                    onPress={() => onResponse(id, 'rejected')}
                >
                    <Text style={styles.rejectButtonText}>Reddet</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

}


// StyleSheet: görünüm, renkler, kart düzeni ve buton stilleri.
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#151515',           // Ana kart koyu arka plan
        padding: 14,
        borderRadius: 10,                    // Kart köşe yuvarlatma
        marginVertical: 6,
        marginHorizontal: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.5,                  // Kart için shadow efekti
        shadowRadius: 6,
        elevation: 6,
    },
    info: {
        marginBottom: 12, // İsim ve username arası boşluk
    },
    name: {
        fontSize: 16, fontWeight: '600', color: '#fff', // Ad/Soyad fontu
    },
    username: {
        fontSize: 14, color: '#bbb', marginTop: 2, // Kullanıcı adı grileştirilmiş
    },
    actions: {
        flexDirection: 'row',                // Butonlar yatay sıralı
        justifyContent: 'flex-end',          // Bitişte hizalı
        gap: 10,                            // Butonlar arası boşluk
    },
    button: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 6,                     // Düğme yumuşak köşe
    },
    acceptButton: {
        backgroundColor: '#2ecc71',          // Kabul butonu — yeşil
    },
    rejectButton: {
        backgroundColor: '#e74c3c',          // Red butonu — kırmızı
    },
    acceptButtonText: {
        color: '#fff', fontWeight: '600',    // Beyaz yazı, vurgulu
    },
    rejectButtonText: {
        color: '#fff', fontWeight: '600',    // Beyaz yazı, vurgulu
    },
});