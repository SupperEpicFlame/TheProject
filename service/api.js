import axios from "axios";

// const API_URL = "http://192.168.11.157:5000/api"; 
const API_URL = "https://ninja.neuatech.com/api"; // Production URL

export const GetU = async () => {
    const response = await axios.get(`${API_URL}/U`);
    return response.data;
}
export const GetUById = async (id) => {
    const response = await axios.get(`${API_URL}/U/${id}`);
    return response.data;
}
export const addReview = async (U_id, user, comment, rating) => {
    const response = await axios.post(`${API_URL}/R`, { U_id, user, comment, rating });
    console.log(response.data);
    return response.data;
}
export const GetReviewById = async (id) => {
    const response = await axios.get(`${API_URL}/R/${id}`);
    return response.data;
}
export const editReview = async (id, user, comment, rating) => {
    console.log(`Editing review for ID: ${id}, User: ${user}, Comment: ${comment}, Rating: ${rating}`);
    
    const response = await axios.get(`${API_URL}/R/E/${id}`, { user, comment, rating });
    return response.data;
}
export const deleteReview = async (id) => {
    const response = await axios.delete(`${API_URL}/R/D/${id}`);
    return response.data;
}