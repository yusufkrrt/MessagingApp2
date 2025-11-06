import { useEffect, useState } from "react";
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  TextInput,
  Image,
  Platform,
  PermissionsAndroid,
  Modal,
  Pressable,
} from "react-native";
import { Controller, useForm } from "react-hook-form";
import { launchImageLibrary } from 'react-native-image-picker';
import { ProfileForm } from "../components/ProfileForm.tsx";
import { ProfileAvatar } from "../components/ProfileAvatar.tsx";
import { profileStyles as styles } from "../styles/ProfileScreen.styles.ts";
import { fetchOrCreateProfile, updateProfile, uploadAvatar, getInitials } from "../helpers/ProfileHelper.ts";

const ProfileScreen: React.FC = () => {
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [avatarPreviewVisible, setAvatarPreviewVisible] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      username: "",
      bio: "",
      avatarUrl: "",
    },
  });

  useEffect(() => {
    loadProfile();
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: "Galeri İzni",
            message: "Fotoğraf seçebilmek için galeri erişim izni gerekiyor",
            buttonNeutral: "Daha Sonra Sor",
            buttonNegative: "İptal",
            buttonPositive: "Tamam"
          }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert(
            "İzin Gerekli",
            "Fotoğraf seçmek için galeri erişim izni gerekiyor"
          );
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await fetchOrCreateProfile();
      setProfile(data);
      setValue("firstName", data.firstName);
      setValue("lastName", data.lastName);
      setValue("phone", data.phone);
      setValue("username", data.username || "");
      setValue("bio", data.bio || "");
      setValue("avatarUrl", data.avatarUrl || "");
      setSelectedImageUri(data.avatarUrl || null);
    } catch (error) {
      console.error(error);
      Alert.alert("Hata", "Profil yüklenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo', quality: 0.8, selectionLimit: 1, includeBase64: true,
      });
      if (!result.didCancel && result.assets && result.assets[0]) {
        setUploadingImage(true);
        let input;
        if (result.assets[0].base64 && result.assets[0].type) {
          input = `data:${result.assets[0].type};base64,${result.assets[0].base64}`;
        } else if (result.assets[0].uri) {
          input = result.assets[0].uri;
        } else {
          Alert.alert("Hata", "Fotoğraf verisi okunamadı");
          setUploadingImage(false);
          return;
        }
        const avatarUrl = await uploadAvatar(input);
        setValue("avatarUrl", avatarUrl);
        setSelectedImageUri(avatarUrl);
        Alert.alert("Başarılı", "Fotoğraf yüklendi! Kaydet butonuna basarak profili güncelleyin.");
      } else if (result.didCancel) {
        console.log("Kullanıcı fotoğraf seçimini iptal etti");
      } else {
        Alert.alert("Hata", "Fotoğraf verisi okunamadı");
      }
    } catch (error: any) {
      console.error("Genel hata:", error);
      Alert.alert("Hata", "Fotoğraf seçilirken bir hata oluştu: " + (error?.message || error));
    } finally { setUploadingImage(false); }
  };

  const showAvatarPreview = () => {
    if (selectedImageUri) setAvatarPreviewVisible(true);
  };

  const onSubmit = async (data: any) => {
    try {
      setSaving(true);
      await updateProfile(data);
      setProfile(data);
      setEditing(false);
      Alert.alert("Başarılı", "Profiliniz başarıyla güncellendi! ✓");
    } catch (error: any) {
      Alert.alert("Hata", error.message || "Profil güncellenirken bir hata oluştu");
    } finally {
      setSaving(false);
    }
  };

  const hasProfileData = profile && (profile.firstName || profile.lastName || profile.phone);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#121212' }}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4E9F3D" />
          <Text style={styles.loadingText}>Yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#121212' }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <ProfileAvatar
            imageUri={selectedImageUri}
            initials={getInitials(profile)}
            onPress={editing || !hasProfileData ? pickImage : undefined}
            isEditing={editing || !hasProfileData}
            isUploading={uploadingImage}
            hasProfile={!!hasProfileData}
          />
          <Text style={styles.title}>
            {hasProfileData ? "Profilim" : "Profil Oluştur"}
          </Text>
          <Text style={styles.subtitle}>
            {hasProfileData
              ? "Bilgilerinizi görüntüleyin ve düzenleyin"
              : "Devam etmek için profilinizi oluşturun"}
          </Text>
        </View>
        <ProfileForm
          control={control}
          errors={errors}
          editing={editing}
          hasProfileData={!!hasProfileData}
        />
        <View style={styles.buttonContainer}>
          {!hasProfileData ? (
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={handleSubmit(onSubmit)}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Profil Oluştur</Text>
              )}
            </TouchableOpacity>
          ) : editing ? (
            <>
              <TouchableOpacity
                style={[styles.button, styles.primaryButton, { flex: 1 }]}
                onPress={handleSubmit(onSubmit)}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Kaydet</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton, { flex: 1, marginLeft: 12 }]}
                onPress={() => {
                  setEditing(false);
                  loadProfile();
                }}
                disabled={saving}
              >
                <Text style={styles.buttonTextSecondary}>İptal</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={() => setEditing(true)}
            >
              <Text style={styles.buttonText}>Düzenle</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
