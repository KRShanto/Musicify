import React, { useState } from "react";
import Checkbox from "../utils/form/Checkbox";
import Form, { SendType } from "../utils/form/Form";
import Input from "../utils/form/Input";
import useAuthStore from "@/stores/auth";
import useLoadingStore from "@/stores/loading";
import NotLoggedInMessage from "../NotLoggedInMessage";
import { FadeLoader } from "react-spinners";
import { db, auth, storage } from "@/lib/firebase";
import {
  doc,
  addDoc,
  setDoc,
  getDoc,
  collection,
  where,
  query,
} from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import shortid from "shortid";
import { useRouter } from "next/router";
import File from "../utils/form/File";
import usePlaylistStore from "@/stores/playlists";
import { DEFAULT_PLAYLIST_IMAGE_NAME, IMAGE_FOLDER } from "@/constants/storage";
import { PlaylistType } from "@/types/data/playlist";

export default function CreatePlaylist() {
  const [title, setTitle] = useState("");
  const [img, setImg] = useState<File | null>(null);
  const [isPublic, setIsPublic] = useState(false);
  const [error, setError] = useState("");

  const { loggedIn } = useAuthStore();
  const { turnOn, turnOff } = useLoadingStore();
  const { addPlaylist } = usePlaylistStore();

  const router = useRouter();

  async function submitHandler(send: SendType) {
    turnOn();

    try {
      const user = auth.currentUser;

      // Get the channel using the user id
      const channelRef = doc(db, "channels", user?.uid || "");
      const channelDoc = await getDoc(channelRef);
      const channel = channelDoc.data();

      // console.log("Channel Data: ", channel);

      // Create new playlist
      // const playlistRef = doc(db, "playlists");
      const playlistCollection = collection(db, "playlists");
      const imgURL = img
        ? `${shortid.generate()}-${img.name}`
        : DEFAULT_PLAYLIST_IMAGE_NAME;

      const playlist = {
        title,
        about: "",
        loves: 0,
        img: imgURL,
        userId: user?.uid,
        channelId: user?.uid,
        channelName: channel?.name,
        channelImg: channel?.img,
        isPublic: isPublic || false,
      };

      const newPlaylist = await addDoc(playlistCollection, playlist);

      if (img) {
        const storageRef = ref(storage, `${IMAGE_FOLDER}/${imgURL}`);
        await uploadBytes(storageRef, img);
      }

      // Update the state
      // @ts-ignore
      addPlaylist({
        id: newPlaylist.id,
        ...playlist,
      });

      router.push(`/playlist/${newPlaylist.id}`);

      // console.log("Image: ", img[0]);
    } catch (error: any) {
      setError(error.message);
    }

    turnOff();
  }

  if (loggedIn === false) {
    return <NotLoggedInMessage task="create Playlist" />;
  }

  if (loggedIn === null) {
    return (
      <div className="preloader">
        <FadeLoader
          className="spinner"
          color="cyan"
          loading={loggedIn === null}
        />
      </div>
    );
  }

  if (loggedIn)
    return (
      <Form
        submitHandler={submitHandler}
        className="form-full"
        title="Create Playlist"
        error={error}
      >
        <Input label="Title of Playlist" value={title} setValue={setTitle} />

        <div className="form-wrapper">
          <Checkbox
            label="Public"
            checked={isPublic}
            setChecked={setIsPublic}
          />
        </div>

        {/* <Input label="Image URL" value={img} setValue={setImg} type="file" /> */}
        <File label="Image" setValue={setImg} />

        <button type="submit" className="btn green">
          Create
        </button>
      </Form>
    );

  return <></>;
}
