import {get} from 'object-path';

const subscribers = {};

export function subscribe(key, cb) {
    if (subscribers.hasOwnProperty(key)) {
        subscribers[key].push(cb);
    }
    else {
        subscribers[key] = [cb];
    }

    // return "unsubscribe" function
    return function () {
        subscribers[key] = subscribers[key].filter(s => s !== cb);
    };
}

export default function (store) {
    let prevState = store.getState();

    store.subscribe(() => {
        const newState = store.getState();

        Object.keys(subscribers).forEach(key => {
            if (get(prevState, key) !== get(newState, key)) {
                subscribers[key].forEach(cb => cb(newState));
            }
        });

        prevState = newState;
    });

    return subscribe;
}
