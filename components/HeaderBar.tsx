import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors, Radius, Spacing } from "./Theme";
import { Image } from "react-native";

export default function HeaderBar() {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.appRow}>
          <Image
            source={require("../assets/shopguard_vB_flat.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>ShopGuard</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardSoft,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomColor: Colors.outline,
    borderBottomWidth: 1,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
  },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  appRow: { flexDirection: "row", alignItems: "center" },
  title: { color: Colors.text, fontSize: 25, fontWeight: "700" },
  pill: {
    alignSelf: "flex-start",
    backgroundColor: Colors.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginTop: Spacing.md,
  },
  logo: { width: 35, height: 35, marginRight: 8 },
  pillText: { color: "white", fontWeight: "700", fontSize: 13 },
});
