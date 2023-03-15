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
  const [playlists, setPlaylists] = useState<PlaylistType[]>([]);
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
      setPlaylists((prev: any) => [...prev, doc.data()]);
    });
  }

  useEffect(() => {
    if (loggedIn) {
      fetchPlaylists();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          <p className="heading">{link.section}</p>

          <div className="links">
            {link.links.map((link) => (
              <Link href={link.path} className="link" key={link.name}>
                {link.icon}
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      ))}

      <div className="section">
        <p className="heading">Your Playlists</p>

        <div className="links">
          <Link href="/create/playlist" className="link">
            <FaPlus />
            New Playlist
          </Link>
        </div>
      </div>
    </div>
  );
}
