import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Radius, Spacing } from "./Theme";

export default function EmptyState({ onRefresh }: { onRefresh?: () => void }) {
  return (
    <View style={styles.wrap}>
      <View style={styles.iconWrap}>
        <Ionicons name="shield-checkmark-outline" size={48} color={Colors.subtext} />
      </View>

      <Text style={styles.title}>No incidents yet</Text>
      <Text style={styles.subtitle}>
        When a new incident is reported, it will appear here.
      </Text>

      {onRefresh ? (
        <Pressable
          style={({ pressed }) => [styles.btn, { opacity: pressed ? 0.9 : 1 }]}
          onPress={onRefresh}
        >
          <Ionicons name="refresh-outline" size={18} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.btnText}>Refresh</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.outline,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  title: { color: Colors.text, fontSize: 20, fontWeight: "800", marginBottom: 6, textAlign: "center" },
  subtitle: { color: Colors.subtext, textAlign: "center", marginBottom: Spacing.lg },
  btn: {
    backgroundColor: Colors.red,
    height: 44,
    paddingHorizontal: 16,
    borderRadius: Radius.lg,
    flexDirection: "row",
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "800", fontSize: 16 },
});
