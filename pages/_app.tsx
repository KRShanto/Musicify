import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import SideNavbar from "@/components/navbar/SideNavbar";
import useLoadingStore from "@/stores/loading";
import { FadeLoader } from "react-spinners";
import usePopupStore from "@/stores/popup";
import PopupState from "@/components/PopupState";
import { auth } from "@/lib/firebase";
import { useEffect } from "react";
import useAuthStore from "@/stores/auth";
import usePlaylistStore from "@/stores/playlists";
import Navbar from "@/components/navbar/Navbar";
import LoadingBar from "react-top-loading-bar";
import { useState } from "react";
import { useRouter } from "next/router";
import {
  doc,
  getDoc,
  where,
  query,
  collection,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { PlaylistType } from "@/types/data/playlist";

export default function App({ Component, pageProps }: AppProps) {
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  const { loading, turnOn, turnOff } = useLoadingStore((state) => state);
  const { popup } = usePopupStore((state) => state);
  const { loggedIn, setLoggedIn } = useAuthStore((state) => state);
  const { setPlaylists } = usePlaylistStore((state) => state);

  const user = loggedIn ? auth.currentUser : null;

  // Get all playlists where userId === current user
  // Read from "playlists" collection
  async function fetchPlaylists() {
    const q = query(
      collection(db, "playlists"),
      where("userId", "==", user?.uid)
    );
    const querySnapshot = await getDocs(q);

    let playlists: PlaylistType[] = [];

    querySnapshot.forEach((doc) =>
      playlists.push({
        id: doc.id,
        ...doc.data(),
      } as PlaylistType)
    );

    // update
    setPlaylists(playlists);
  }

  useEffect(() => {
    if (loggedIn) {
      fetchPlaylists();
    }
  }, [loggedIn]);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setLoggedIn(true);
      } else {
        setTimeout(() => {
          setLoggedIn(false);
        }, 2000);
      }
    });
  }, []);

  // Progress bar
  useEffect(() => {
    const handleStart = (url: string) => {
      setProgress(30);
    };
    const handleComplete = (url: string) => {
      setProgress(100);
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  return (
    <>
      <LoadingBar
        color="rgb(0, 255, 208)"
        height={3}
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />

      {loading && (
        <div className="preloader gloabl-preloader">
          <FadeLoader className="spinner" color="cyan" loading={loading} />
        </div>
      )}

      <>
        {popup && <PopupState />}
        <main style={{ opacity: loading || popup ? 0.2 : 1 }}>
          <Navbar />

          <div className="body">
            <SideNavbar />
            <div className="main-body">
              <Component {...pageProps} />
            </div>
          </div>
        </main>
      </>
    </>
  );
}
