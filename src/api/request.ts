import { useAuthorizationStore } from '@/store/authorisation'
import { CommonResponse } from '@/type.d/request.wrapper';
import axios from 'axios';

export const instance = axios.create({
  baseURL: '/api',
  timeout: 30000,
});

instance.interceptors.request.use(
  (config: any) => {
    /* const token = useAuthorizationStore.getState().authorisation;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } */
    config.headers.Authorization = `Bearer ${import.meta.env.VITE_PERSONAL_AUTH_TOKEN}`;
    return config;
  },
  function (error: any) {
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  (response: any) => {
    return response.data;
  },
  (error: any) => {
    console.log(error);

    if (error.response?.status) {
      switch (error.response.status) {
        case 302: {
          console.log('重定向', error.response);
          const location = error.response.headers.location;
          console.log('Location:', location);
          return Promise.resolve({ location });
        }
        default: {
          console.log(
            '[Request]请求正常返回，但是出现未知错误',
            error.response
          );
        }
      }
    } else {
      console.log(
        '[Request]请求失败，未知错误',
        error.response?.data?.toString() || error.message || '',
      );
      return Promise.reject({
        code: 500000,
        message:
          error.response?.data?.toString() || error.message || 'unsorted error',
      });
    }
    return Promise.reject(error.response.data);
  },
);

export function get<T>(
  url: string,
  params: any = null
): Promise<CommonResponse<T>> {
  return instance.get(url, {
    params,
  });
}

/**
 * post请求
 * @param {string} url     请求地址
 * @param {*} data    数据
 */
export function post<T>(url: string, data = {}): Promise<CommonResponse<T>> {
  return instance.post(url, data);
}

/**
 * put请求
 * @param {string} url     请求地址
 * @param {*} data    数据
 */
export function put<T>(url: string, data = {}): Promise<CommonResponse<T>> {
  return instance.put(url, data);
}

/**
 * patch请求
 * @param {string} url     请求地址
 * @param {*} data    数据
 */
export function patch<T>(url: string, data = {}): Promise<CommonResponse<T>> {
  return instance.patch(url, data);
}

/**
 * delete请求
 * @param {string} url     请求地址
 * @param {*} data    数据
 */
export function del<T>(url: string, data = {}): Promise<CommonResponse<T>> {
  return instance.delete(url, { data });
}

export function form<T>(
  url: string,
  data: FormData,
): Promise<CommonResponse<T>> {
  return instance.post(url, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export function bob(url: string): Promise<any> {
  return instance.get(url, {
    method: 'GET',
    responseType: 'blob',
    timeout: 30000
  });
}
