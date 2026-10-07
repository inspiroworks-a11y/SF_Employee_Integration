import express from 'express';
import cors from 'cors';
import createEmployee from './handlers/createRecord.js';

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const employees = [];

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Employee backend is running',
  });
});

app.get('/api/employees', (req, res) => {
  res.status(200).json(employees);
});

app.post('/api/employees', async (req, res) => {
  const employee = req.body;

  if (!employee || !employee.firstName || !employee.lastName || !employee.email) {
    return res.status(400).json({
      message: 'First name, last name, and email are required.',
    });
  }

  try {
    console.log('Received employee data:', employee);

    const salesforceResult = await createEmployee(
      employee.employeeId,
      employee.firstName,
      employee.lastName,
      employee.email,
      employee.phone,
      employee.department,
      employee.designation,
      employee.salary,
      employee.joiningDate
    );

    if (!salesforceResult || !salesforceResult.success) {
      return res.status(500).json({
        message: 'Failed to create employee in Salesforce.',
      });
    }

    const newEmployee = {
      id: Date.now(),
      ...employee,
      createdAt: new Date().toISOString(),
      salesforceId: salesforceResult.id,
    };

    employees.push(newEmployee);

    return res.status(201).json({
      message: 'Employee registered successfully',
      employee: newEmployee,
      salesforceId: salesforceResult.id,
    });
  } catch (error) {
    console.error('Employee registration failed:', error);
    return res.status(500).json({
      message: 'Something went wrong while registering the employee.',
    });
  }
});

app.use((err, req, res, next) => {
  console.error('Server error:', err.message);
  res.status(500).json({ message: 'Something went wrong on the server.' });
});

export default app;
