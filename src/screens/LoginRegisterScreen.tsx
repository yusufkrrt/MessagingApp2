import { Text, Touchable, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native";
import styles from "../styles/LoginRegisterScreen.styles"
const LoginRegisterScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp<ParamListBase>>();
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Hoş Geldin👋</Text>
            <Text style={styles.littletitle}>Arkadaşlarını ekleyebilir</Text>
            <Text style={styles.littletitle}>Mesajlaşabilir ve hikayelerini paylaşabilirsin</Text>


            <View style={{ flexDirection: 'row', justifyContent: 'space-around', gap: 20 }}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate("LoginScreen")}
                >
                    <Text style={styles.buttonText}>Giriş Yap</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate("RegisterScreen")}
                >
                    <Text style={styles.buttonText}>Kayıt Ol</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

export default LoginRegisterScreen;