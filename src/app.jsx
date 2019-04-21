import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import _ from 'lodash';
import Cookies from 'js-cookie';
import faker from 'faker';
import uuidv4 from 'uuid/v4';
import io from 'socket.io-client';

import App from './components/App';
import LanguageLoadingModal from './components/LanguageLoadingModal';
import reducers from './reducers';
import CurrentUserContext from './components/CurrentUserContext';
import initSocketClient from './socket-client';
import '../lib/i18next';
import getLogger from '../lib/logger';

const EXPIRES_DAYS_FOR_USER_COOKIE = 36500;

const initializationLogger = getLogger('initialization');

export const getUser = () => {
  const user = Cookies.getJSON('user');

  if (user) {
    initializationLogger('Current user has been reading from cookies: %O', user);
    return user;
  }

  const newUser = {
    username: faker.internet.userName(),
    id: uuidv4(),
  };
  Cookies.set('user', newUser, { expires: EXPIRES_DAYS_FOR_USER_COOKIE });
  initializationLogger('Current user has been created and saved to cookies: %O', user);

  return newUser;
};

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
  initializationLogger("Application's initialization has been started...");

  /* eslint-disable no-underscore-dangle */
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  /* eslint-enable no-underscore-dangle */

  initializationLogger('Getting a current user...');
  const currentUser = getUser();

  initializationLogger("Initializing application's store...");
  const initState = getInitState(gon);
  const store = createStore(
    reducers,
    initState,
    composeEnhancers(
      applyMiddleware(thunk),
    ),
  );

  initializationLogger('Connecting to a socket-server for a real-time pushing data...');
  initSocketClient(io, store.dispatch, currentUser, getLogger('socket-client'));

  initializationLogger('Mounting the application to DOM...');
  ReactDOM.render(
    <Provider store={store}>
      <CurrentUserContext.Provider value={currentUser}>
        <Suspense fallback={<LanguageLoadingModal />}>
          <App />
        </Suspense>
      </CurrentUserContext.Provider>
    </Provider>,
    document.getElementById('chat'),
  );

  initializationLogger('Application has been started and mounted.');
};
