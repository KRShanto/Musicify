import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  startAt,
  endAt,
  limit,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { SongType } from "@/types/data/song";
import moment from "moment";
import Image from "next/image";
import { IMAGE_FOLDER } from "@/constants/storage";
import Link from "next/link";

export default function Home() {
  const [musics, setMusics] = useState<SongType[] | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [imgURLs, setImgURLs] = useState<string[]>([]);
  const [channelImgs, setChannelImgs] = useState<string[]>([]);

  // fetch musics from Firebase
  // fetch any random 20 musics
  // the music's isPublic should be true
  // the music's playlist's isPublic should be true
  async function fetch20Musics() {
    setIsFetching(true);

    const randomValue = Math.floor(Math.random() * 1000000);
    const q = query(
      collection(db, "songs"),
      where("isPublic", "==", true),
      orderBy("__name__"),
      startAt(String(Date.now() - 1000 * 60 * 60 * 24 * 7 * 4)) // last 4 weeks
      // limit(20) // TODO
    );
    const querySnapshot = await getDocs(q);
    const musics = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as SongType[];

    // check if the music's playlist is public
    // there's a collection called playlists
    // the music's playlist's id is stored in the music's playlistId field
    const playlistIds = musics.map((music) => music.playlistId);
    const playlistDocs = await Promise.all(
      playlistIds.map((id) => getDoc(doc(db, "playlists", id)))
    );
    const playlists = playlistDocs.map((doc) => doc.data());
    const isPublicPlaylists = playlists.map((playlist) => playlist?.isPublic);

    // if the music's playlist is not public, set the music to null
    const musicsWithPublicPlaylist = musics.map((music, index) => {
      if (isPublicPlaylists[index]) return music;
      return null;
    }) as SongType[];

    // Now get the images from music.imgURL and music.channelImg
    const imgURLs = musicsWithPublicPlaylist.map((music) => music?.imgURL);
    const channelImgs = musicsWithPublicPlaylist.map(
      (music) => music?.channelImg
    );

    // get the images from Firebase Storage
    const imgURLsFromStorage = await Promise.all(
      imgURLs.map((url) =>
        getDownloadURL(ref(storage, `${IMAGE_FOLDER}/${url}`))
      )
    );
    const channelImgsFromStorage = await Promise.all(
      channelImgs.map((url) =>
        getDownloadURL(ref(storage, `${IMAGE_FOLDER}/${url}`))
      )
    );

    // add the music to the musics state (add them to the end of the array)
    setMusics((prevMusics) => {
      if (!prevMusics) return musicsWithPublicPlaylist;
      return [...prevMusics, ...musicsWithPublicPlaylist];
    });

    // add the images to the imgURLs state (add them to the end of the array)
    setImgURLs((prevImgURLs) => {
      if (!prevImgURLs) return imgURLsFromStorage;
      return [...prevImgURLs, ...imgURLsFromStorage];
    });

    // add the images to the channelImgs state (add them to the end of the array)
    setChannelImgs((prevChannelImgs) => {
      if (!prevChannelImgs) return channelImgsFromStorage;
      return [...prevChannelImgs, ...channelImgsFromStorage];
    });

    setIsFetching(false);
  }

  // fetch 20 more musics when the user scrolls to the bottom of the page
  function handleScroll() {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
      document.documentElement.offsetHeight
    )
      return;
    fetch20Musics();
  }

  // fetch 20 musics when the component mounts
  useEffect(() => {
    fetch20Musics();
  }, []);

  // // add an event listener to the window
  // // when the user scrolls to the bottom of the page, fetch 20 more musics
  // useEffect(() => {
  //   window.addEventListener("scroll", handleScroll);
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, [musics]);

  console.log(musics);

  return (
    <div id="home">
      <div className="musics">
        {musics?.map((music, index) => (
          <Link href={`/song/${music.id}`} key={index} className="music">
            <Image
              className="image"
              src={imgURLs[index]}
              alt=""
              width={350}
              height={250}
            />

            <div className="info">
              <Image
                className="channel-img"
                src={channelImgs[index]}
                alt=""
                width={50}
                height={50}
              />
              <div className="title-channel-info">
                <p className="title">{music.title}</p>
                <p className="channel">{music.channelName}</p>

                <div className="views-date">
                  <p className="date">
                    {moment(music.createdAt.toDate()).fromNow()}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {isFetching &&
        // create 20 placeholders while fetching
        Array(20)
          .fill(null)
          .map((_, index) => (
            <div key={index} className="music-placeholder music">
              <div className="image"></div>
              <div className="info">
                <div className="channel-img"></div>
                <div className="title-channel-info">
                  <div className="title"></div>
                  <div className="channel"></div>

                  <div className="views-date">
                    <div className="views"></div>
                    <div className="date"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
    </div>
  );
}
