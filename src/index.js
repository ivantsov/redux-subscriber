import { get } from 'object-path';
import isEqual from 'is-equal';

const subscribers = {};

export function subscribe(key, cb) {
  if (subscribers.hasOwnProperty(key)) {
    subscribers[key].push(cb);
  } else {
    subscribers[key] = [cb];
  }

  // return "unsubscribe" function
  return function () {
    subscribers[key] = subscribers[key].filter(s => s !== cb);
  };
}


export default function (store, opts = { deep: true }) {
  let prevState = store.getState();

  store.subscribe(() => {
    const newState = store.getState();

    Object.keys(subscribers).forEach(key => {
      let prevValue = get(prevState, key);
      let newValue = get(newState, key);

      if(  (opts.deep && isEqual(prevValue, newValue)) 
        || (prevValue == newValue) )
        return false;

      subscribers[key].forEach(cb => cb(newState));

    });

    prevState = newState;
  });

  return subscribe;
}
