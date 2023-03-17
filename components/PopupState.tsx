import React from "react";
import usePopupStore from "@/stores/popup";
import CreatePlaylist from "./forms/CreatePlaylist";
import CreateSong from "./forms/CreateSong";

export default function PopupState() {
  const { popup } = usePopupStore((state) => state);

  return (
    <>
      {popup === "CreatePlaylist" && <CreatePlaylist />}
      {popup === "CreateMusic" && <CreateSong />}
    </>
  );
}
