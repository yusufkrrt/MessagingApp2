import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../styles/LoginScreen.styles"
import { Alert, Text, TextInput, TouchableOpacity } from "react-native";
import { FetchUserData, signInWithEmail } from "../helpers/LoginRegisterHelper";

const LoginScreen: React.FC = () => {

    const navigation = useNavigation<NavigationProp<ParamListBase>>();
    const { control, handleSubmit } = useForm({
        defaultValues: { email: "", password: "" },
    });
    const [userData, setUserData] = useState<any>(null);

    const onSubmit = async (data: { email: string; password: string; }) => {
        try {
            const response = await signInWithEmail(data);
            const user = await FetchUserData();
            setUserData(user);
            Alert.alert("Giriş Başarılı", `Hoş Geldiniz ${response.user?.email} Kullanıcı ID: ${response.user?.id}`);
            navigation.reset({
                index: 0,
                routes: [{ name: "TabNavigator" }],
            });
        } catch (error: any) {
            Alert.alert("Giriş Hatası", error.message);
        }
    }
    //const onSubmit = () => { null; }
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Giriş Ekranı</Text>
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
                            secureTextEntry
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
}
export default LoginScreen;