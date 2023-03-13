import React, { useContext } from "react";
import usePopupStore from "@/stores/popup";
// import an icon for the close button (react-icons)
import { FaTimes } from "react-icons/fa";

export default function Popup({
  crossIcon = true,
  children,
}: {
  crossIcon: boolean;
  children: React.ReactNode;
}) {
  const closePopup = usePopupStore((state) => state.closePopup);

  return (
    <>
      <div id="popup">
        {crossIcon && (
          <button
            className="close btn red"
            onClick={() => {
              closePopup();
            }}
          >
            <FaTimes />
          </button>
        )}

        {children}
      </div>
    </>
  );
}
