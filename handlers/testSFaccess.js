import { connectSalesforce } from "./salesforce.js";

async function testConnection() {
  try {
    const conn = await connectSalesforce();

    console.log(conn.userInfo);
  } catch (err) {
    console.error(err);
  }
}

testConnection();