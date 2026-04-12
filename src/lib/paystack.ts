import axios from 'axios';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

export interface PaystackSubaccount {
  id: string;
  business_name: string;
  description: string;
  primary_contact_name: string;
  primary_contact_email: string;
  primary_contact_phone: string;
  settlement_bank: {
    name: string;
    slug: string;
    type: string;
  };
  account_number: string;
  percentage_charge: number;
  settlement_schedule: string;
  active: boolean;
  subaccount_code: string;
}

export async function createSubaccount(subaccountData: Partial<PaystackSubaccount>) {
  try {
    const response = await axios.post(
      `${PAYSTACK_BASE_URL}/subaccount`,
      subaccountData,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('Error creating Paystack subaccount:', error.response?.data || error.message);
    throw error;
  }
}

export async function getSubaccounts() {
  try {
    const response = await axios.get(
      `${PAYSTACK_BASE_URL}/subaccount`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('Error fetching Paystack subaccounts:', error.response?.data || error.message);
    throw error;
  }
}

export async function updateSubaccount(subaccountCode: string, updateData: Partial<PaystackSubaccount>) {
  try {
    const response = await axios.put(
      `${PAYSTACK_BASE_URL}/subaccount/${subaccountCode}`,
      updateData,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('Error updating Paystack subaccount:', error.response?.data || error.message);
    throw error;
  }
}

export function initializeTransactionWithSubamount(
  email: string,
  amount: number,
  subaccountCode?: string,
  metadata?: any
) {
  const transactionData: any = {
    email,
    amount: amount * 100, // Convert to kobo
    metadata: metadata || {},
  };

  if (subaccountCode) {
    transactionData.subaccount = subaccountCode;
  }

  return transactionData;
}
