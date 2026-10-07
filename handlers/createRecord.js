import dotenv from 'dotenv';

dotenv.config();

async function createEmployee(
  employeeId,
  firstName,
  lastName,
  email,
  phone,
  department,
  designation,
  salary,
  doj
) {
  const tokenResponse = await fetch(
    `${process.env.SF_LOGIN_URL}/services/oauth2/token`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.SF_CLIENT_ID,
        client_secret: process.env.SF_CLIENT_SECRET,
      }),
    }
  );

  const auth = await tokenResponse.json();

  if (!tokenResponse.ok) {
    console.error('Salesforce auth failed:', auth);
    return { success: false, error: auth };
  }

  const payload = {
    Employee_Id__c: employeeId,
    FIrst_Name__c: firstName,
    Last_Name__c: lastName,
    Email__c: email,
    Phone__c: phone,
    Department__c: department,
    Designation__c: designation,
    Sallary__c: salary,
    Date_of_joining__c: doj,
  };

  const response = await fetch(
    `${auth.instance_url}/services/data/v62.0/sobjects/Employee__c`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${auth.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    console.error('Salesforce Error:', result);
    return { success: false, error: result };
  }

  console.log('Salesforce record created:', result);
  return { success: true, id: result.id };
}

export default createEmployee;