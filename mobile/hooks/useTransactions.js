import { useState, useCallback } from "react";
import { Alert } from "react-native";

const API_URL = "https://expense-tracker-lkk3.onrender.com/api";

export const useTransactions = (userId) => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    income: 0,
    expenses: 0,
    balance: 0,
  });

  const [loading, setLoading] = useState(false);

  const fetchTransactions = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/transactions/${userId}`);
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  }, [userId]);
  const fetchSummary = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/transactions/${userId}`);
      const data = await response.json();
      setSummary(data);
    } catch (error) {
      console.error("Error fetching summary:", error);
    }
  }, [userId]);

  const loadData = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    try {
      // Fetch transactions and summary in parallel
      await Promise.all([fetchTransactions(), fetchSummary()]);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }, [fetchTransactions, fetchSummary, userId]);

  const deleteTransaction = useCallback(
    async (transactionId) => {
      try {
        const response = await fetch(
          `${API_URL}/transactions/${transactionId}`,
          {
            method: "DELETE",
          }
        );
        if (!response.ok) {
          throw new Error("Failed to delete transaction");
        }
        // Refresh transactions and summary after deletion
        await loadData();
        Alert.alert("Success", "Transaction deleted successfully");
      } catch (error) {
        console.error("Error deleting transaction:", error);
        Alert.alert("Failed to delete transaction", error.message);
      }
    },
    [loadData]
  );
  return {
    transactions,
    summary,
    loading,
    loadData,
    deleteTransaction,
  };
};
