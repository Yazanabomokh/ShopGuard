import React from "react";
import { useRouter } from "expo-router";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { Colors, Radius, Spacing } from "./Theme";
import { Ionicons } from "@expo/vector-icons";
import type { Ticket } from "../src/types";

type Props = {
  ticket: Ticket;
  onPress?: (id: string) => void;
};

export default function TicketCard({ ticket, onPress }: Props) {
  const router = useRouter();

  const date = new Date(ticket.dateISO);
  const formatted = isNaN(date.getTime())
    ? ticket.dateISO
    : date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });

  const handlePress = () => {
    if (onPress) return onPress(ticket.id);
    router.push({ pathname: "/ticket/[id]", params: { id: ticket.id } });
  };

  return (
    <View style={styles.card}>
      <View style={styles.rowTop}>
        {ticket.image ? (
          <Image source={ticket.image} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, { backgroundColor: "#eee" }]} />
        )}

        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{ticket.name}</Text>

          <View style={styles.metaRow}>
            <Ionicons name="location-outline" size={16} color={Colors.subtext} style={{ marginRight: 6 }} />
            <Text style={styles.metaText}>{ticket.location}</Text>
          </View>

          <View style={styles.metaRow}>
            <Ionicons name="calendar-outline" size={16} color={Colors.subtext} style={{ marginRight: 6 }} />
            <Text style={styles.metaText}>{formatted}</Text>
          </View>
        </View>
      </View>

      <Pressable onPress={handlePress} style={({ pressed }) => [styles.button, { opacity: pressed ? 0.9 : 1 }]}>
        <Text style={styles.buttonText}>View Details</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.outline,
    marginBottom: Spacing.lg,
  },
  rowTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: Radius.md,
    marginRight: Spacing.md,
  },
  name: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  metaText: {
    color: Colors.subtext,
    fontSize: 14,
  },
  button: {
    backgroundColor: Colors.red,
    marginTop: Spacing.lg,
    paddingVertical: 12,
    borderRadius: Radius.lg,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
});
