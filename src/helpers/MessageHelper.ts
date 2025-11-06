export const getUnreadMessageCount = async (senderId: string, receiverId: string): Promise<number> => {
  try {
    const { count, error } = await require('../../data/sources/supabase').supabase
      .from('messages')
      .select('id', { count: 'exact', head: false })
      .eq('sender_id', senderId)
      .eq('receiver_id', receiverId)
      .eq('read', false);
    if (error) throw error;
    return typeof count === 'number' ? count : 0;
  } catch (err) {
    console.warn('getUnreadMessageCount error', err);
    return 0;
  }
};