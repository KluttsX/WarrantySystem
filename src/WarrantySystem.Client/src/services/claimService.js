import axiosClient from "../api/axiosClient";
import { ENDPOINTS } from "../api/endpoints";

export const getAll = () =>
    axiosClient.get(ENDPOINTS.CLAIMS);

export const getById = (id) =>
    axiosClient.get(`${ENDPOINTS.CLAIMS}/${id}`);

export const create = (client) =>
    axiosClient.post(ENDPOINTS.CLAIMS, client);

export const update = (id, client) =>
    axiosClient.put(`${ENDPOINTS.CLAIMS}/${id}`, client);

export const remove = (id) =>
    axiosClient.delete(`${ENDPOINTS.CLAIMS}/${id}`);