import axios from 'axios';
import { POST_ITEM_LISTING, GET_ITEMS_BY_ARRIVAL, GET_ITEMS_BY_TYPE, GET_HOUSEWARES, GET_FURNITURE } from './types';
import { ITEM_SERVER } from '../utils/misc';


export function listNewItem(dataToSubmit){
    const request = axios.post(`${ITEM_SERVER}`,dataToSubmit)
    .then(response => response.data);

    return {
        type: POST_ITEM_LISTING,
        payload: request
    }
}

export function getHousewares(dataToSubmit){
    const request = axios.post(`${ITEM_SERVER}/housewares`, dataToSubmit)
    .then(response => response.data);

    return {
        type: GET_HOUSEWARES,
        payload: request
    }
}

export function getFurniture(dataToSubmit){
    const request = axios.post(`${ITEM_SERVER}/furniture`, dataToSubmit)
    .then(response => response.data)

    return {
        type: GET_FURNITURE,
        payload: request
    }
}