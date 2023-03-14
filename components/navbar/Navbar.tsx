import Link from "next/link";
import { FaPlus } from "react-icons/fa";
import Search from "./Search";
import { useAuthStore } from "@/stores/auth";

export default function Navbar() {
  const { loggedIn } = useAuthStore((state) => state);

  return (
    <nav>
      <div className="logo">
        <Link href="/">Musicify</Link>
      </div>

      <div className="links">
        <Search />

        <Link href="/create" className="link">
          Create <FaPlus />
        </Link>

        {/* TODO: don't show it if user is already premium */}
        <Link href="/upgrade" className="link upgrade">
          Upgrade
        </Link>

        {/* TODO login and create account will go under the profile section */}
        {loggedIn ? (
          <div className="profile">Profile</div>
        ) : (
          <>
            <Link href="/login" className="link">
              Login
            </Link>

            <Link className="link" href="create-account">
              Create Account
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
