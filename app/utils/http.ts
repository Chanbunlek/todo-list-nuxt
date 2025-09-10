import axios from "axios";

export const http = axios.create({
    baseURL: "http://ec2-13-114-37-227.ap-northeast-1.compute.amazonaws.com:8000/api/"
})
