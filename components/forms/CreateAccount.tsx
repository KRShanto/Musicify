import React, { useState } from "react";
import Form, { SendType } from "../utils/form/Form";
import Input from "../utils/form/Input";
import { auth, db, storage } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import Password from "../utils/form/Password";
import { useRouter } from "next/router";
import useLoadingStore from "@/stores/loading";
import { DEFAULT_CHANNEL_IMAGE_NAME, IMAGE_FOLDER } from "@/constants/storage";
import shortid from "shortid";
import { ref, uploadBytes } from "firebase/storage";
import File from "../utils/form/File";

export default function CreateAccount() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [img, setImg] = useState<File | null>(null);
  const [error, setError] = useState("");

  const router = useRouter();

  const { turnOn, turnOff } = useLoadingStore();

  async function submitHandler(send: SendType) {
    const url = name.toLowerCase().replace(/ /g, "-");
    turnOn();

    try {
      // Create new account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Create new channel
      const channelRef = doc(db, "channels", userCredential.user.uid);
      const imgURL = img
        ? `${shortid.generate()}-${img.name}`
        : DEFAULT_CHANNEL_IMAGE_NAME;

      await setDoc(channelRef, {
        // id: userCredential.user.uid,
        userId: userCredential.user.uid,
        name,
        about: null,
        country: null,
        img: imgURL,
        followers: 0,
        createdAt: new Date(),
      });

      if (userCredential) {
        turnOff();

        // Upload image
        if (img) {
          const storageRef = ref(storage, `${IMAGE_FOLDER}/${imgURL}`);
          await uploadBytes(storageRef, img);
        }

        router.push(`/channel/${url}`);
      }

      // console.log("New channel: ", newChannel);
    } catch (e: any) {
      setError(e.message);
    }
  }

  return (
    <Form submitHandler={submitHandler} className="form-full">
      <h2 className="heading">Create Account</h2>

      {error && <p className="error">{error}</p>}

      <Input label="Channel Name" value={name} setValue={setName} required />

      <File label="Channel Image" setValue={setImg} accept="image/*" />

      <Input
        type="email"
        label="Email"
        value={email}
        setValue={setEmail}
        required
      />

      <Password
        label="Password"
        value={password}
        setValue={setPassword}
        required
      />

      <button type="submit" className="btn green">
        Login
      </button>
    </Form>
  );
}
