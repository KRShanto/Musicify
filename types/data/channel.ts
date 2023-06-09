export interface ChannelType {
  id: string;
  userId: string;
  name: string;
  about: string | null;
  country: string | null;
  url: string;
  photoLink: string | null;
  followers: number;
  createdAt: Date;
}
