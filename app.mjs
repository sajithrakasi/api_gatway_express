// Folder: /api-gateway/app.js
import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import authRoutes from './routes/authRoutes.mjs';
import patientRoutes from './routes/patientRoutes.mjs';
import fs from 'fs';
import { getPatient } from './controllers/patientController.mjs';

dotenv.config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use('/api/v1/auth', authRoutes);
app.use('/api/v1', patientRoutes);


// const raw = fs.readFileSync('customer.json');
// const testData = JSON.parse(raw);

// getPatient(testData).then(res => {
//     console.log("Test result:", res);
//   });

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`API Gateway running on port ${PORT}`));
