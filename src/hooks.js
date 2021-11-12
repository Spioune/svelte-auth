import dotenv from "dotenv";
dotenv.config();

const { AUTH0_CLIENT_SECRET, AUTH0_COOKIE_NAME } = process.env;

import { parse } from "cookie";
import Iron from "@hapi/iron";

/** @type {import('@sveltejs/kit').GetSession} */
export async function getSession(request) {
  const cookies = parse(request.headers.cookie || "");

  if (cookies[AUTH0_COOKIE_NAME] != null) {
    const session = await Iron.unseal(
      cookies[AUTH0_COOKIE_NAME],
      AUTH0_CLIENT_SECRET,
      Iron.defaults
    );
    return { user: session.user };
  }
}
