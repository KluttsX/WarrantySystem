import axiosClient from "../api/axiosClient";
import { ENDPOINTS } from "../api/endpoints";

export const getAll = () =>
    axiosClient.get(ENDPOINTS.WARRANTIES);

export const getById = (id) =>
    axiosClient.get(`${ENDPOINTS.WARRANTIES}/${id}`);

export const create = (client) =>
    axiosClient.post(ENDPOINTS.WARRANTIES, client);

export const update = (id, client) =>
    axiosClient.put(`${ENDPOINTS.WARRANTIES}/${id}`, client);

export const remove = (id) =>
    axiosClient.delete(`${ENDPOINTS.WARRANTIES}/${id}`);