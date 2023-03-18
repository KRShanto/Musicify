import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { PlaylistType } from "@/types/data/playlist";
import { doc, getDoc } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { auth, db, storage } from "@/lib/firebase";
import Image from "next/image";
import { IMAGE_FOLDER } from "@/constants/storage";
import Link from "next/link";
import { FadeLoader } from "react-spinners";

// import icons
import { BsFillPlayFill } from "react-icons/bs";
import { BsHeart } from "react-icons/bs";
import { BsHeartFill } from "react-icons/bs";
import { BsPlus } from "react-icons/bs";
import { BsFillShareFill } from "react-icons/bs";

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

    // update playlist
    setPlaylist(playlist);
  }

  async function getPlaylistImage() {
    // Get the playlist image url
    const imgRef = ref(storage, `${IMAGE_FOLDER}/${playlist?.img}`);
    const imgURL = await getDownloadURL(imgRef);

    // update images
    setPlaylistImg(imgURL);
  }

  async function getChannelImage() {
    // Get the channel image url
    const channelImgRef = ref(
      storage,
      `${IMAGE_FOLDER}/${playlist?.channelImg}`
    );
    const channelImgURL = await getDownloadURL(channelImgRef);

    // update images
    setChannelImg(channelImgURL);
  }

  useEffect(() => {
    if (id) getPlaylist();
  }, [id]);

  useEffect(() => {
    if (playlist) {
      getPlaylistImage();
      getChannelImage();
    }
  }, [playlist]);

  if (!playlist) {
    return (
      <div className="preloader">
        <FadeLoader
          className="spinner"
          color="cyan"
          loading={playlist === null}
        />
      </div>
    );
  }

  return (
    <div id="playlist-page">
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
          <div className="playlist-img-alt"></div>
        )}

        <div className="right-side">
          <p className="text-label">Playlist</p>

          <h1 className="title">{playlist?.title}</h1>
          <p className="about">{playlist?.about}</p>

          <div className="channel">
            {channelImg ? (
              <Image
                className="img"
                src={channelImg}
                alt="Channel Image"
                width={50}
                height={50}
              />
            ) : (
              <div className="channel-img-alt"></div>
            )}

            <Link href={`/channel/${playlist?.channelId}`}>
              {playlist?.channelName}
            </Link>
          </div>
        </div>
      </header>

      <div className="actions">
        <button className="action play">
          <BsFillPlayFill />
        </button>

        {playlist.userId === auth.currentUser?.uid && (
          <Link href={`/create/song?playlist=${id}`} className="action add">
            <BsPlus className="action add" />
          </Link>
        )}

        {/* TODO */}
        <button className="action love">
          <BsHeartFill />
        </button>

        <button className="action share">
          <BsFillShareFill />
        </button>
      </div>
    </div>
  );
}
