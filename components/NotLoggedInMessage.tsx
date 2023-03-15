import Link from "next/link";
import React from "react";

export default function NotLoggedInMessage({ task }: { task: string }) {
  return (
    <div className="not-logged-in">
      <h2 className="heading">You need to be logged in to {task}</h2>
      <Link href="/login" className="btn skyblue">
        Go To Login
      </Link>
    </div>
  );
}
