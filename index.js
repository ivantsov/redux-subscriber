import {get} from 'object-path';

const subscribers = new Map();
const getSelectors = new Map();

function createGetSelector(key) {
    // ensure the key returns the same selector everytime
    if (!getSelectors.has(key)) {
        getSelectors.set(key, (state) => get(state, key));
    }

    return getSelectors.get(key);
}

export function subscribe(selector, cb) {
    let subscriberKey;
    switch (typeof selector) {
    case 'string':
        subscriberKey = createGetSelector(selector);
        break;
    case 'function':
        subscriberKey = selector;
        break;
    default:
        throw new Error(`Expected string or function but got ${typeof selector}`);
    }

    if (subscribers.has(subscriberKey)) {
        subscribers.get(subscriberKey).add(cb);
    }
    else {
        subscribers.set(subscriberKey, new Set([cb]));
    }

  // return "unsubscribe" function
    return function () {
        const callbackSet = subscribers.get(subscriberKey);

        callbackSet.delete(cb);

        if (callbackSet.size === 0) {
            subscribers.delete(subscriberKey);

            if (typeof selector === 'string') {
                getSelectors.delete(selector);
            }
        }
    };
}

export default function (store) {
    let prevState = store.getState();

    store.subscribe(() => {
        const newState = store.getState();

        subscribers.forEach((callbacks, selector) => {
            if (selector(prevState) !== selector(newState)) {
                callbacks.forEach(cb => cb(newState));
            }
        });

        prevState = newState;
    });

    return subscribe;
}
