import axios from 'axios';
import { POST_ITEM_LISTING, GET_ITEMS_BY_ARRIVAL, GET_ITEMS_BY_TYPE } from './types';
import { ITEM_SERVER } from '../utils/misc';


export function listNewItem(dataToSubmit){
    const request = axios.post(`${ITEM_SERVER}`,dataToSubmit)
    .then(response => response.data);

    return {
        type: POST_ITEM_LISTING,
        payload: request
    }
}