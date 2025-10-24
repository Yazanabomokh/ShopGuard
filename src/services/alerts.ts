// src/services/alerts.ts
import { ImageSourcePropType } from "react-native";
import {
  onValue,
  ref,
  get,
  DataSnapshot,
  Unsubscribe,
} from "firebase/database";
import { rtdb } from "../lib/firebase";

export type Alert = {
  id: string; // Firebase push key (e.g. "-OcMBfXALHS7vPv4IJjH")
  theif_id?: number;
  theif_name?: string;
  theif_age?: number;
  theif_phone?: string;
  theif_image?: ImageSourcePropType; // { uri } or require(...)
  date: string; // from DB key "Date"
  videoUrl?: string; // from DB key "Recording"
};

// ---- mapping ----
function mapSnapshotToAlert(firebaseKey: string, data: any): Alert {
  return {
    // Use the Firebase KEY as the canonical ID that your UI navigates with:
    id: firebaseKey,

    // Optional fields from DB (coerce to the right types if they exist)
    theif_id: data?.theif_id !== undefined ? Number(data.theif_id) : undefined,
    theif_name: data?.theif_name ?? undefined,
    theif_age: data?.theif_age !== undefined ? Number(data.theif_age) : undefined,
    theif_phone: data?.theif_phone ?? undefined,

    // If you later store a URL for image, keep it as { uri: ... } for <Image />
    theif_image: data?.theif_image
      ? ({ uri: String(data.theif_image) } as ImageSourcePropType)
      : undefined,

    // DB field names → client shape
    date: data?.Date ?? "",
    videoUrl: data?.Recording ?? undefined,
  };
}

// ---- list (live) ----
/**
 * Live subscribe to all alerts under /ALERTS
 * @param cb callback that receives Alert[]
 * @returns unsubscribe function
 */
export function subscribeAlerts(cb: (alerts: Alert[]) => void): Unsubscribe {
  const alertsRef = ref(rtdb, "ALERTS");

  const unsubscribe = onValue(alertsRef, (snapshot: DataSnapshot) => {
    const val = snapshot.val() || {};
    // val: { "<pushKey>": { Date, Recording, theif_*... }, ... }

    const list: Alert[] = Object.entries(val).map(([key, raw]) =>
      mapSnapshotToAlert(String(key), raw)
    );

    // newest first (best-effort)
    list.sort((a, b) => {
      const da = new Date(a.date).getTime();
      const db = new Date(b.date).getTime();
      return db - da;
    });

    cb(list);
  });

  return unsubscribe;
}

// ---- single read (once) ----
/**
 * Read a single alert by its Firebase key (the same id you pass in navigation).
 * @param id Firebase push key under /ALERTS (e.g. "-OcMBfXALHS7vPv4IJjH")
 */
export async function getAlertById(id: string): Promise<Alert | null> {
  if (!id) return null;
  const snap = await get(ref(rtdb, `ALERTS/${id}`));
  if (!snap.exists()) return null;
  const data = snap.val();
  return mapSnapshotToAlert(id, data);
}

// ---- optional: live subscribe to a single alert ----
/**
 * Live subscribe to a single alert node (useful if the detail screen should live-update).
 */
export function subscribeAlertById(
  id: string,
  cb: (alert: Alert | null) => void
): Unsubscribe {
  const nodeRef = ref(rtdb, `ALERTS/${id}`);
  return onValue(nodeRef, (snapshot) => {
    if (!snapshot.exists()) return cb(null);
    cb(mapSnapshotToAlert(id, snapshot.val()));
  });
}
