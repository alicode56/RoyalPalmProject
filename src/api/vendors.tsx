// import api from '../services/axious';

// // GET vendors
// export const getVendors = () => {
//   return api.get("/vendors");
// };

// // POST vendor
// export const createVendor = (data) => {
//   return api.post("/vendors", data);
// };



import api from '../services/axious';

export const getVendors = async () => {
  try {
    const res = await api.get("/vendors");
    return res.data;
  } catch (err) {
    console.log("Fetch Error:", err.response?.status); // Agar ab 401 aaye toh token check karein
    throw err;
  }
};