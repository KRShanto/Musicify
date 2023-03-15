import React, { useState } from "react";
import Form, { SendType } from "../utils/form/Form";
import Input from "../utils/form/Input";
import { auth, db } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import Password from "../utils/form/Password";
import { useRouter } from "next/router";
import useLoadingStore from "@/stores/loading";

export default function CreateAccount() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      const newChannel = await setDoc(
        doc(db, "channels", userCredential.user.uid),
        {
          id: userCredential.user.uid,
          userId: userCredential.user.uid,
          name,
          about: null,
          country: null,
          url,
          photo: null,
          followers: 0,
          createdAt: new Date(),
        }
      );

      if (userCredential) {
        turnOff();
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
