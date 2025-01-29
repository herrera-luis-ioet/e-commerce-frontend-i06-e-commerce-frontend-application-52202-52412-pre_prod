// PUBLIC_INTERFACE
/**
 * Store configuration for managing product state
 */

const initialState = {
  products: [],
  loading: false,
  error: null,
};

// Action Types
export const ACTIONS = {
  FETCH_PRODUCTS_START: 'FETCH_PRODUCTS_START',
  FETCH_PRODUCTS_SUCCESS: 'FETCH_PRODUCTS_SUCCESS',
  FETCH_PRODUCTS_ERROR: 'FETCH_PRODUCTS_ERROR',
};

// Reducer
export const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.FETCH_PRODUCTS_START:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case ACTIONS.FETCH_PRODUCTS_SUCCESS:
      return {
        ...state,
        loading: false,
        products: action.payload,
      };
    case ACTIONS.FETCH_PRODUCTS_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default productReducer;