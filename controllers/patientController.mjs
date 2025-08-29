import db from '../config/db.mjs';
import CryptographyPlugin from '../../opt/Plugins/CryptoPlugin/cryptoPlugin.mjs';
import axios from 'axios'; 



const Cryptography = new CryptographyPlugin();

export const getPatient = async (req, res) => {
  try {
    const { phone, customer_id, dob, first_name, last_name, zip } = req.query || {};

    if (!phone || !customer_id || customer_id === '') {
      return res.status(400).json({ message: 'Phone and customer_id are required.' });
    }

    const encodedPhone = Cryptography.encode(phone);
    const encodedDob = dob ? Cryptography.encode(dob) : null;
    const encodedFirstName = first_name ? Cryptography.encode(first_name.toUpperCase()) : null;
    const encodedLastName = last_name ? Cryptography.encode(last_name.toUpperCase()) : null;
    const encodedZip = zip ? Cryptography.encode(zip) : null;

    let query = db('emr_patient')
      .where('delete_flag', 'N')
      .andWhere('phone', encodedPhone)
      .andWhere('practice_id', customer_id);

    let patients = await query;

 
    if (patients.length > 1 && dob) {
      patients = patients.filter(p => p.dob === encodedDob);
    }

    if (patients.length > 1 && first_name) {
      patients = patients.filter(p => p.first_name === encodedFirstName);
    }

  
    if (patients.length > 1 && last_name) {
      patients = patients.filter(p => p.last_name === encodedLastName);
    }

    if (patients.length > 1 && zip) {
      patients = patients.filter(p => p.zip === encodedZip);
    }

    // If no local patients are found, try fetching from the EMR API
    if (!patients.length) {
      console.log('No patient found locally, calling EMR API...');

    }

    // If patients were found in the database, decrypt sensitive fields
    // const encryptedFields = [
    //   'first_name', 'last_name', 'middle_name', 'phone', 'dob', 'gender', 'zip', 'email', 'mobile_phone', 'marital_status',
    //   'full_name', 'address1', 'address2', 'city', 'state', 'ssn', 'work_phone', 'home_phone', 'concent_to_text',
    //   'guarantor_firstname', 'guarantor_lastname', 'guarantor_email', 'guarantor_phone', 'guarantor_ssn', 'guarantor_dob',
    //   'guarantor_address1', 'guarantor_address2', 'guarantor_city', 'guarantor_state', 'guarantor_zip', 'guarantor_countrycode3166',
    //   'guardian_firstname', 'guardian_lastname', 'guardian_phone_number', 'guardian_address1', 'guardian_address2',
    //   'emergency_first_name', 'emergency_last_name', 'emergency_relationship', 'emergency_phone_number', 'emergency_mobile_number',
    //   'emergency_home_number', 'language6392code', 'emergency_address1', 'emergency_address2', 'emergency_zip', 'emergency_city',
    //   'emergency_state', 'consenttocall',
    // ];

    // const decryptedPatients = patients.map(patient => {
    //   const decrypted = {};
    //   for (const key in patient) {
    //     if (encryptedFields.includes(key) && patient[key]) {
    //       decrypted[key] = Cryptography.decode(patient[key]);
    //     } else {
    //       decrypted[key] = patient[key];
    //     }
    //   }
    //   return decrypted;
    // });

    // Return the decrypted patient data
    return res.status(200).json({ patients });

  } catch (error) {
    console.error('Error getting patient:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
