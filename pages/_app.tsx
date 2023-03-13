import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import Navbar from "@/components/Navbar";
import useLoadingStore from "@/stores/loading";
import { FadeLoader } from "react-spinners";
import usePopupStore from "@/stores/popup";
import PopupState from "@/components/PopupState";

export default function App({ Component, pageProps }: AppProps) {
  const { loading } = useLoadingStore((state) => state);
  const { popup } = usePopupStore((state) => state);

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
          <Component {...pageProps} />
        </main>
      </>
    </>
  );
}
