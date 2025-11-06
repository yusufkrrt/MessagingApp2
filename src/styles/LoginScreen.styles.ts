import { StyleSheet } from "react-native";


const styles = StyleSheet.create({
  container: {
    flex: 1, padding: 20, backgroundColor: "#121212", justifyContent: "center", // Ekranı ortala
  },
  title: {
    fontSize: 22, color: "#fff", textAlign: "center", marginBottom: 30, // Başlık font ve spacing
  },
  input: {
    backgroundColor: "#1E1E1E", color: "#fff",
    borderWidth: 1, borderColor: "#333", borderRadius: 8,
    padding: 12, fontSize: 16, marginBottom: 10, // Input background, padding ve köşe
  },
  button: {
    backgroundColor: "#4E9F3D", paddingVertical: 14, borderRadius: 10, alignItems: "center", marginTop: 10, // Yeşil buton
  },
  buttonText: {
    color: "#fff", fontSize: 16, // Buton üzeri yazı
  },
  error: {
    color: "red", marginBottom: 8, // Hata mesajı için kırmızı
  },
});

export default styles;
