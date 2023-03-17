import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaHome, FaPlus } from "react-icons/fa";
import { FaHistory } from "react-icons/fa";
import { FaClock } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import {
  doc,
  getDoc,
  where,
  query,
  collection,
  getDocs,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import useAuthStore from "@/stores/auth";
import { PlaylistType } from "@/types/data/playlist";

export default function SideNavbar() {
  const [playlists, setPlaylists] = useState<any>([]);

  const { loggedIn } = useAuthStore();
  // Get the current user from firebase
  const user = loggedIn ? auth.currentUser : null;

  // Get all playlists where userId === current user
  // Read from "playlists" collection
  async function fetchPlaylists() {
    const q = query(
      collection(db, "playlists"),
      where("userId", "==", user?.uid)
    );
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      // update
      setPlaylists((prev: any) => [...prev, { id: doc.id, ...doc.data() }]);

      console.log("Playlist: ", doc.id, " => ", doc.data());
    });
  }

  useEffect(() => {
    if (loggedIn) {
      fetchPlaylists();
    }
  }, [loggedIn]);

  const links = [
    {
      section: "",
      links: [
        {
          name: "Home",
          path: "/",
          icon: <FaHome />,
        },
      ],
    },
    {
      section: "Library",
      links: [
        {
          name: "History",
          path: "/history",
          icon: <FaHistory />,
        },
        {
          name: "Listen Later",
          path: "/later",
          icon: <FaClock />,
        },
        {
          name: "Loved Songs",
          path: "/loved-songs",
          icon: <FaHeart />,
        },
        {
          name: "Loved Playlists",
          path: "/loved-playlists",
          icon: <FaHeart />,
        },
      ],
    },
  ];

  return (
    <div id="side-navbar">
      {links.map((link) => (
        <div className="section" key={link.section}>
          <p className="text-label">{link.section}</p>

          <div className="links">
            {link.links.map((link, index) => (
              <Link href={link.path} className="link" key={index}>
                {link.icon}
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      ))}

      <div className="section">
        <p className="text-label">Your Playlists</p>

        <div className="links">
          <Link href="/create/playlist" className="link">
            <FaPlus />
            New Playlist
          </Link>

          {playlists.map((playlist: any) => (
            <Link
              href={`/playlist/${playlist.id}`}
              className="link"
              key={playlist.id}
            >
              {playlist.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
