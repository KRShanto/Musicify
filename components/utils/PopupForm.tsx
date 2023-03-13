import React, { useContext } from "react";
import Popup from "./Popup";
import Form from "./form/Form";
import { SendType } from "./form/Form";
import usePopupStore from "@/stores/popup";

export default function PopupForm({
  className,
  submitHandler,
  children,
  // hideAfterSubmit = true,
  crossIcon = true,
}: {
  className?: string;
  submitHandler: (send: SendType) => void;
  children: React.ReactNode;
  // hideAfterSubmit?: boolean;
  crossIcon?: boolean;
}) {
  // const { closePopup } = usePopupStore((state) => state);

  const handleSubmit = async (send: SendType) => {
    submitHandler(send);
    // if (hideAfterSubmit) closePopup();
  };

  return (
    <Popup crossIcon={crossIcon}>
      <Form submitHandler={handleSubmit} className={className}>
        {children}
      </Form>
    </Popup>
  );
}
