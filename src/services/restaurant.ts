import axios from "axios";

export async function getRestaurants() {
    const response = await axios.get("https://staging.fastor.ai/v1/m/restaurant?city_id=115", {
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`
        }
    });

    return response.data.data.results;
}