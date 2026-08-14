import axiosClient from "../api/axiosClient";
import { ENDPOINTS } from "../api/endpoints";

export const getAll = () =>
    axiosClient.get(ENDPOINTS.PRODUCTS);

export const getById = (id) =>
    axiosClient.get(`${ENDPOINTS.PRODUCTS}/${id}`);

export const create = (client) =>
    axiosClient.post(ENDPOINTS.PRODUCTS, client);

export const update = (id, client) =>
    axiosClient.put(`${ENDPOINTS.PRODUCTS}/${id}`, client);

export const remove = (id) =>
    axiosClient.delete(`${ENDPOINTS.PRODUCTS}/${id}`);