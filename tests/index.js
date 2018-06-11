import {get} from 'object-path';
import initSubscriber, {subscribe} from '../index';

function createStore() {
    let state = {
        key1: {
            key11: 'key11',
            key12: 'key12'
        },
        key2: {
            key21: 'key21',
            key22: 'key22'
        }
    };
    let subscribeCallback;

    return {
        subscribe(cb) {
            subscribeCallback = cb;
        },
        getState() {
            return state;
        },
        setState(newState) {
            state = Object.assign({}, state, newState);
        },
        callSubscribeCallback() {
            subscribeCallback();
        }
    };
}

describe('redux-subscriber', () => {
    describe('subscribe', () => {
        function testCase(subscribersKeys) {
            const store = createStore();
            initSubscriber(store);

            const callbacks = subscribersKeys.map(key => {
                const callback = jest.fn();

                // test strings...
                subscribe(key, callback);
                // ...and selectors
                subscribe((state) => get(state, key), callback);

                return callback;
            });

            return {store, callbacks};
        }

        it('nothing has changed', () => {
            const {store, callbacks} = testCase(['key1.key11', 'key1.key11']);

            store.callSubscribeCallback();

            callbacks.forEach(cb => expect(cb).not.toHaveBeenCalled());
        });

        it('another part of state has changed', () => {
            const {store, callbacks} = testCase(['key1.key11', 'key1.key11']);

            store.setState({
                key2: {
                    key21: 'newValue',
                    key22: 'newValue'
                }
            });
            store.callSubscribeCallback();

            callbacks.forEach(cb => expect(cb).not.toHaveBeenCalled());
        });

        it('high level part of state', () => {
            const {store, callbacks} = testCase(['key1', 'key1']);

            store.setState({
                key1: 'somethingNew'
            });
            const newState = store.getState();
            store.callSubscribeCallback();

            callbacks.forEach(cb => expect(cb).lastCalledWith(newState));
        });

        it('deep level part of state', () => {
            const {store, callbacks} = testCase(['key1.key11', 'key1.key11']);

            store.setState({
                key1: {
                    key11: 'newValue',
                    key12: 'key12'
                }
            });
            const newState = store.getState();
            store.callSubscribeCallback();

            callbacks.forEach(cb => expect(cb).lastCalledWith(newState));
        });

        it('change state structure', () => {
            const {store, callbacks} = testCase(['key1.key11', 'key1.key11']);

            store.setState({key1: 'newValue'});
            const newState = store.getState();
            store.callSubscribeCallback();

            callbacks.forEach(cb => expect(cb).lastCalledWith(newState));
        });

        it('different keys, only 2 have changed', () => {
            const {store, callbacks} = testCase([
                'key1.key11',
                'key1.key11',
                'key2.key21'
            ]);

            store.setState({
                key1: {
                    key11: 'newValue',
                    key12: 'key12'
                }
            });
            const newState = store.getState();
            store.callSubscribeCallback();

            expect(callbacks[0]).lastCalledWith(newState);
            expect(callbacks[1]).lastCalledWith(newState);
            expect(callbacks[2]).not.toHaveBeenCalled();
        });

        it('different keys, all have changed', () => {
            const {store, callbacks} = testCase([
                'key1.key11',
                'key1.key11',
                'key2.key21'
            ]);

            store.setState({
                key1: {
                    key11: 'newValue'
                },
                key2: {
                    key21: 'newValue'
                }
            });
            const newState = store.getState();
            store.callSubscribeCallback();

            callbacks.forEach(cb => expect(cb).lastCalledWith(newState));
        });
    });

    describe('unsubscribe', () => {
        function testCase() {
            const key = 'key1.key11';
            const store = createStore();
            initSubscriber(store);

            const callbacks = [jest.fn(), jest.fn()];
            const unsubscribers = callbacks.map(cb => subscribe(key, cb));

            store.setState({
                key1: {
                    key11: 'newNewValue'
                }
            });

            return {
                store,
                callbacks,
                unsubscribers
            };
        }

        it('2 subscribers, 1 unsubscribe', () => {
            const {store, callbacks, unsubscribers} = testCase();
            const newState = store.getState();

            unsubscribers[0]();
            store.callSubscribeCallback();

            expect(callbacks[0]).not.toHaveBeenCalled();
            expect(callbacks[1]).lastCalledWith(newState);
        });

        it('2 subscribers, 2 unsubscribe', () => {
            const {store, callbacks, unsubscribers} = testCase();

            unsubscribers.forEach(fn => fn());
            store.callSubscribeCallback();

            callbacks.forEach(cb => expect(cb).not.toHaveBeenCalled());
        });
    });
});
