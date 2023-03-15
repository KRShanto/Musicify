import Link from "next/link";
import React from "react";
// playlist icon
import { BsMusicNoteList } from "react-icons/bs";
// song icon
import { BsMusicNote } from "react-icons/bs";

export default function CreatePage() {
  return (
    <div id="create-page">
      <Link href="/create/playlist">
        <BsMusicNoteList />
        Create Playlist
      </Link>
      <Link href="/create/song">
        <BsMusicNote />
        Create Song
      </Link>
    </div>
  );
}
