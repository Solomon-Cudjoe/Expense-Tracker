import { Text, View } from "react-native";
import { Link } from "expo-router";
import { Image } from "expo-image";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen home.</Text>
      <Link href="/about">Go to About Page</Link>

      <Image
        source={{
          uri: "https://images.unsplash.com/photo-1764044371408-fa28e7dde471?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0fHx8ZW58MHx8fHx8",
        }}
        style={{
          width: 100,
          height: 100,
        }}
      />
    </View>
  );
}
