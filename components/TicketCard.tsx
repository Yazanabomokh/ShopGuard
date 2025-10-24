import React from "react";
import { useRouter } from "expo-router";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { Colors, Radius, Spacing } from "./Theme";
import { Ionicons } from "@expo/vector-icons";
import type { Alert } from "../src/types";

type Props = {
  alert: Alert;
  onPress?: (id: string) => void;
};

export default function TicketCard({ alert, onPress }: Props) {
  const router = useRouter();

  // parse the date string coming from Firebase ("Friday, 2025-10-24 20:09:51")
  const parsed = new Date(alert.date);
  const formatted = isNaN(parsed.getTime())
    ? alert.date
    : parsed.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

  const handlePress = () => {
    if (onPress) return onPress(alert.id);

    router.push({
      pathname: "/ticket/[id]",
      params: { id: alert.id },
    });
  };

  return (
    <View style={styles.card}>
      <View style={styles.rowTop}>
        {alert.theif_image ? (
          <Image source={alert.theif_image} style={styles.avatar} />
        ) : (
          <View
            style={[
              styles.avatar,
              { backgroundColor: Colors.outline, alignItems: "center", justifyContent: "center" },
            ]}
          >
            <Text style={{ color: Colors.subtext, fontWeight: "600", fontSize: 18 }}>?</Text>
          </View>
        )}

        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{alert.theif_name ?? "Unknown"}</Text>

          {/* Age + ID */}
          <View style={styles.metaRow}>
            <Ionicons
              name="person-outline"
              size={16}
              color={Colors.subtext}
              style={{ marginRight: 6 }}
            />
            <Text style={styles.metaText}>
              ID: {alert.theif_id ?? "N/A"} | Age: {alert.theif_age ?? "N/A"}
            </Text>
          </View>

          {/* Phone */}
          <View style={styles.metaRow}>
            <Ionicons
              name="call-outline"
              size={16}
              color={Colors.subtext}
              style={{ marginRight: 6 }}
            />
            <Text style={styles.metaText}>
              {alert.theif_phone ?? "No phone"}
            </Text>
          </View>

          {/* Date */}
          <View style={styles.metaRow}>
            <Ionicons
              name="calendar-outline"
              size={16}
              color={Colors.subtext}
              style={{ marginRight: 6 }}
            />
            <Text style={styles.metaText}>{formatted}</Text>
          </View>
        </View>
      </View>

      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [styles.button, { opacity: pressed ? 0.9 : 1 }]}
      >
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
    backgroundColor: Colors.outline,
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
