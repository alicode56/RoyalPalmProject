// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://192.168.1.25:3000/api",
// });

// export default api;



// import axios from "axios";
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const api = axios.create({
//   baseURL: "http://192.168.1.25:3000/api",
// });

// // Har request se pehle ye function chalega aur token add karega
// api.interceptors.request.use(
//   async (config) => {
//     const token = await AsyncStorage.getItem('userToken');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`; // Header mein token lag gaya
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// export default api;



import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({ 
  baseURL: "http://192.168.1.20:3000/api", 
});

// This function will run before every request and add the token to the header
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken'); // Storage se token nikala
    if (token) {
      // Header mein 'Authorization' add kiya (Jaise Postman ke Auth tab mein hota hai) 
      config.headers.Authorization = `Bearer ${token}`; 
    }
    return config;  

  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;