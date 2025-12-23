import { useClerk } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { Alert, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../assets/styles/home.styles";
import { COLORS } from "../constants/colors";

export const SignOutButton = () => {
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await signOut();
          router.replace("/signIn");
        },
      },
    ]);
  };

  return (
    <TouchableOpacity onPress={handleSignOut} style={styles.logoutButton}>
      <Ionicons name="log-out-outline" size={22} color={COLORS.text} />
    </TouchableOpacity>
  );
};
