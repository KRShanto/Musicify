import Link from "next/link";
import React from "react";
// Home icon from react-icons
import { FaHome } from "react-icons/fa";
// History icon from react-icons
import { FaHistory } from "react-icons/fa";
// Watch later icon from react-icons
import { FaClock } from "react-icons/fa";
// love icon
import { FaHeart } from "react-icons/fa";

export default function Navbar() {
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
    <nav>
      <div className="logo">
        <h1>Musicify</h1>
      </div>

      {links.map((link) => (
        <div className="section" key={link.section}>
          <div className="heading">
            <p>{link.section}</p>
          </div>

          <div className="links">
            {link.links.map((link) => (
              <div className="link" key={link.name}>
                {link.icon}
                <Link href={link.path}>{link.name}</Link>
              </div>
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}