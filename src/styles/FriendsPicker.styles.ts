import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  overlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end'
  },
  sheet: {
    backgroundColor: '#121212',
    padding: 16,
    maxHeight: '70%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12
  },
  row: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#222'
  },
  name: { color: '#fff' },
  close: { marginTop: 12, alignItems: 'center' },
  closeText: { color: '#4E9F3D', fontWeight: '700' },
  avatar: {
    width: 40, height: 40, borderRadius: 20, marginRight: 12
  },
  avatarPlaceholder: {
    width: 40, height: 40, borderRadius: 20, marginRight: 12,
    backgroundColor: '#333', alignItems: 'center', justifyContent: 'center'
  },
  badge: {
    backgroundColor: '#ff3b30',
    borderRadius: 12,
    paddingHorizontal: 6, paddingVertical: 2, marginLeft: 8
  },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  addFriendSection: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#222'
  },
  addFriendLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 8
  },
  input: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
    fontSize: 14
  },
  addButton: {
    backgroundColor: '#4E9F3D',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 70
  },
  addButtonDisabled: {
    opacity: 0.6
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14
  },
  loader: {
    marginVertical: 20
  },
});

export default styles;
