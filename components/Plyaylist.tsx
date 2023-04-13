import React, { useState, useEffect, createRef } from "react";
import { useRouter } from "next/router";
import { PlaylistType } from "@/types/data/playlist";
import {
  doc,
  getDoc,
  query,
  where,
  getDocs,
  collection,
} from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { auth, db, storage } from "@/lib/firebase";
import Image from "next/image";
import { AUDIO_FOLDER, IMAGE_FOLDER } from "@/constants/storage";
import Link from "next/link";
import { FadeLoader } from "react-spinners";
import moment from "moment";
import AudioPlayer from "react-h5-audio-player";

import { BsFillPlayFill } from "react-icons/bs";
import { BsHeart } from "react-icons/bs";
import { BsHeartFill } from "react-icons/bs";
import { BsPlus } from "react-icons/bs";
import { BsFillShareFill } from "react-icons/bs";
import { SongType } from "@/types/data/song";

// TODO: check if the playlist is private or public or doesn't exist
// TODO: check if the song is private or public or doesn't exist
export default function Plyaylist() {
  const [playlist, setPlaylist] = useState<PlaylistType | null>(null);
  const [songs, setSongs] = useState<SongType[]>([]);
  const [playlistImg, setPlaylistImg] = useState<string | null>(null);
  const [channelImg, setChannelImg] = useState<string | null>(null);
  const [songAudios, setSongAudios] = useState<HTMLAudioElement[]>([]);
  const [songImages, setSongImages] = useState<string[]>([]);

  const router = useRouter();
  const { id } = router.query;
  const player = createRef<any>();

  async function getPlaylist() {
    // Get the playlist
    const playlistRef = doc(db, "playlists", id as string);
    const playlistDoc = await getDoc(playlistRef);
    const playlist = playlistDoc.data() as PlaylistType;

    // update playlist state with the id
    setPlaylist({ ...playlist, id: playlistDoc.id });
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

  async function getPlaylistSongs() {
    // Get the songs where the playlistId is equal to the playlist id
    const songsRef = query(
      collection(db, "songs"),
      where("playlistId", "==", playlist?.id)
    );
    const songsSnapshot = await getDocs(songsRef);
    const songs = songsSnapshot.docs.map((doc) => doc.data()) as SongType[];

    // update songs state
    setSongs(songs);

    // Get the songs audio
    // Get songs from firebase storage
    const songAudios = await Promise.all(
      songs.map(async (song) => {
        const songRef = ref(storage, `${AUDIO_FOLDER}/${song.audioURL}`);
        const songURL = await getDownloadURL(songRef);

        const songAudio = new Audio(songURL);

        return songAudio;
      })
    );

    setSongAudios(songAudios);

    // Get the songs image
    const songImages = await Promise.all(
      songs.map(async (song) => {
        const songImgRef = ref(storage, `${IMAGE_FOLDER}/${song.imgURL}`);
        const songImgURL = await getDownloadURL(songImgRef);

        return songImgURL;
      })
    );

    setSongImages(songImages);
  }

  function handle(index: number) {
    if (player.current.audio.current) {
      if (player.current.audio.current.src !== songAudios[index].src) {
        player.current.audio.current.src = songAudios[index].src;
      }

      if (player.current.audio.current.paused) {
        player.current.audio.current.play();
      } else {
        player.current.audio.current.pause();
      }
    }
  }

  useEffect(() => {
    if (id) getPlaylist();
  }, [id]);

  useEffect(() => {
    if (playlist) {
      getPlaylistImage();
      getChannelImage();
      getPlaylistSongs();
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

      <div className="songs-container">
        <table className="songs">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Artist</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {songs.map((song, index) => (
              <tr key={index} className="song">
                <td className="index">{index + 1}</td>

                <td className="title">
                  {/* Image and title together */}
                  {songImages[index] ? (
                    <Image
                      src={songImages[index]}
                      alt="Song Image"
                      width={50}
                      height={50}
                      className="song-img"
                    />
                  ) : (
                    <div className="song-img-alt"></div>
                  )}
                  <p className="text">{song.title}</p>
                </td>

                <td className="artist">{song.artist}</td>

                <td className="date">
                  {moment(song.createdAt.toDate()).format("MMM DD, YYYY")}
                </td>

                <td className="actions-table">
                  <div className="actions">
                    <button
                      className="action play"
                      onClick={() => handle(index)}
                    >
                      <BsFillPlayFill />
                    </button>

                    <button className="action share">
                      <BsFillShareFill />
                    </button>

                    <button className="action love">
                      <BsHeart />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="audio-player">
        {songAudios.length > 0 && (
          <AudioPlayer
            src={songAudios[0]?.src}
            ref={player}
            autoPlay={false}
            onClickNext={() => {
              console.log("Next");
            }}
            onClickPrevious={() => {
              console.log("Previous");
            }}
            showSkipControls={true}
          />
        )}
      </div>
    </div>
  );
}
