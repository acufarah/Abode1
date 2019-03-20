import {GET_ITEMS_BY_TYPE, GET_ITEMS_BY_ARRIVAL, POST_ITEM_LISTING} from '../actions/types';

export default function(state={}, action){
    switch(action.type){
        case POST_ITEM_LISTING:
            return{...state, registerSuccess: action.payload}

        case GET_ITEMS_BY_TYPE:
            return{...state, bySell: action.payload}

        case GET_ITEMS_BY_ARRIVAL:
            return{...state, byArrival: action.payload}
        default:
            return state;
    }
}