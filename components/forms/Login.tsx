import React, { useState } from "react";
import Form, { SendType } from "../utils/form/Form";
import Input from "../utils/form/Input";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import Password from "../utils/form/Password";
import { useRouter } from "next/router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  async function submitHandler(send: SendType) {
    try {
      await signInWithEmailAndPassword(auth, email, password);

      router.push("/");
    } catch (error: any) {
      setError(error.message);
    }
  }

  return (
    <Form
      submitHandler={submitHandler}
      className="form-full"
      title="Login"
      error={error}
    >
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
