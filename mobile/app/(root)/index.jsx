import { useEffect, useState } from "react";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
  RefreshControl,
} from "react-native";
import { SignOutButton } from "@/components/SignOutButton";
import { useTransactions } from "../../hooks/useTransactions";
import PageLoader from "../../components/PageLoader";
import { styles } from "../../assets/styles/home.styles";
import { Ionicons } from "@expo/vector-icons";
import { BalanceCard } from "../../components/BalanceCard";
import { TransactionItem } from "../../components/TransactionItem";
import NoTransactionsFound from "../../components/NoTransactionsFound";

export default function Page() {
  const router = useRouter();
  const { user } = useUser();
  const { loadData, transactions, isLoading, summary, deleteTransaction } =
    useTransactions(user?.id);

  console.log(summary);

  useEffect(() => {
    loadData();
  }, [loadData]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  if (isLoading && !refreshing) {
    return <PageLoader />;
  }

  const handleDelete = (transactionId) => {
    Alert.alert(
      "Delete Transaction",
      "Are you sure you want to delete this transaction?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteTransaction(transactionId),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/*HEADER */}
        <View style={styles.header}>
          {/* LEFT */}
          <View style={styles.headerLeft}>
            <Image
              source={require("../../assets/images/logo.png")}
              style={styles.headerLogo}
            />
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>Welcome, </Text>
              <Text style={styles.usernameText}>
                {user?.emailAddresses[0].emailAddress.split("@")[0]}{" "}
              </Text>
            </View>
          </View>
          {/* RIGHT */}
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push("/create")}
            >
              <Ionicons name="add" size={24} color="#fff" />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
            <SignOutButton />
          </View>
        </View>
        {/* Balance Card */}
        <BalanceCard summary={summary} />

        <View style={styles.transactionsHeaderContainer}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
        </View>
      </View>

      <FlatList
        style={styles.transactionsList}
        contentContainerStyle={styles.transactionsListContent}
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TransactionItem item={item} onDelete={handleDelete} />
        )}
        ListEmptyComponent={<NoTransactionsFound />}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}
