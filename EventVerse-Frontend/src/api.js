import axios from 'axios';

// 1. Axios ka ek central instance banaya 
// Ab humein har jagah lamba URL (http://localhost:3000/api...) likhne ki zaroorat nahi padegi
const API = axios.create({
    baseURL: 'http://localhost:3000/api',
});

// 2. Request Interceptor (Hamara Frontend Bouncer)
// Ye function kisi bhi API request ke server par jaane se theek pehle chalega
API.interceptors.request.use(
    (req) => {
        const token = localStorage.getItem('token');
        
        // Console log taaki hume F12 me dikhe ki kya bheja ja raha hai
        console.log("Bouncer ko ye token bhej rahe hain:", token); 
        
        // Check: Agar token hai aur wo 'undefined' naam ka text nahi hai, tabhi bhejo
        if (token && token !== 'undefined' && token !== 'null') {
            req.headers.Authorization = token;
        }
        
        return req;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Is API file ko export kar diya taaki baaki React components ise use kar sakein
export default API;