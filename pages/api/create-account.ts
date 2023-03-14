import { NextApiRequest, NextApiResponse } from "next";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import response from "@/lib/response";

// Create new account and create new document in "channels" collection
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { name, email, password } = req.body;

  try {
    // Create new account
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Create new channel
    await setDoc(doc(db, "channels", userCredential.user.uid), {
      userId: userCredential.user.uid,
      name,
      about: null,
      country: null,
      url: name.toLowerCase().replace(/ /g, "-"),
      photo: null,
      followers: 0,
      createdAt: new Date(),
    });

    // Return success response
    return response(res, {
      type: "SUCCESS",
      msg: "Account created successfully",
    });
  } catch (error: any) {
    // Return error response
    return response(
      res,
      {
        type: "SERVER_ERROR",
        msg: error.message,
      },
      400
    );
  }
}
