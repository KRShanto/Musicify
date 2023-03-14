import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import SideNavbar from "@/components/navbar/SideNavbar";
import useLoadingStore from "@/stores/loading";
import { FadeLoader } from "react-spinners";
import usePopupStore from "@/stores/popup";
import PopupState from "@/components/PopupState";
import { auth } from "@/lib/firebase";
import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth";
import Navbar from "@/components/navbar/Navbar";

export default function App({ Component, pageProps }: AppProps) {
  const { loading } = useLoadingStore((state) => state);
  const { popup } = usePopupStore((state) => state);

  const { setLoggedIn } = useAuthStore((state) => state);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("User: ", user);
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {loading && (
        <div id="preloader">
          <FadeLoader className="spinner" color="cyan" loading={loading} />
        </div>
      )}

      <>
        {popup && <PopupState />}
        <main style={{ opacity: loading || popup ? 0.2 : 1 }}>
          <Navbar />

          <div className="body">
            <SideNavbar />
            {/* <div className="main-body" style={{}}> */}
            <Component {...pageProps} />
            {/* </div> */}
          </div>
        </main>
      </>
    </>
  );
}
