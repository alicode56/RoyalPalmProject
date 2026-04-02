// import api from './axious';

// //get invoices 
// export const getInvoices = async ()=>{
//     return api.get('./invoices');

// }
// //post invoice
// export const createInvoice = (data) => {
//   return api.post('/invoices', data);
// };




import api from "./axious"; // your axios instance

// CREATE invoice (POST)
export const createVendorInvoice = async (data) => {
  try {
    const response = await api.post("/vendor-invoices", data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// GET all invoices
export const getVendorInvoices = async () => {
  try {
    const response = await api.get("/vendor-invoices");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};