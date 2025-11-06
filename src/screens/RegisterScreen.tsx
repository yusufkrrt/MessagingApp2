import { Controller, useForm } from "react-hook-form";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native";
import styles from "../styles/RegisterScreen.styles";
import { signUpWithEmail } from "../helpers/LoginRegisterHelper";

const RegisterScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp<ParamListBase>>();
    const { control, handleSubmit } = useForm({
        defaultValues: { email: "", password: "", confirmPassword: "" },
    });

    const onSubmit = async (data: { email: string; password: string; confirmPassword: string; }) => {
        if (data.password !== data.confirmPassword) {
            Alert.alert("Hata", "Şifreler eşleşmiyor");
            return;
        }
        try {
            const response = await signUpWithEmail(data);
            if (!response.waitingForVerification) {
                navigation.navigate("Login");
                return;
            }
            Alert.alert("Kayıt Başarılı", `Hoş Geldiniz ${response.user?.email} Kullanıcı ID: ${response.user?.id}`);
            navigation.reset({
                index: 0,
                routes: [{ name: "TabNavigator" }],
            });
        } catch (error: any) {
            Alert.alert("Kayıt Hatası", error.message);
        }
    }
    // const onSubmit = () => { null; }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Kayıt Olma Ekranı</Text>
            <Controller
                control={control}
                name="email"
                rules={{
                    pattern: {
                        value: /\S+@\S+\.\S+/, message: "Geçerli bir e-posta adresi girin",
                    },
                    required: "E-posta gerekli"
                }}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <>
                        <TextInput
                            style={[styles.input, error && { borderColor: "red" }]}
                            placeholder="E-posta"
                            placeholderTextColor="#aaa"
                            value={value}
                            onChangeText={onChange}
                        />
                        {error && <Text style={styles.error}>{error.message}</Text>}
                    </>
                )}
            />
            <Controller
                control={control}
                name="password"
                rules={{
                    minLength: {
                        value: 6,
                        message: "Şifre en az 6 karakter olmalıdır"
                    },
                    required: "Şifre gerekli"
                }}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <>
                        <TextInput
                            style={[styles.input, error && { borderColor: "red" }]}
                            placeholder="Şifre"
                            placeholderTextColor="#aaa"
                            secureTextEntry={true}
                            value={value}
                            onChangeText={onChange}
                        />
                        {error && <Text style={styles.error}>{error.message}</Text>}
                    </>
                )}
            />
            <Controller
                control={control}
                name="confirmPassword"
                rules={{
                    minLength: {
                        value: 6,
                        message: "Şifre en az 6 karakter olmalıdır"
                    },
                    required: "Şifre gerekli"
                }}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <>
                        <TextInput
                            style={[styles.input, error && { borderColor: "red" }]}
                            placeholder="Şifre Tekrar"
                            placeholderTextColor="#aaa"
                            secureTextEntry={true}
                            value={value}
                            onChangeText={onChange}
                        />
                        {error && <Text style={styles.error}>{error.message}</Text>}
                    </>
                )}
            />
            <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
                <Text style={styles.buttonText}>Giriş Yap</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default RegisterScreen;