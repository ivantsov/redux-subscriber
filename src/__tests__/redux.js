const actionTypes = {
  KEY_1: 'KEY_1',
  KEY_2: 'KEY_2',
};

const defaultState = {
  key1: {
    key11: 'key11',
    key12: 'key12',
  },
  key2: {
    key21: 'key21',
    key22: 'key22',
  },
};

export function reducer(state = defaultState, action) {
  switch (action.type) {
    case actionTypes.KEY_1:
      return {
        ...state,
        key1: action.data,
      };
    case actionTypes.KEY_2:
      return {
        ...state,
        key2: action.data,
      };
    default:
      return state;
  }
}

export const actions = {
  key1(data) {
    return {type: actionTypes.KEY_1, data};
  },
  key2(data) {
    return {type: actionTypes.KEY_2, data};
  },
};
