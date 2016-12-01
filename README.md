# redux-subscriber

[![Build Status](https://travis-ci.org/ivantsov/redux-subscriber.svg?branch=master)](https://travis-ci.org/ivantsov/redux-subscriber)
[![codecov](https://codecov.io/gh/ivantsov/redux-subscriber/branch/master/graph/badge.svg)](https://codecov.io/gh/ivantsov/redux-subscriber)
[![npm version](https://badge.fury.io/js/redux-subscriber.svg)](https://badge.fury.io/js/redux-subscriber)

This package allows you to subscribe to changes in any part of [Redux](https://github.com/reactjs/redux) state.

## Installation

`npm install redux-subscriber --save`

## Usage

```javascript
/*
 * store.js
 */
 
import {createStore} from 'redux';
import initSubscriber from 'redux-subscriber';

const store = createStore(...);
initSubscriber(store);

/*
 * somewhere-else.js
 */

import {subscribe} from 'redux-subscriber';

subscribe('user.messages.count', state => {
    // do something
});

```

## Examples

* https://github.com/ivantsov/yandex-mail-notifier-chrome - real app that uses `redux-subscriber`

## API

#### `initSubscriber(store)` (_default export_) - initialize `redux-subscriber`, so after that you can use `subscribe` method.

#### Options

- `store` - instance of Redux store.

#### `subscribe(key, callbackFunction)` - subscribe `callbackFunction` to changes.

#### Options

- `key` - string which specified the part of state (e.g. `user.message.count`) to listen to. 
- `callbackFunction` - function which will be called when the part of state has changed. New state is passed as a parameter.

Returns `unsubscribe` function which can be called to unsubscribe from changes.
