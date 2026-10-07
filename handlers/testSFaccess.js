import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, "../.env");

console.log("Using ENV file:", envPath);

dotenv.config({
  path: envPath,
});

async function testOAuth() {
  try {
    console.log("SF_LOGIN_URL:", process.env.SF_LOGIN_URL);
    console.log("SF_CLIENT_ID:", process.env.SF_CLIENT_ID);
    const response = await fetch(
      `${process.env.SF_LOGIN_URL}/services/oauth2/token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "client_credentials",
          client_id: process.env.SF_CLIENT_ID,
          client_secret: process.env.SF_CLIENT_SECRET,
        }),
      }
    );

    const data = await response.json();

    console.log("Status:", response.status);
    console.log("Response:", data);
  } catch (error) {
    console.error("OAuth Error:", error);
  }
}

testOAuth();