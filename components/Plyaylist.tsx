import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { PlaylistType } from "@/types/data/playlist";
import { doc, getDoc } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import Image from "next/image";
import { IMAGE_FOLDER } from "@/constants/storage";
import Link from "next/link";

export default function Plyaylist() {
  const [playlist, setPlaylist] = useState<PlaylistType | null>(null);
  const [playlistImg, setPlaylistImg] = useState<string | null>(null);
  const [channelImg, setChannelImg] = useState<string | null>(null);

  const router = useRouter();
  const { id } = router.query;

  async function getPlaylist() {
    // Get the playlist
    const playlistRef = doc(db, "playlists", id as string);
    const playlistDoc = await getDoc(playlistRef);
    const playlist = playlistDoc.data() as PlaylistType;

    // Get the playlist image url
    const imgRef = ref(storage, `${IMAGE_FOLDER}/${playlist.img}`);
    const imgURL = await getDownloadURL(imgRef);

    // Get the channel image url
    const channelImgRef = ref(
      storage,
      `${IMAGE_FOLDER}/${playlist.channelImg}`
    );
    const channelImgURL = await getDownloadURL(channelImgRef);

    // update
    setPlaylist(playlist);
    setPlaylistImg(imgURL);
    setChannelImg(channelImgURL);
  }

  useEffect(() => {
    // fetch playlist
    if (id) getPlaylist();
  }, [id]);

  return (
    <div>
      <header className="header">
        {playlistImg ? (
          <Image
            src={playlistImg}
            alt="Playlist Image"
            width={300}
            height={300}
            className="playlist-img"
          />
        ) : (
          <div className="img-alt"></div>
        )}

        <div className="right-side">
          <p className="playlist-text">Playlist</p>

          <h1 className="playlist-title">{playlist?.title}</h1>

          <div className="playlist-channel">
            {channelImg ? (
              <Image
                className="img"
                src={channelImg}
                alt="Channel Image"
                width={50}
                height={50}
              />
            ) : (
              <div className="img-alt"></div>
            )}

            <Link href={`/channel/${playlist?.channelId}`}>
              {playlist?.channelName}
            </Link>
          </div>
        </div>
      </header>
    </div>
  );
}
