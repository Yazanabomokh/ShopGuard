import React, { useState } from "react";
import { View, Text, StyleSheet, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Radius, Spacing } from "../../components/Theme";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.card}>{children}</View>
    </View>
  );
}

export default function SettingsScreen() {
  const [push, setPush] = useState(false);
  const [auto, setAuto] = useState(true);

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <View style={{ padding: Spacing.lg }}>
        <Text style={styles.screenTitle}>Settings</Text>

        <Section title="Notifications">
          <Row label="Push Notifications" subtitle="Get alerts for new incidents">
            <Switch value={push} onValueChange={setPush} />
          </Row>
        </Section>

        <Section title="Security">
          <Row label="Auto-Sync" subtitle="Sync data automatically">
            <Switch value={auto} onValueChange={setAuto} />
          </Row>
        </Section>
      </View>
    </SafeAreaView>
  );
}

function Row({
  label,
  subtitle,
  children,
}: {
  label: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowTitle}>{label}</Text>
        {subtitle ? <Text style={styles.rowSub}>{subtitle}</Text> : null}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  screenTitle: { color: Colors.text, fontSize: 22, fontWeight: "800", marginBottom: 12 },
  section: { marginTop: 10 },
  sectionTitle: { color: Colors.text, opacity: 0.9, marginBottom: 8, fontWeight: "700" },
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.outline,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 6,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outline,
  },
  rowTitle: { color: Colors.text, fontWeight: "700" },
  rowSub: { color: Colors.subtext, marginTop: 4 },
  signOut: {
    backgroundColor: Colors.cardSoft,
    paddingVertical: 14,
    borderRadius: Radius.md,
    alignItems: "center",
  },
  signOutText: { color: Colors.text, fontWeight: "700" },
});
