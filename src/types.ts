import { ImageSourcePropType } from "react-native";

export type Alert = {
  id: string;
  theif_id?: number;
  theif_name?: string;
  theif_age?: number;
  theif_phone?: string;
  theif_image?: ImageSourcePropType;
  date: string;
  videoUrl?: string;
};
