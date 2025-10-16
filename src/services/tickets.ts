import type { Ticket } from "../types";

// ---- Toggle via env ----
const USE_STATIC = (process.env.EXPO_PUBLIC_USE_STATIC_DATA ?? "")
  .toString()
  .toLowerCase() === "true";

// ---- Static source ----
import { TICKETS, TICKET_DETAILS } from "../data/tickets";

// ---- Firebase source (used when USE_STATIC=false) ----
import { db } from "../lib/firebase";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";

// Helpers
function tsToISO(ts?: Timestamp | null) {
  return ts ? ts.toDate().toISOString().slice(0, 10) : "";
}
function mapDocToTicket(id: string, d: any): Ticket {
  // NOTE: image becomes a React Native Image source; if you have a URL in Firestore, we map it to { uri }
  const image =
    typeof d?.imageUrl === "string" && d.imageUrl.length > 0
      ? { uri: d.imageUrl }
      : undefined;

  return {
    id,
    name: d.personName ?? d.name ?? "Unknown",
    location: d.location ?? "",
    dateISO: d.dateISO ?? tsToISO(d.occurredAt ?? d.createdAt),
    image,
    time: d.time,
    age: d.age,
    videoUrl: d.videoUrl,
  };
}

// ---- Public API ----
export function subscribeTickets(cb: (tickets: Ticket[]) => void): () => void {
  if (USE_STATIC) {
    cb(TICKETS);
    return () => {};
  }

  const q = query(collection(db, "incidents"), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((doc) => mapDocToTicket(doc.id, doc.data())));
  });
}

export async function getTicketById(id: string): Promise<Ticket | null> {
  if (USE_STATIC) {
    return (TICKET_DETAILS && TICKET_DETAILS[id]) || TICKETS.find((t) => t.id === id) || null;
  }

  const s = await getDoc(doc(db, "incidents", id));
  return s.exists() ? mapDocToTicket(s.id, s.data()) : null;
}

// Optional: if you do live updates on details screen
export function subscribeTicketById(
  id: string,
  cb: (t: Ticket | null) => void
): () => void {
  if (USE_STATIC) {
    cb(
      (TICKET_DETAILS && TICKET_DETAILS[id]) ||
        TICKETS.find((t) => t.id === id) ||
        null
    );
    return () => {};
  }
  return onSnapshot(doc(db, "incidents", id), (s) =>
    cb(s.exists() ? mapDocToTicket(s.id, s.data()) : null)
  );
}
