import axios from 'axios';
import Toast from '../Utils/Toast';
import 'react-toastify/dist/ReactToastify.css';
const api = axios.create({
    baseURL: `http://localhost:8080/api`,
});

export const booksPath = `/books/get-all-books`;
export const editBookPath = id => `/books/edit/${id}`;
export const addBookPath = `/books/add-book`;
export const deleteBookPath = id => `/books/delete/${id}`;
export const categoryPath = `/books/get-all-category`;

const processRequest = (method, endPoint, requestData) => {
    const headerConfig = {
        'Content-Type': 'application/json',
    }
    if (method === 'get') {
        return api.get(endPoint, headerConfig);
    } if (method === 'post') {
        return api.post(endPoint, requestData, headerConfig);
    } if (method === 'put') {
        return api.put(endPoint, requestData, headerConfig);
    } if (method === 'patch') {
        return api.patch(endPoint, requestData, headerConfig);
    } if (method === 'delete') {
        return api.delete(endPoint, headerConfig);
    }
    throw new Error('Invalid method passed');
};


export default {
    sendRequest(method, baseQuery, requestData = null) {
        return processRequest(method, baseQuery, requestData)
            .then((response) => {
                if (method !== 'get') {
                    Toast.show('Success');
                }
                return response;
            })
            .catch((error) => {
                if (method !== 'get') {
                    Toast.error('Sorry your request could not be processed');
                }
                throw error;
            });
    }
}