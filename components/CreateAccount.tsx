import React, { useState } from "react";
import Form, { SendType } from "./utils/form/Form";
import Input from "./utils/form/Input";
import { auth, db } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import Password from "./utils/form/Password";
import { useRouter } from "next/router";

export default function CreateAccount() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  async function submitHandler(send: SendType) {
    const res = await send("/api/create-account", {
      name,
      email,
      password,
    });

    if (res.type === "SUCCESS") {
      // login
      try {
        await signInWithEmailAndPassword(auth, email, password);

        router.push("/");
      } catch (error: any) {
        setError(error.message);
      }
    } else {
      console.log("Error: ", res.msg);
      setError(res.msg || "Something went wrong");
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
