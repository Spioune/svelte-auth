import dotenv from "dotenv";
dotenv.config();

const {
  AUTH0_SECRET,
  AUTH0_BASE_URL,
  AUTH0_ISSUER_BASE_URL,
  AUTH0_CLIENT_ID,
  AUTH0_CLIENT_SECRET,
  AUTH0_AUDIENCE,
  AUTH0_COOKIE_NAME,
} = process.env;

import Iron from "@hapi/iron";
import * as jose from "jose";

export async function get({
  headers,
  method,
  host,
  path,
  query,
  body,
  params,
}) {
  if (query.get("error")) {
    throw new Error(query.get("error"));
  }

  const data = await fetch(`${AUTH0_ISSUER_BASE_URL}/oauth/token`, {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify({
      grant_type: "authorization_code",
      client_id: AUTH0_CLIENT_ID,
      client_secret: AUTH0_CLIENT_SECRET,
      code: query.get("code"),
      redirect_uri: `${AUTH0_BASE_URL}/api/auth/callback`,
    }).toString(),
  });

  const { access_token, id_token, scope, expires_in, token_type } =
    await data.json();

  const JWKS = jose.createRemoteJWKSet(
    new URL(`${AUTH0_ISSUER_BASE_URL}/.well-known/jwks.json`)
  );

  const { payload: user } = await jose.jwtVerify(id_token, JWKS, {
    issuer: `${AUTH0_ISSUER_BASE_URL}/`,
  });

  const cookie = {
    user,
    id_token,
    access_token,
    scope,
    expires_in,
    token_type,
  };

  console.log(cookie);

  const sealedCookie = await Iron.seal(
    cookie,
    AUTH0_CLIENT_SECRET,
    Iron.defaults
  );

  const date = new Date();
  date.setDate(date.getDate() + 1);

  return {
    status: 302,
    headers: {
      "Set-cookie": `${AUTH0_COOKIE_NAME}=${sealedCookie}; Path=/; Secure; HttpOnly; SameSite=Lax; Expires=${date.toUTCString()}`,
      Location: "/",
    },
  };
}
