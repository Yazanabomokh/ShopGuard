import React, { useEffect, useMemo, useState, useCallback } from "react";
import { FlatList, StyleSheet, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { Colors, Spacing } from "../../components/Theme";
import TicketCard from "../../components/TicketCard";
import HeaderBar from "../../components/HeaderBar";
import EmptyState from "../../components/EmptyState";
import type { Ticket } from "../../src/types";
import { subscribeTickets } from "../../src/services/tickets";

export default function TicketsScreen() {
  const router = useRouter();
  const [items, setItems] = useState<Ticket[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const unsub = subscribeTickets(setItems);
    return () => unsub();
  }, []);

  const onRefresh = useCallback(() => {
    // onSnapshot is realtime; this just gives the user feedback
    setRefreshing(true);
    const t = setTimeout(() => setRefreshing(false), 600);
    return () => clearTimeout(t);
  }, []);

  const sorted = useMemo(
    () => [...items].sort((a, b) => (a.dateISO < b.dateISO ? 1 : -1)),
    [items]
  );

  return (
    <SafeAreaView style={styles.safe}>
      <HeaderBar />
      <FlatList
        contentContainerStyle={[
          styles.listContent,
          sorted.length === 0 && { flex: 1, justifyContent: "center" },
        ]}
        data={sorted}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TicketCard
            ticket={item}
            onPress={(id) => router.push({ pathname: "/ticket/[id]", params: { id } })}
          />
        )}
        ListEmptyComponent={<EmptyState onRefresh={onRefresh} />}  // <-- shows button
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.subtext}
            colors={[Colors.tabActive]}
          />
        }
        style={{ flex: 1 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
});
