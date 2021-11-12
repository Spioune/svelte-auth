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

export async function get() {
  const loginUrl = `${AUTH0_ISSUER_BASE_URL}/authorize?response_type=code&client_id=${AUTH0_CLIENT_ID}&redirect_uri=${AUTH0_BASE_URL}/api/auth/callback&scope=openid%20profile%20email&audience=${AUTH0_AUDIENCE}`;

  return {
    status: 302,
    headers: { Location: loginUrl },
  };
}
