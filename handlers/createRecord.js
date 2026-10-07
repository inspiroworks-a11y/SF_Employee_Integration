import dotenv from "dotenv";
dotenv.config();

async function createEmployee(employeeId,firstName, lastName, email, phone, department, designation, sallary, doj) {
  // Step 1: Get Access Token
  const tokenResponse = await fetch(
    `${process.env.SF_LOGIN_URL}/services/oauth2/token`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: process.env.SF_CLIENT_ID,
        client_secret: process.env.SF_CLIENT_SECRET,
      }),
    }
  );

  const auth = await tokenResponse.json();

  // Step 2: Create Record
  const response = await fetch(
    `${auth.instance_url}/services/data/v62.0/sobjects/Employee__c`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${auth.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        First_Name__c: firstName,
        Last_Name__c: lastName,
        Email__c: email,
        Employee_Id__c: employeeId,
        Phone__c: phone,
        Department__c:department,
        Designation__c:designation,
        Sallary__c:sallary,
        Date_of_joining__c:doj,
      }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
        console.error("Salesforce Error:", result);
        return;
    }
  console.log(result);
}