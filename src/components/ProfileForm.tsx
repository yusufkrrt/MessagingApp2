import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Control, Controller } from 'react-hook-form';
import { ProfileData } from "../helpers/ProfileHelper";

interface ProfileFormProps {
  control: Control<ProfileData>; 
  errors: any;                 
  editing: boolean;            
  hasProfileData: boolean;    
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  control,
  errors,
  editing,
  hasProfileData,
}) => {
  const renderInput = (
    name: keyof ProfileData,
    label: string,
    options: {
      required?: boolean;
      placeholder?: string;
      multiline?: boolean;
      keyboardType?: 'default' | 'phone-pad';
      autoCapitalize?: 'none' | 'sentences';
    } = {}
  ) => {
    const { required, placeholder, multiline, keyboardType, autoCapitalize } = options;
    return (
      <Controller
        control={control}
        name={name}
        rules={{ required: required ? `${label} gereklidir` : undefined }}
        render={({ field: { value, onChange } }) => (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{label} {required ? '*' : ''}</Text>
            <TextInput
              style={[
                styles.input,
                multiline && styles.textArea,
                errors[name] && styles.inputError,
                !editing && hasProfileData && styles.inputDisabled,
              ]}
              value={value}
              onChangeText={onChange}
              placeholder={placeholder}
              placeholderTextColor="#666"
              editable={editing || !hasProfileData}
              multiline={multiline}
              numberOfLines={multiline ? 3 : 1}
              keyboardType={keyboardType || 'default'}
              autoCapitalize={autoCapitalize || 'sentences'}
            />
            {errors[name] && (
              <Text style={styles.errorText}>{errors[name].message}</Text>
            )}
          </View>
        )}
      />
    );
  };

  return (
    <View style={styles.formContainer}>
      {renderInput('firstName', 'İsim', { required: true, placeholder: 'Adınızı girin' })}
      {renderInput('lastName', 'Soyisim', { required: true, placeholder: 'Soyadınızı girin' })}
      {renderInput('phone', 'Telefon', { required: true, placeholder: '+90 5XX XXX XX XX', keyboardType: 'phone-pad' })}
      {renderInput('username', 'Kullanıcı Adı', { placeholder: 'Benzersiz kullanıcı adı (opsiyonel)', autoCapitalize: 'none' })}
      {renderInput('bio', 'Hakkımda', { placeholder: 'Kendiniz hakkında birkaç şey yazın...', multiline: true })}
    </View>
  );
};


const styles = StyleSheet.create({
  formContainer: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1A1A1A',
    color: '#fff',             
    borderWidth: 1.5,          
    borderColor: '#2A2A2A',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  inputDisabled: {
    backgroundColor: '#151515',
    borderColor: '#252525',
    color: '#aaa',
  },
  inputError: {
    borderColor: '#E63946',
  },
  errorText: {
    color: '#E63946',
    fontSize: 12,
    marginTop: 6,
  },
});