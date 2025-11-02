import axios from "axios";

export async function registerUser(data: { dial_code: string, phone: string }) {
    const response = await axios.post("https://staging.fastor.ai/v1/pwa/user/register", data);
    return response.data;
}

export async function loginUser(data: { dial_code: string, phone: string, otp: string }) {
    const response = await axios.post("https://staging.fastor.ai/v1/pwa/user/login", data);
    return response.data;
}