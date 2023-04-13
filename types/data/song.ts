import { Timestamp } from "firebase/firestore";

export interface SongType {
  id: string;
  userId: string;
  title: string;
  imgURL: string;
  audioURL: string;
  artist: string;
  loves: number;
  channelId: string;
  channelName: string;
  channelImg: string;
  playlistId: string;
  isPublic: boolean;
  createdAt: Timestamp;
}
