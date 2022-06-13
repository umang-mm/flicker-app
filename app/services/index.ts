import axios from 'axios';
import { BASE_URL } from '../assets/contants';
import handleError from './utils/handle-error';

let cancelToken: any;

if (typeof cancelToken !== typeof undefined) {
  cancelToken.cancel('Canceling the previous req');
}
cancelToken = axios.CancelToken.source();

const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  cancelToken: cancelToken.token,
  timeout: 4000,
});

instance.interceptors.response.use(
  response => response,
  ({ message, response }) => {
    handleError({ response, message });
  },
);

export default instance;
