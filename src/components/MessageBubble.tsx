import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  text: string;
  isMine?: boolean;
}

export const MessageBubble: React.FC<Props> = ({ text, isMine = false }) => {
  return (
    <View style={[styles.container, isMine ? styles.mine : styles.theirs]}>
      <Text style={isMine ? styles.mineText : styles.theirsText}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,         
    maxWidth: '80%',             
    padding: 12,
    borderRadius: 12,            
    shadowColor: '#000',        
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  mine: {
    backgroundColor: '#4E9F3D',  
    alignSelf: 'flex-end',       
    marginLeft: '20%',          
  },
  theirs: {
    backgroundColor: '#202020',  
    alignSelf: 'flex-start',   
    marginRight: '20%',           
    borderWidth: 1,
    borderColor: '#303030',       
  },
  mineText: { 
    color: '#fff',          
    fontSize: 15,
  },
  theirsText: { 
    color: '#fff',
    fontSize: 15,
  },
});

export default MessageBubble;
