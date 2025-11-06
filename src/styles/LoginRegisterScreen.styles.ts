import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-start",          // Dikeyde tüm alanı ortala
        alignItems: "center",             // Yatayda da ortala
        backgroundColor: "#121212",
        paddingTop: 250, //  Yukarı kaydırır (negatif değer yukarı çeker)
    },
    title: {
        fontSize: 26,
        color: "#fff",
        marginBottom: 20,
    },
    littletitle: {
        fontSize: 16,
        color: "#fff",
        marginBottom: 10,
        opacity: 0.5,
    },

    button: {
        marginTop: 20,
        backgroundColor: "#6da362ff",     // Farklılaştırılmış buton
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderRadius: 10,
    },
    buttonText: {
        color: "#fff",                    // Buton yazısı
        fontSize: 16,
    },
});
export default styles;