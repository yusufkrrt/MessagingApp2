import React, { useCallback, useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { FriendshipUseCases } from '../useCases/FriendshipUseCases';
import { FriendshipRepository } from '../repositories/FriendshipRepository';
import { FriendRequestCard } from '../components/FriendRequestCard.tsx';
import { Friendship } from '../entities/Friendship';

const friendshipUseCases = new FriendshipUseCases(new FriendshipRepository());

interface FriendRequestsScreenProps {
    userId: string;
}

export const FriendRequestsScreen: React.FC<FriendRequestsScreenProps> = ({ userId }) => {
    const [requests, setRequests] = useState<Friendship[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadRequests = useCallback(async () => {
        try {
            const pendingRequests = await friendshipUseCases.getPendingRequests(userId);
            setRequests(pendingRequests);
        } catch (error) {
            console.error('İstekler yüklenirken hata:', error);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    const handleResponse = async (requestId: string, status: 'accepted' | 'rejected') => {
        try {
            await friendshipUseCases.respondToFriendRequest(requestId, status);
            setRequests(current => current.filter(req => req.id !== requestId));
        } catch (error) {
            console.error('İstek yanıtlanırken hata:', error);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await loadRequests();
        setRefreshing(false);
    };

    useEffect(() => {
        loadRequests();
    }, [loadRequests]);

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#4E9F3D" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={requests}
                renderItem={({ item }) => (
                    <FriendRequestCard
                        request={item}
                        onResponse={handleResponse}
                    />
                )}
                keyExtractor={item => item.id}
                refreshing={refreshing}
                onRefresh={handleRefresh}
                style={styles.list}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f0f0f',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    list: {
        flex: 1,
    },
});