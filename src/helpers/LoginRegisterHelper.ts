import { Alert } from "react-native";
import { supabase } from "../lib/supabase";

interface LoginData {
    email: string;
    password: string;
}

interface RegisterData {
    email: string;
    password: string;
    confirmPassword: string;
}
//Giriş fonksiyonu
export const signInWithEmail = async ({ email, password }: LoginData) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email, password
    });
    if (error) {
        console.log("Giriş Hatası:", error.message, "Hata Kodu:", error.code)
        throw new Error(error.message)
    }
    return data;
};
//Kayıt olma fonksiyonu
export const signUpWithEmail = async ({ email, password, confirmPassword }: RegisterData) => {
    if (password !== confirmPassword) { throw new Error("Şifreler eşleşmiyor"); console.log("Kayıt Olunurken Şifreler eşleşmiyor"); }
    try {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
        });
        if (signUpError) {
            console.log("Kayıt Hatası:", signUpError.message, "Hata Kodu:", signUpError.code)
            throw new Error(signUpError.message);
        }
        if (!signUpData.user) { throw new Error("Kullanıcı Oluşturulamadı") }
        const { error: profileError } = await supabase.from("profiles").insert({
            id: signUpData.user.id,
            first_name: '',
            last_name: '',
            phone: '',
            username: '',
            created_at: new Date().toISOString()
        });
        if (profileError) {
            console.log("Profil oluşturma hatası:", profileError.message);
            console.warn("Profil oluşturulamadı ama kullanıcı kaydedildi");
        }
        if (!signUpData.session) {
            Alert.alert(
                "E-posta doğrulaması gerekli",
                "E-posta adresinize bir doğrulama bağlantısı gönderildi. Lütfen doğruladıktan sonra giriş yapın."
            );
            return { user: signUpData.user, waitingForVerification: false };
        }
        return { user: signUpData.user, waitingForVerification: true };
    } catch (error: any) { console.error("Kayıt Hatası:", error, "Hata Mesajı:", error.message); throw error }
};
//Kullanıcı verisi çekme 
export const FetchUserData = async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
        console.log("Kullanıcı verisi alınamadı:", error.message);
        throw new Error(error.message);
    }
    return data.user;
}