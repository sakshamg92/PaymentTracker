//services/customerService.js

import axios from 'axios';
// const BASE_API_URL = 'http://10.0.2.2:5000/api/customers/'; // Change the URL here based on your requirement
const BASE_API_URL =
  'https://resourcemanagement-backend.onrender.com/api/customers';

export const addCustomer = async customerData => {
  try {
    const response = await axios.post(`${BASE_API_URL}/add`, customerData);
    return response.data;
  } catch (error) {
    console.error(
      'Error adding customer:',
      error?.response?.data || error.message,
    );
    throw new Error(error?.response?.data?.message || 'Failed to add customer');
  }
};

export const getAllCustomers = async () => {
  try {
    const response = await axios.get(BASE_API_URL);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to fetch customers',
    );
  }
};

export const updateCustomer = async (customerId, updatedData) => {
  try {
    const response = await axios.put(
      `${BASE_API_URL}/${customerId}`,
      updatedData,
    );
    return response.data;
  } catch (error) {
    console.error(
      'Error updating customer:',
      error.response?.data || error.message,
    );
    throw error.response?.data || error.message;
  }
};

export const deleteCustomer = async customerId => {
  try {
    const response = await axios.delete(`${BASE_API_URL}/${customerId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// dashboardscreen // mark as paid
export const updatePaymentStatus = async id => {
  try {
    const response = await axios.put(`${BASE_API_URL}/${id}/updateStatus`, {
      paymentStatus: 'Paid',
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
