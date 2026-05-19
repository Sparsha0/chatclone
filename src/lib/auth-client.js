// import { createAuthClient } from "better-auth/react"

// const baseURL =
//   typeof window === "undefined"
//     ? "http://localhost:3000/api/auth"
//     : new URL("/api/auth", window.location.origin).toString();

// export const { signIn, signUp, useSession, signOut } = createAuthClient({
//   baseURL,
// });


import { createAuthClient } from "better-auth/react";

export const { signIn, signUp, useSession, signOut } =
  createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_APP_URL
      ? `${process.env.NEXT_PUBLIC_APP_URL}/api/auth`
      : "http://localhost:3000/api/auth",
  });