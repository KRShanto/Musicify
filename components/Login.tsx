import React, { useState } from "react";
import Form, { SendType } from "./utils/form/Form";
import Input from "./utils/form/Input";
import { auth } from "@/configs/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function submitHandler(send: SendType) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
    } catch (error: any) {
      setError(error.message);
    }
  }

  return (
    <Form submitHandler={submitHandler}>
      <h2 className="heading">Login</h2>

      {error && <p className="error">{error}</p>}

      <Input
        type="email"
        label="Email"
        value={email}
        setValue={setEmail}
        required
      />

      <Input
        type="text" // TODO password
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
