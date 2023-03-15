import React, { useState } from "react";
import Checkbox from "../utils/form/Checkbox";
import Form, { SendType } from "../utils/form/Form";
import Input from "../utils/form/Input";
import useAuthStore from "@/stores/auth";
import useLoadingStore from "@/stores/loading";
import NotLoggedInMessage from "../NotLoggedInMessage";
import { FadeLoader } from "react-spinners";
import { db, auth } from "@/lib/firebase";
import {
  doc,
  addDoc,
  setDoc,
  getDoc,
  collection,
  where,
  query,
} from "firebase/firestore";
import shortid from "shortid";
import { useRouter } from "next/router";

export default function CreatePlaylist() {
  const [title, setTitle] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [error, setError] = useState("");

  const { loggedIn } = useAuthStore();
  const { turnOn, turnOff } = useLoadingStore();

  const router = useRouter();

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

  async function submitHandler(send: SendType) {
    // if (!title) return setError("Title is required");
    // const res = await send("/api/create-playlist", {
    //   title,
    //   isPublic,
    // });
    // if (res.type === "SUCCESS") {
    //   // TODO: redirect
    //   console.log("Success create playlist");
    // } else {
    //   console.log("Error: ", res.msg);
    //   setError(res.msg || "Something went wrong");
    // }
    turnOn();

    try {
      // Check if the user is authenticated
      const user = auth.currentUser;

      // Get the channel using the user id
      const channelRef = doc(db, "channels", user?.uid || "");
      const channelDoc = await getDoc(channelRef);
      const channel = channelDoc.data();

      console.log("Channel Data: ", channel);

      // Create new playlist
      const playlistRef = doc(db, "playlists", channel?.id);

      const url = shortid.generate();

      await setDoc(playlistRef, {
        title,
        loves: 0,
        url,
        userId: user?.uid,
        channelId: channel?.id,
        channelName: channel?.name,
        channelUrl: channel?.url,
        channelPhoto: channel?.photo,
        isPublic: isPublic || false,
      });

      router.push(`/playlist/${url}`);
    } catch (error: any) {
      setError(error.message);
    }

    turnOff();
  }

  if (loggedIn)
    return (
      <Form submitHandler={submitHandler} className="form-full">
        <h2 className="heading">Create Playlist</h2>

        {error && <p className="error">{error}</p>}

        <Input label="Title of Playlist" value={title} setValue={setTitle} />

        <div className="form-wrapper">
          <Checkbox
            label="Public"
            checked={isPublic}
            setChecked={setIsPublic}
          />
        </div>

        <button type="submit" className="btn green">
          Create
        </button>
      </Form>
    );

  return <></>;
}
