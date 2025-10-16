import { ImageSourcePropType } from "react-native";

export type Ticket = {
  id: string;
  name: string;
  location: string;
  dateISO: string;
  image?: ImageSourcePropType;
  time?: string;
  age?: string;
  videoUrl?: string;
};
