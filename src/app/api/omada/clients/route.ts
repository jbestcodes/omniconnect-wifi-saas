import { NextResponse } from 'next/server';
import axios from 'axios';

const OMADA_URL = process.env.OMADA_CONTROLLER_URL;
const OMADA_USER = process.env.OMADA_USERNAME;
const OMADA_PASS = process.env.OMADA_PASSWORD;
const SITE_ID = process.env.OMADA_SITE_ID;

async function getOmadaToken() {
  try {
    const loginResponse = await axios.post(`${OMADA_URL}/api/v2/login`, {
      username: OMADA_USER,
      password: OMADA_PASS,
    });

    return {
      token: loginResponse.data.result.token,
      cookies: loginResponse.headers['set-cookie'],
    };
  } catch (error) {
    console.error('Omada login failed:', error);
    throw error;
  }
}

export async function GET() {
  try {
    const { token, cookies } = await getOmadaToken();

    // Get current clients
    const clientsResponse = await axios.get(
      `${OMADA_URL}/api/v2/sites/${SITE_ID}/clients`,
      {
        headers: {
          'Token': token,
          'Cookie': cookies,
        },
      }
    );

    // Get traffic statistics
    const trafficResponse = await axios.get(
      `${OMADA_URL}/api/v2/sites/${SITE_ID}/clients/traffic`,
      {
        headers: {
          'Token': token,
          'Cookie': cookies,
        },
      }
    );

    const clients = clientsResponse.data.result || [];
    const traffic = trafficResponse.data.result || [];

    // Merge client data with traffic data
    const clientsWithTraffic = clients.map((client: any) => {
      const clientTraffic = traffic.find((t: any) => t.mac === client.mac) || {};
      return {
        mac: client.mac,
        ip: client.ip,
        name: client.name || 'Unknown',
        status: client.status,
        connect_time: client.connectTime,
        traffic: {
          download: (clientTraffic.download || 0) / (1024 * 1024 * 1024), // Convert to GB
          upload: (clientTraffic.upload || 0) / (1024 * 1024 * 1024), // Convert to GB
          total: ((clientTraffic.download || 0) + (clientTraffic.upload || 0)) / (1024 * 1024 * 1024), // Convert to GB
        }
      };
    });

    // Calculate totals
    const activeUsers = clients.filter((client: any) => client.status === 'online').length;
    const totalDataUsage = clientsWithTraffic.reduce((sum: number, client: any) => sum + client.traffic.total, 0);

    return NextResponse.json({
      success: true,
      data: {
        activeUsers,
        totalDataUsage: Number(totalDataUsage.toFixed(2)),
        clients: clientsWithTraffic,
        totalConnections: clients.length
      }
    });
  } catch (error: any) {
    console.error('Failed to fetch Omada data:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to fetch Omada data' 
    }, { status: 500 });
  }
}
