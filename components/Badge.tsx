import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors, Radius, Spacing } from "./Theme";

type Props = { label: string; tone?: "red" | "yellow" | "blue"; };

export default function Badge({ label, tone = "red" }: Props) {
  const bg = tone === "red" ? Colors.red : tone === "yellow" ? Colors.yellow : Colors.cardSoft;
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.pill,
    alignSelf: "flex-start",
  },
  text: { color: "white", fontWeight: "700", fontSize: 12 },
});
