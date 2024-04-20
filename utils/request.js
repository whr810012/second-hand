import { login } from "../utils/api";
import { removeStorage } from "./localstorage";

const BASE_URL = "http://localhost:3000";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const request = (url, data, method = "GET") => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: BASE_URL + url,
      data,
      timeout: 100000,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      method: method,
      success: (res) => {
        if (res.statusCode !== 200) {
          reject(res);
        }
        if (res.data.code === 401) {
          removeStorage("userid");
          login().then(() => {
            request(url, data, method).then((res) => {
              resolve(res);
            });
          });
        } else {
          resolve(res.data);
        }
      },
      fail: (err) => {
        reject(err);
      },
      complete: () => {},
    });
  });
};
