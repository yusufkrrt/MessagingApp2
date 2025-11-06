import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1, paddingHorizontal: 12, paddingTop: 0, backgroundColor: '#0f0f0f'
    },
    listContent: {
        paddingTop: 8, paddingBottom: 80
    },
    item: {
        flexDirection: 'row', alignItems: 'center',
        paddingVertical: 16, paddingHorizontal: 14,
        backgroundColor: '#1a1a1a', marginVertical: 6,
        borderRadius: 12,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25, shadowRadius: 4, elevation: 3,
        borderWidth: 1, borderColor: '#303030',
    },
    avatarContainer: { marginRight: 12 },
    avatar: {
        width: 48, height: 48, borderRadius: 24, backgroundColor: '#4E9F3D',
        alignItems: 'center', justifyContent: 'center'
    },
    avatarText: { color: '#fff', fontSize: 18, fontWeight: '600' },
    contentContainer: { flex: 1 },
    title: { color: '#fff', fontWeight: '600', fontSize: 16, marginBottom: 4 },
    preview: { color: '#bbb', fontSize: 14 },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    avatarImage: { width: 48, height: 48, borderRadius: 24, marginRight: 12 },
    empty: { color: '#fff', textAlign: 'center', marginTop: 40, fontSize: 16, opacity: 0.7 },
    fab: {
        position: 'absolute', right: 20, bottom: 20,
        backgroundColor: '#4E9F3D', width: 56, height: 56, borderRadius: 28,
        alignItems: 'center', justifyContent: 'center',
        shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 8
    },
    fabText: { color: '#fff', fontSize: 28, lineHeight: 30, fontWeight: '500' },
});
export default styles;
