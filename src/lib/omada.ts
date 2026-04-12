
import axios from 'axios';

const OMADA_URL = process.env.OMADA_CONTROLLER_URL;
const OMADA_USER = process.env.OMADA_USERNAME;
const OMADA_PASS = process.env.OMADA_PASSWORD;
const SITE_ID = process.env.OMADA_SITE_ID;

export async function authorizeUser(mac: string, durationMinutes: number) {
  try {
    const loginResponse = await axios.post(`${OMADA_URL}/api/v2/login`, {
      username: OMADA_USER,
      password: OMADA_PASS,
    });

    const token = loginResponse.data.result.token;
    const cookies = loginResponse.headers['set-cookie'];

    const authResponse = await axios.post(
      `${OMADA_URL}/api/v2/sites/${SITE_ID}/clients/${mac}/authorize`,
      {
        duration: durationMinutes,
      },
      {
        headers: {
          'Token': token,
          'Cookie': cookies,
        },
      }
    );

    return authResponse.data;
  } catch (error) {
    console.error('Omada Auth Error:', error);
    throw error;
  }
}
