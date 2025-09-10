import axios from "axios";

export const http = axios.create({
    baseURL: "https://todo-list-service.duckdns.org/api"
})
