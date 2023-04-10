import React, { useState, useEffect } from "react";
import useAuthStore from "@/stores/auth";
import useLoadingStore from "@/stores/loading";
import usePlaylistStore from "@/stores/playlists";
import NotLoggedInMessage from "../NotLoggedInMessage";
import {
  DEFAULT_SONG_IMAGE_NAME,
  IMAGE_FOLDER,
  AUDIO_FOLDER,
} from "@/constants/storage";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { auth, db, storage } from "@/lib/firebase";
import { ref, uploadBytesResumable, uploadBytes } from "firebase/storage";
import { FadeLoader } from "react-spinners";
import { useRouter } from "next/router";
import { PlaylistType } from "@/types/data/playlist";
import shortid from "shortid";
import Form from "../utils/form/Form";
import Input from "../utils/form/Input";
import File from "../utils/form/File";
import Checkbox from "../utils/form/Checkbox";
import Select from "../utils/form/Select";
import Progress from "../utils/form/Progress";

export default function CreateSong() {
  const { loggedIn } = useAuthStore();
  const { playlists } = usePlaylistStore();

  if (loggedIn === false) {
    return <NotLoggedInMessage task="create Song" />;
  }

  if (loggedIn === null || playlists.length === 0) {
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

  if (loggedIn === true) {
    return <CreateSongForm />;
  }

  return <></>;
}

function CreateSongForm() {
  const { turnOn, turnOff } = useLoadingStore();
  const { playlists } = usePlaylistStore();

  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [img, setImg] = useState<File | null>(null);
  const [audio, setAudio] = useState<File | null>(null);
  const [isPublic, setIsPublic] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState<string>(
    playlists[0].title
  );
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [displayedPlaylists, setDisplayedPlaylists] = useState<string[]>(
    playlists.map((playlist) => playlist.title)
  );

  const router = useRouter();
  const query = router.query.playlist;

  console.log("Query: ", router.query);

  useEffect(() => {
    // if any query "playlist" is present, then filter the playlists
    if (query) {
      const filteredPlaylists = playlists.filter((playlist) =>
        // match with playlist id
        playlist.id.includes(query as string)
      );
      console.log("Filtered Playlists: ", filteredPlaylists);
      setDisplayedPlaylists(
        filteredPlaylists.map((playlist) => playlist.title)
      );
      setSelectedPlaylist(filteredPlaylists[0].title);
    }
  }, [playlists, query]);

  // While uploading the file, the progress is shown
  async function submitHandler() {
    turnOn();

    // Check if all the fields are filled
    if (!title || !artist || !audio || !selectedPlaylist) {
      setError("Please fill all the fields");
      turnOff();
      return;
    }

    try {
      const user = auth.currentUser;

      // Get the channel using the user id
      const channelRef = doc(db, "channels", user?.uid || "");
      const channelDoc = await getDoc(channelRef);
      const channel = channelDoc.data();

      // console.log("Channel Data: ", channel);

      // Playlist id
      const playlist = playlists.find(
        (playlist) => playlist.title === selectedPlaylist
      );

      const playlistId = playlist?.id;

      console.log("Playlists: ", playlists);
      console.log("Playlist: ", playlist);
      console.log("Selected Playlist: ", selectedPlaylist);

      // Create new song
      const songCollection = collection(db, "songs");

      // Image URL
      const imgURL = img
        ? `${shortid.generate()}-${img.name}`
        : DEFAULT_SONG_IMAGE_NAME;

      // Audio URL
      const audioURL = `${shortid.generate()}-${audio.name}`;

      // Create the song
      const song = {
        title,
        artist,
        imgURL,
        audioURL,
        isPublic,
        userId: user?.uid,
        // channel,
        channelId: user?.uid,
        channelName: channel?.name,
        channelImg: channel?.img,
        playlistId,

        createdAt: new Date(),
      };

      console.log("Song: ", song);

      // Add the song to the database
      const newSong = await addDoc(songCollection, song);

      turnOff();

      // Upload the image to the storage
      // No need to show the progress as it is very fast
      if (img) {
        const imgRef = ref(storage, `${IMAGE_FOLDER}/${imgURL}`);
        await uploadBytes(imgRef, img);
      }

      // TODO: update the progress store
      // Upload the audio to the storage
      // Show the progress
      // if (audio) {
      const audioRef = ref(storage, `${AUDIO_FOLDER}/${audioURL}`);
      const uploadTask = uploadBytesResumable(audioRef, audio);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
        },
        (error) => {
          setError(error.message);
          turnOff();
        },
        () => {
          // Upload completed
          // uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          // console.log("File available at", downloadURL);
          // });
          console.log("Upload completed");

          // If the url has a query "playlist", then redirect to the playlist page
          // else redirect to the song page
          if (query) {
            router.push(`/playlist/${playlistId}`);
          } else {
            router.push(`/song/${newSong.id}`);
          }
        }
      );

      // }
    } catch (error: any) {
      setError(error.message);
    }

    turnOff();
  }

  return (
    <Form submitHandler={submitHandler} className="form-full">
      <h2 className="heading">Create Song</h2>

      {error && <p className="error">{error}</p>}

      <Input label="Title of the song" value={title} setValue={setTitle} />

      <Input label="Artist" value={artist} setValue={setArtist} />

      <File label="Image" setValue={setImg} />

      <File label="Audio" setValue={setAudio} />

      <div className="form-wrapper">
        <Checkbox label="Public" checked={isPublic} setChecked={setIsPublic} />
      </div>

      <Select
        label="Playlist"
        options={displayedPlaylists}
        value={selectedPlaylist}
        setValue={setSelectedPlaylist}
      />

      <Progress progress={progress} />

      <button className="btn green" type="submit">
        Create
      </button>
    </Form>
  );
}
