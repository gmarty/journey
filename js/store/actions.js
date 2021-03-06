import journeyData from '../api';
import LocationObserver from '../api/locationObserver';

import {
  EMPTY,
  FETCHED,
  ERRORED,
} from './constants';

export const watchLocation = () => {
  return (dispatch) => {
    dispatch(locationAcquiring);
    /* eslint-disable no-unused-vars */
    let watch = new LocationObserver((geo) => {
      dispatch(locationAcquired(geo));
    }, () => {
      dispatch(locationErrored);
    });
  };
};

export const locationAcquiring = () => {
  return {
    type: 'LOCATION_ACQUIRING',
  };
};

export const locationAcquired = (value) => {
  return {
    type: 'LOCATION_ACQUIRED',
    value,
  };
};

export const locationErrored = () => {
  return {
    type: 'LOCATION_ERRORED',
  };
};

export const dummyAction = (content) => {
  return {
    type: 'DUMMY_ACTION',
    content,
  };
};

/**
 * Fetch all items from the API.
 *
 * @return {[type]} [description]
 */
export const fetchItemsIfNeeded = () => {
  return (dispatch, getState) => {
    if (!shouldFetchItems(getState())) return Promise.resolve();

    dispatch(itemsFetching());

    return journeyData.getNewestStories()
      .then((items) => {
        dispatch(itemsFetched(items));
      })

      .catch((e) => {
        dispatch(itemsFetchErrored(e));
      });
  };
};

export const itemsFetching = () => {
  return {
    type: 'ITEMS_FETCHING',
  };
};

export const itemsFetched = (value) => {
  return {
    type: 'ITEMS_FETCHED',
    value,
  };
};

export const itemsFetchErrored = (value) => {
  return {
    type: 'ITEMS_FETCH_ERRORED',
    value,
  };
};

export const fetchItemIfNeeded = (id) => {
  return (dispatch, getState) => {
    if (!shouldFetchItem(getState(), id)) return Promise.resolve();

    dispatch(itemFetching(id));

    return journeyData.getStory({ id })
      .then((value) => {
        dispatch(itemFetched(id, value));
      })

      .catch((e) => {
        dispatch(itemFetchErrored(id, e));
      });
  };
};

export const itemFetching = (id) => {
  return {
    type: 'ITEM_FETCHING',
    id,
  };
};

export const itemFetched = (id, value) => {
  return {
    type: 'ITEM_FETCHED',
    value,
    id,
  };
};

export const itemFetchErrored = (id, value) => {
  return {
    type: 'ITEM_FETCH_ERRORED',
    value,
    id,
  };
};

/**
 * Items should only be fetched if:
 *  - empty
 *  - fetched
 *  - previous fetch errored
 *
 * @param  {Object} items
 * @return {Boolean}
 */
function shouldFetchItems({ items }) {
  switch (items.status) {
    case EMPTY:
    case FETCHED:
    case ERRORED:
      return true;
    default:
      return false;
  }
}

/**
 * Item should only be fetched if:
 *  - item is not in the cache
 *  - previous fetch errored
 *
 * TODO: We should probably also fetch when
 * a fetched item is considered 'stale'.
 * Let's keep an eye on this and see if
 * the use-case arises.
 *
 * @param  {Object} items
 * @return {Boolean}
 */
function shouldFetchItem({ itemsCache }, id) {
  const item = itemsCache[id];
  if (!item) return true;

  switch (item.status) {
    case ERRORED:
      return true;
    default:
      return false;
  }
}
