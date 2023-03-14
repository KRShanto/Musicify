interface BasicSongData {
  id: string;
  title: string;
  link: string;
  photoLink: string;
}

export interface UserDataType {
  id: string;
  userId: string;
  lovedSongs: BasicSongData[];
  lovedPlaylists: BasicSongData[];
  history: BasicSongData[];
  ListenLater: BasicSongData[];
}
