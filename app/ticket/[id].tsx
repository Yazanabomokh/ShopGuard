import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
  Linking,
  ActivityIndicator,
  Alert as RNAlert,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";

import { Colors, Radius, Spacing } from "../../components/Theme";
import type { Alert as AlertType } from "../../src/types";
import { getAlertById } from "../../src/services/alerts";

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
  value?: string | number;
}) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 12 }}>
      <Ionicons name={icon} size={18} color={Colors.subtext} style={{ top: 2 }} />
      <View style={{ flex: 1 }}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue}>{String(value)}</Text>
      </View>
    </View>
  );
}

type LoadState = "idle" | "loading" | "ready" | "notfound" | "error";

export default function TicketDetails() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();

  const [state, setState] = useState<LoadState>("idle");
  const [alert, setAlert] = useState<AlertType | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const goBackHome = () => router.replace("/");

  useEffect(() => {
    if (!id) {
      setState("notfound");
      setErrorMsg("Missing or invalid alert id.");
      return;
    }

    let cancelled = false;
    const run = async () => {
      try {
        setState("loading");
        const a = await getAlertById(id);
        if (cancelled) return;
        if (!a) {
          setState("notfound");
          setErrorMsg("This alert could not be found or was removed.");
          return;
        }
        setAlert(a);
        setState("ready");
      } catch (err: any) {
        if (cancelled) return;
        setErrorMsg(err?.message ?? "Something went wrong while loading the alert.");
        setState("error");
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [id]);

  // Common shells
  const LoadingView = (
    <SafeAreaView style={styles.centerShell}>
      <ActivityIndicator size="large" color={Colors.subtext} />
      <Text style={{ color: Colors.text, marginTop: 12 }}>Loading…</Text>
    </SafeAreaView>
  );

  const ProblemView = (title: string, subtitle?: string) => (
    <SafeAreaView style={styles.centerShell}>
      <Ionicons name="alert-circle-outline" size={36} color={Colors.subtext} />
      <Text style={{ color: Colors.text, marginTop: 10, fontSize: 18, fontWeight: "700" }}>{title}</Text>
      {subtitle ? (
        <Text style={{ color: Colors.subtext, marginTop: 6, textAlign: "center", paddingHorizontal: 24 }}>
          {subtitle}
        </Text>
      ) : null}
      <Pressable onPress={goBackHome} style={({ pressed }) => [styles.backBtn, { opacity: pressed ? 0.9 : 1 }]}>
        <Text style={styles.backBtnText}>Go back</Text>
      </Pressable>
    </SafeAreaView>
  );

  if (state === "loading" || state === "idle") return LoadingView;
  if (state === "notfound") return ProblemView("Not found", errorMsg);
  if (state === "error") return ProblemView("Error", errorMsg);

  // state === "ready" here
  const a = alert!;

  // Best-effort parse "Friday, 2025-10-24 20:09:51"
  let formattedDate = a.date;
  let formattedTime = "";
  const lastSpaceIdx = a.date.lastIndexOf(" ");
  if (lastSpaceIdx !== -1) {
    const possibleTime = a.date.slice(lastSpaceIdx + 1);
    const possibleDatePrefix = a.date.slice(0, lastSpaceIdx);
    formattedTime = possibleTime;

    const match = possibleDatePrefix.match(/(\d{4}-\d{2}-\d{2})/);
    if (match) {
      const parsed = new Date(match[1]);
      formattedDate = isNaN(parsed.getTime())
        ? possibleDatePrefix
        : parsed.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
    } else {
      formattedDate = possibleDatePrefix;
    }
  }

  const tryOpenVideo = async () => {
    if (!a.videoUrl) return;
    try {
      const supported = await Linking.canOpenURL(a.videoUrl);
      if (!supported) {
        RNAlert.alert("Cannot open link", "This video link is not supported on your device.");
        return;
      }
      await Linking.openURL(a.videoUrl);
    } catch {
      RNAlert.alert("Error", "Failed to open the video link.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bg }}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScreenHeader title="Incident Details" onBack={() => router.back()} />

      <ScrollView contentContainerStyle={styles.container}>
        {/* Suspect image / hero */}
        <View style={styles.heroWrap}>
          {a.theif_image ? (
            <Image source={a.theif_image} style={styles.hero} />
          ) : (
            <View style={[styles.hero, styles.heroPlaceholder]}>
              <Ionicons name="person-outline" size={48} color={Colors.subtext} />
              <Text style={{ color: Colors.subtext, marginTop: 6 }}>No image</Text>
            </View>
          )}
          <View style={styles.suspectPill}>
            <Text style={styles.suspectPillText}>SUSPECT</Text>
          </View>
        </View>

        {/* Suspect Info */}
        <SectionCard title="Suspect Information">
          <Row icon="person-outline" label="Name" value={a.theif_name ?? "Unknown"} />
          <Row icon="finger-print-outline" label="ID" value={a.theif_id} />
          <Row icon="call-outline" label="Phone Number" value={a.theif_phone} />
          <Row icon="person" label="Age" value={a.theif_age} />
        </SectionCard>

        {/* Incident Info */}
        <SectionCard title="Incident Details">
          <Row icon="calendar-outline" label="Date" value={formattedDate} />
          <Row icon="time-outline" label="Time" value={formattedTime} />
        </SectionCard>

        {/* Video */}
        <SectionCard title="Video Evidence">
          <Pressable
            disabled={!a.videoUrl}
            style={({ pressed }) => [
              styles.cta,
              { opacity: a.videoUrl ? (pressed ? 0.9 : 1) : 0.5 },
            ]}
            onPress={tryOpenVideo}
          >
            <Ionicons name="play-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.ctaText}>{a.videoUrl ? "Watch Clip" : "No clip available"}</Text>
          </Pressable>
        </SectionCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centerShell: {
    flex: 1,
    backgroundColor: Colors.bg,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

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
  heroPlaceholder: {
    backgroundColor: Colors.cardSoft,
    alignItems: "center",
    justifyContent: "center",
  },
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

  backBtn: {
    backgroundColor: Colors.card,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.outline,
    marginTop: 12,
  },
  backBtnText: { color: Colors.text, fontWeight: "700" },
});
