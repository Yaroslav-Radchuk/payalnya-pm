import axios from 'axios'
import type { AxiosInstance, AxiosResponse } from 'axios'
import { installMockAdapter } from './mockAdapter'

const instance: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' },
})

installMockAdapter(instance)

instance.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.message ?? err.message ?? 'Network error'
    return Promise.reject(new Error(message))
  },
)

export const apiGet = <T>(url: string, params?: Record<string, unknown>): Promise<T> =>
  instance.get<T>(url, { params }).then((r: AxiosResponse<T>) => r.data)

export const apiPost = <T>(url: string, body: unknown): Promise<T> =>
  instance.post<T>(url, body).then((r: AxiosResponse<T>) => r.data)

export const apiPut = <T>(url: string, body: unknown): Promise<T> =>
  instance.put<T>(url, body).then((r: AxiosResponse<T>) => r.data)

export const apiDelete = (url: string): Promise<void> =>
  instance.delete(url).then(() => undefined)
