import Link from "next/link";
// plus icon
import { FaPlus } from "react-icons/fa";
// search icon
import { AiOutlineSearch } from "react-icons/ai";
import { useAuthStore } from "@/stores/auth";

export default function Navbar() {
  const { loggedIn } = useAuthStore((state) => state);

  return (
    <nav>
      <div className="logo">
        <h2>Musicify</h2>
      </div>

      <div className="links">
        <div className="link search">
          <input type="text" placeholder="Search" />
          <button>
            {" "}
            <AiOutlineSearch />
          </button>
        </div>

        <Link href="/create" className="link">
          Create <FaPlus />
        </Link>

        {/* TODO: don't show it if user is already premium */}
        <Link href="/upgrade" className="link upgrade">
          Upgrade
        </Link>

        {loggedIn ? (
          <div className="profile">Profile</div>
        ) : (
          <>
            <Link href="/login" className="link">
              Login
            </Link>

            <Link className="/create-account" href="create-account">
              Create Account
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
