import express from 'express';
import { getPatient } from '../controllers/patientController.mjs';
import { validateGetPatient } from '../middlewares/patientValidate.mjs';

const router = express.Router();

// GET /api/v1/patient?patient_id=XYZ123
router.get('/patient',validateGetPatient,getPatient);

export default router;
