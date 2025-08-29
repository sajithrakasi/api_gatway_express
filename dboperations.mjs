//emrdbOperations..........
import dotenv from 'dotenv';
dotenv.config();
const emr_db = process.env.DB_NAME;


async function checkPatientExist(db, patient_check) {
  try {
    const {phone,practice_id} = patient_check;
    if (patient_id) {
      const qry_set_1 = await db(emr_db + ".emr_patient")
        .select("id")
        .where({
         phone:phone,
         customer_id:practice_id
         
        })
      if (qry_set_1.length > 0) {
        
        return qry_set_1[0].id;
      }
    }
    return null;
  } catch (error) {
    console.error('Error in checkPatientExist:', error);
    return error.message;
  }
}
async function checkappointmentAndTypeExist(db, data) {
 
  try {
    if (data) {
      const qry_set_1 = await db(emr_db + ".emr_appointment")
        .select("id", "appointment_type", "appointment_type_id", "provider_id", "trigger_event", "appointment_date", "appointment_date_time")
        .where({
          practice_id: data.practice_id,
          emr_practice_id: data.emr_practice_id,
          appointment_id: data.appointment_id,
        });
      if (qry_set_1.length > 0) {
        return qry_set_1[0];
      }
    }
    return { id: null };
  } catch (error) {
    console.error('Error in checkappointmentAndTypeExist:', error);
    return error.message;
  }
}
export default { checkPatientExist, checkappointmentAndTypeExist };