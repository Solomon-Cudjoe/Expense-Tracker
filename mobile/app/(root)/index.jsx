import { useEffect } from "react";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { Link } from "expo-router";
import { Text, View } from "react-native";
import { SignOutButton } from "@/components/SignOutButton";
import { useTransactions } from "../../hooks/useTransactions";

export default function Page() {
  const { user } = useUser();
  const { loadData, transactions, summary, deleteTransaction } =
    useTransactions(user?.id);

  useEffect(() => {
    loadData();
  }, [loadData]);

  console.log("Transactions", transactions);
  console.log("Summary", summary);
  console.log("UserId", user.id);

  return (
    <View>
      <SignedIn>
        <Text>Hello {user?.emailAddresses[0].emailAddress}</Text>
        <SignOutButton />
      </SignedIn>
      <SignedOut>
        <Link href="/(auth)/signIn">
          <Text>Sign in</Text>
        </Link>
        <Link href="/(auth)/signUp">
          <Text>Sign up</Text>
        </Link>
      </SignedOut>
    </View>
  );
}
