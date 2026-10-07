import jsforce from "jsforce";
import dotenv from "dotenv";

dotenv.config();

const conn = new jsforce.Connection({
  loginUrl: process.env.SF_LOGIN_URL,
});

export const connectSalesforce = async () => {
  await conn.login(
    process.env.SF_USERNAME,
    process.env.SF_PASSWORD + process.env.SF_SECURITY_TOKEN
  );

  console.log("✅ Connected to Salesforce");

  return conn;
};
