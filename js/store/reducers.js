import {
  EMPTY,
  FETCHING,
  FETCHED,
  LOCATION_ACQUIRING,
  LOCATION_ERRORED,
  LOCATION_ACQUIRED,
} from './constants';

const initialState = {

  // list of `itemId`s that are used to
  // render the items on the Home scene
  items: {
    status: EMPTY,
    timestamp: null,
    value: null,
  },
  location: {
    status: EMPTY,
    value: null,
  },
  // dictionary that stores the canonical item data
  itemsCache: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'ITEMS_FETCHING': return itemsFetching(state, action);
    case 'ITEMS_FETCHED': return itemsFetched(state, action);
    case 'ITEM_FETCHING': return itemFetching(state, action);
    case 'ITEM_FETCHED': return itemFetched(state, action);
    case 'LOCATION_ACQUIRING': return locationAcquiring(state, action);
    case 'LOCATION_ACQUIRED': return locationAcquired(state, action);
    case 'LOCATION_ERRORED': return locationErrored(state, action);
    default: return state;
  }
};

function itemsFetching(state) {
  return {
    ...state,
    items: {
      status: FETCHING,
      timestamp: Date.now(),
      value: null,
    },
  };
}

function itemsFetched(state, { value }) {
  var ids = [];
  const toCache = value.reduce((result, item) => {
    result[item.id] = createItem(FETCHED, item);
    ids.push(item.id);
    return result;
  }, {});

  return {
    ...state,

    // completely replace the nearby items list
    items: {
      status: FETCHED,
      timestamp: Date.now(),
      value: ids,
    },

    // add new items to the itemsCache
    itemsCache: {
      ...state.itemsCache,
      ...toCache,
      value,
    },
  };
}

function itemFetching(state, { id }) {
  return {
    ...state,
    itemsCache: {
      ...state.itemsCache,
      [id]: createItem(FETCHING, null),
    },
  };
}

function itemFetched(state, { id, value }) {
  return {
    ...state,
    itemsCache: {
      ...state.itemsCache,
      [id]: createItem(FETCHED, value),
    },
  };
}

function createItem(status, value) {
  return {
    status,
    timestamp: Date.now(),
    value,
  };
}

function locationAcquiring(state) {
  return {
    ... state,
    location: {
      status: LOCATION_ACQUIRING,
      value: null,
    },
  };
}

function locationAcquired(state, { value }) {
  return {
    ... state,
    location: {
      status: LOCATION_ACQUIRED,
      value,
    },
  };
}

function locationErrored(state) {
  return {
    ... state,
    location: {
      status: LOCATION_ERRORED,
      value: null,
    },
  };
}

