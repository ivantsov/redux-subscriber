import {createStore} from 'redux';
import initSubscriber, {subscribe} from '../index';
import {reducer, actions} from './redux';

describe('redux-subscriber', () => {
  describe('subscribe', () => {
    function testCase(subscribersKeys) {
      const store = createStore(reducer);

      initSubscriber(store);
      const subscribers = subscribersKeys.map(key => {
        const subscriber = jest.fn();
        subscribe(key, subscriber);
        return subscriber;
      });

      return {store, subscribers};
    }

    it('state has not changed at all', () => {
      const {store, subscribers} = testCase(['key1.key11', 'key1.key11']);

      store.dispatch({type: 'FAKE_ACTION_TYPE'});

      subscribers.forEach(subscriber => expect(subscriber).not.toBeCalled());
    });

    it('not subscribed part of state has changed', () => {
      const {store, subscribers} = testCase(['key1.key11', 'key1.key11']);

      store.dispatch(
        actions.key2({
          key21: 'newValue',
          key22: 'newValue',
        }),
      );

      subscribers.forEach(subscriber => expect(subscriber).not.toBeCalled());
    });

    it('part of state has changed & only expected subscribers are called', () => {
      const {store, subscribers} = testCase([
        'key1.key11',
        'key1.key11',
        'key2.key21',
      ]);

      store.dispatch(actions.key1({key11: 'newValue'}));

      const newState = store.getState();
      expect(subscribers[0]).toBeCalledWith(newState);
      expect(subscribers[1]).toBeCalledWith(newState);
      expect(subscribers[2]).not.toBeCalled();
    });

    it('subscribed key does not exist after 1st dispatch', () => {
      const {store, subscribers} = testCase(['key1.key11', 'key1.key11']);

      store.dispatch(actions.key1('newValue1'));

      const newState = store.getState();
      subscribers.forEach(subscriber =>
        expect(subscriber).toBeCalledWith(newState),
      );

      store.dispatch(actions.key1('newValue2'));
      subscribers.forEach(subscriber => expect(subscriber).toBeCalledTimes(1));
    });

    it('dispatch action inside subscriber callback, which changes another part of state', () => {
      const store = createStore(reducer);
      let newState1;
      let newState2;

      initSubscriber(store);

      let toggle = true;
      const subscriber = jest.fn(() => {
        if (toggle) {
          toggle = !toggle;

          newState1 = store.getState();
          store.dispatch(actions.key2({key21: 'newValue'}));
        } else {
          newState2 = store.getState();
        }
      });

      subscribe('key1.key11', subscriber);

      store.dispatch(actions.key1({key11: 'newValue'}));

      expect(subscriber).toBeCalledTimes(2);
      expect(subscriber).nthCalledWith(1, newState1);
      expect(subscriber).nthCalledWith(2, newState2);
    });
  });

  describe('unsubscribe', () => {
    function testCase() {
      const store = createStore(reducer);

      initSubscriber(store);
      const subscribers = [jest.fn(), jest.fn()];
      const unsubscribers = subscribers.map(subscriber =>
        subscribe('key1.key11', subscriber),
      );

      return {
        store,
        subscribers,
        unsubscribers,
      };
    }

    it('2 subscribers & 1 unsubscribe', () => {
      const {store, subscribers, unsubscribers} = testCase();

      unsubscribers[0]();

      store.dispatch(actions.key1({key11: 'newNewValue'}));

      expect(subscribers[0]).not.toBeCalled();
      expect(subscribers[1]).toBeCalledWith(store.getState());
    });

    it('2 subscribers, 2 unsubscribe', () => {
      const {store, subscribers, unsubscribers} = testCase();

      unsubscribers.forEach(fn => fn());

      store.dispatch(actions.key1({key11: 'newNewValue'}));

      subscribers.forEach(subscriber => expect(subscriber).not.toBeCalled());
    });
  });
});
