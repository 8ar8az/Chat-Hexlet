import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import _ from 'lodash';

import App from './components/App';
import reducers from './reducers';

export const getInitState = ({ channels, messages, currentChannelId }) => {
  const normalizeEntitiesData = (entities) => {
    const allIds = _.map(entities, 'id');
    const byId = _.reduce(entities, (acc, entity) => ({ ...acc, [entity.id]: entity }), {});

    return { byId, allIds };
  };

  return {
    channels: { ...normalizeEntitiesData(channels), currentChannelId },
    messages: normalizeEntitiesData(messages),
  };
};

export default (gon) => {
  /* eslint-disable no-underscore-dangle */
  const devTools = window !== 'undefined'
    && window.__REDUX_DEVTOOLS_EXTENSION__
    && window.__REDUX_DEVTOOLS_EXTENSION__();
  /* eslint-enable no-underscore-dangle */

  const initState = getInitState(gon);
  const store = createStore(
    reducers,
    initState,
    devTools,
  );

  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('chat'),
  );
};
