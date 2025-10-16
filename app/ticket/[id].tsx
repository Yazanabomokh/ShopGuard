import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
  Linking,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";

import { Colors, Radius, Spacing } from "../../components/Theme";
import type { Ticket } from "../../src/types";
import { getTicketById } from "../../src/services/tickets";

function ScreenHeader({ title, onBack }: { title: string; onBack: () => void }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.headerWrap, { paddingTop: insets.top }]}>
      <Pressable onPress={onBack} style={styles.headerBack} hitSlop={10}>
        <Ionicons name="chevron-back" size={30} color={Colors.text} />
      </Pressable>
      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={{ marginTop: 10, gap: 14 }}>{children}</View>
    </View>
  );
}

function Row({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
}) {
  if (!value) return null;
  return (
    <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 12 }}>
      <Ionicons name={icon} size={18} color={Colors.subtext} style={{ top: 2 }} />
      <View style={{ flex: 1 }}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue}>{value}</Text>
      </View>
    </View>
  );
}

export default function TicketDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [ticket, setTicket] = useState<Ticket | null>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const t = await getTicketById(id);
      setTicket(t);
    })();
  }, [id]);

  if (!ticket) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bg, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: Colors.text }}>Loading…</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bg }}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScreenHeader title="Incident Details" onBack={() => router.back()} />

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.heroWrap}>
          {ticket.image ? <Image source={ticket.image} style={styles.hero} /> : null}
          <View style={styles.suspectPill}>
            <Text style={styles.suspectPillText}>SUSPECT</Text>
          </View>
        </View>

        <SectionCard title="Suspect Information">
          <Row icon="person-outline" label="Name" value={ticket.name} />
          <Row icon="person" label="Age" value={ticket.age} />
        </SectionCard>

        <SectionCard title="Incident Details">
          <Row icon="location-outline" label="Location" value={ticket.location} />
          <Row icon="calendar-outline" label="Date" value={ticket.dateISO} />
          <Row icon="time-outline" label="Time" value={ticket.time} />
        </SectionCard>

        <SectionCard title="Video Evidence">
          <Pressable
            disabled={!ticket.videoUrl}
            style={({ pressed }) => [styles.cta, { opacity: ticket.videoUrl ? (pressed ? 0.9 : 1) : 0.5 }]}
            onPress={() => ticket.videoUrl && Linking.openURL(ticket.videoUrl)}
          >
            <Ionicons name="play-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.ctaText}>{ticket.videoUrl ? "Watch Clip" : "No clip available"}</Text>
          </Pressable>
        </SectionCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerWrap: {
    backgroundColor: Colors.cardSoft,
    height: 70,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 14,
  },
  headerBack: {
    position: "absolute",
    left: 6,
    bottom: 10,
    padding: 8,
  },
  headerTitle: {
    color: Colors.text,
    fontSize: 26,
    fontWeight: "900",
  },

  container: { padding: Spacing.lg, gap: Spacing.lg },
  heroWrap: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.outline,
    padding: 10,
  },
  hero: { width: "100%", height: 290, borderRadius: Radius.lg },
  suspectPill: {
    position: "absolute",
    right: 18,
    top: 18,
    backgroundColor: Colors.red,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.pill,
  },
  suspectPillText: { color: "#fff", fontWeight: "800", fontSize: 12 },
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.outline,
    padding: Spacing.lg,
  },
  sectionTitle: { color: Colors.text, fontSize: 16, fontWeight: "700" },
  rowLabel: { color: Colors.subtext, marginBottom: 2 },
  rowValue: { color: Colors.text, fontSize: 16, fontWeight: "600" },
  cta: {
    backgroundColor: Colors.red,
    height: 44,
    borderRadius: Radius.lg,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  ctaText: { color: "#fff", fontWeight: "800", fontSize: 16 },
});
