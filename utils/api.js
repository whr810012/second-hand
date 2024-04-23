/* eslint-disable @typescript-eslint/no-explicit-any */
import { getStorage, setStorage } from "../utils/localstorage";
import { request } from "../utils/request";

export const login = (data) => {
  return request("/register", data, "POST");
};

export const getAllGoods = () => {
  return request("/getgoods",{});
};

export const addGoods = (data) => {
  return request("/addgoods", data, "POST");
};

export const getAllOverGoods = () => {
  return request("/getovergoods");
};

export const deleteGoods = (data) => {
  return request("/deletegoods", data, "POST");
};

export const deleteOverGoods = (data) => {
  return request("/deleteovergoods", data, "POST");
};

export const addOver = (data) => {
  return request("/addover", data, "POST");
};

export const getMyorder = (data) => {
  return request("/getover", data, "POST");
};
