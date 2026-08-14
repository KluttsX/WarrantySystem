import axiosClient from "../api/axiosClient";
import { ENDPOINTS } from "../api/endpoints";

export const getAll = () => axiosClient.get(ENDPOINTS.CLIENTS);

export const getById = (id) => axiosClient.get(`${ENDPOINTS.CLIENTS}/${id}`);

export const create = (client) => axiosClient.post(ENDPOINTS.CLIENTS, client);

export const update = (id, client) =>
  axiosClient.put(`${ENDPOINTS.CLIENTS}/${id}`, client);

export const remove = (id) =>
  axiosClient.delete(`${ENDPOINTS.CLIENTS}/${id}`);
