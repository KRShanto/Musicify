import React, { useState } from "react";
import { useRouter } from "next/router";
import { AiOutlineSearch } from "react-icons/ai";
import { AiOutlineClose } from "react-icons/ai";

export default function Search() {
  const [search, setSearch] = useState("");
  const router = useRouter();

  function handleSearch(e: React.FormEvent<HTMLButtonElement>) {
    e.preventDefault();

    router.push(
      `/search?query=${
        // lowercase the search query and replace spaces with +
        search.toLowerCase().replace(/ /g, "+")
      }`
    );
  }

  return (
    <form className="link search">
      <div className="input-clear">
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="clear" type="button" onClick={() => setSearch("")}>
          <AiOutlineClose />
        </button>
      </div>

      <button type="submit" onClick={handleSearch}>
        <AiOutlineSearch />
      </button>
    </form>
  );
}
