import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';


interface Props {
  onSend: (text: string) => void;
}

interface FormData {
  message: string;
}

export const ChatInput: React.FC<Props> = ({ onSend }) => {
  const { control, handleSubmit, reset } = useForm<FormData>({
    defaultValues: {
      message: '',
    },
  });

  const onSubmit = (data: FormData) => {
    if (data.message.trim() === '') return;
    onSend(data.message.trim());
    reset();
  };

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="message"
        render={({ field: { onChange, value } }) => (
          <TextInput
            value={value}
            onChangeText={onChange}
            placeholder="Mesaj yaz..."
            placeholderTextColor="#999"
            style={styles.input}
          />
        )}
      />
      <TouchableOpacity onPress={handleSubmit(onSubmit)} style={styles.button}>
        <Text style={styles.buttonText}>Gönder</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flexDirection: 'row', 
    padding: 12, 
    alignItems: 'center', 
    backgroundColor: '#151515',
    borderTopWidth: 1,
    borderTopColor: '#222',
  },
  input: { 
    flex: 1, 
    color: '#fff',
    fontSize: 15,
    padding: 12, 
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#303030',
  },
  button: { 
    marginLeft: 8, 
    backgroundColor: '#4E9F3D', 
    paddingHorizontal: 16, 
    paddingVertical: 12, 
    borderRadius: 20, 
    elevation: 2,
  },
  buttonText: { 
    color: '#fff', 
    fontWeight: '700',
    fontSize: 15,
  },
});

export default ChatInput;
