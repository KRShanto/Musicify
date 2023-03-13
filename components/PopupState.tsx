import React from "react";
import usePopupStore from "@/stores/popup";
import CreatePlaylist from "./CreatePlaylist";
import CreateMusic from "./CreateMusic";

export default function PopupState() {
  const { popup } = usePopupStore((state) => state);

  return (
    <>
      {popup === "CreatePlaylist" && <CreatePlaylist />}
      {popup === "CreateMusic" && <CreateMusic />}
    </>
  );
}
