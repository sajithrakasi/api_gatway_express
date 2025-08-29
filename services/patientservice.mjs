import { Patient, EmrPatient } from '../models'; 

export async function findPatientByPhone(phone) {
  try {
    // Example query to find patients by phone number
    return await Patient.findAll({
      where: { phone },
    });
  } catch (err) {
    console.error('Error finding patient by phone:', err);
    throw err;
  }
}

export async function findPatientByEmr(phone) {
  try {
    // Example query to search for the patient in the EMR system
    return await EmrPatient.findOne({
      where: { phone },
    });
  } catch (err) {
    console.error('Error finding patient in EMR:', err);
    throw err;
  }
}
