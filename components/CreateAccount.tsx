import React, { useState } from "react";
import Form, { SendType } from "./utils/form/Form";
import Input from "./utils/form/Input";
import { auth, db } from "@/configs/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function CreateAccount() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function submitHandler(send: SendType) {
    const res = await send("/api/create-account", {
      name,
      email,
      password,
    });

    if (res.type === "SUCCESS") {
      console.log("Success");
    } else {
      console.log("Error: ", res.msg);
      setError(res.msg || "Something went wrong");
    }
  }

  return (
    <Form submitHandler={submitHandler}>
      <h2 className="heading">Create Account</h2>

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
