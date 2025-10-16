import type { Ticket } from "../types";

export const TICKETS: Ticket[] = [
  {
    id: "1",
    name: "John Doe",
    location: "Main Street Store #4",
    dateISO: "2025-10-15",
    image: require("../../assets/images/p1.png"),
  },
  {
    id: "2",
    name: "Jane Smith",
    location: "Downtown Plaza Store #2",
    dateISO: "2025-10-14",
    image: require("../../assets/images/p2.png"),
  },
  {
    id: "3",
    name: "Mike Johnson",
    location: "East Side Mall Store #7",
    dateISO: "2025-10-13",
    image: require("../../assets/images/p1.png"),
  },
  {
    id: "4",
    name: "Sarah Williams",
    location: "West Avenue Store #1",
    dateISO: "2025-10-12",
    image: require("../../assets/images/p2.png"),
  },
];

export const TICKET_DETAILS: Record<string, Ticket> = {
  "1": { ...TICKETS[0], time: "14:34", age: "28 years", videoUrl: "" },
  "2": { ...TICKETS[1], time: "11:05", age: "31 years", videoUrl: "" },
  "3": { ...TICKETS[2], time: "09:12", age: "35 years", videoUrl: "" },
  "4": { ...TICKETS[3], time: "16:20", age: "26 years", videoUrl: "" },
};
