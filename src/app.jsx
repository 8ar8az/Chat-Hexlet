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
import LanguageLoadingModal from './components/modals/LoadingLanguageModal';
import reducers from './reducers';
import CurrentUserContext from './context';
import initializeSocketClient from './socket-client';
import '../lib/i18next';
import getLogger from '../lib/logger';

const expiresDaysForCookies = 36500;

const initializationLog = getLogger('initialization');

const getUser = () => {
  const user = Cookies.getJSON('user');

  if (user) {
    initializationLog('Current user has been reading from cookies: %O', user);
    return user;
  }

  const newUser = {
    username: faker.internet.userName(),
    id: uuidv4(),
  };
  Cookies.set('user', newUser, { expires: expiresDaysForCookies });
  initializationLog('Current user has been created and saved to cookies: %O', user);

  return newUser;
};

export const getInitState = ({ channels, messages, currentChannelId }) => {
  const normalizeEntitiesData = (entities) => {
    const allIds = _.map(entities, 'id');
    const byId = _.keyBy(entities, 'id');

    return { byId, allIds };
  };

  return {
    channels: { ...normalizeEntitiesData(channels), currentChannelId },
    messages: normalizeEntitiesData(messages),
  };
};

export const initializeStore = (initState) => {
  /* eslint-disable no-underscore-dangle */
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  /* eslint-enable no-underscore-dangle */

  const store = createStore(
    reducers,
    initState,
    composeEnhancers(
      applyMiddleware(thunk),
    ),
  );

  return store;
};

export const initializeApplication = (store, currentUser) => (
  <Provider store={store}>
    <CurrentUserContext.Provider value={currentUser}>
      <Suspense fallback={<LanguageLoadingModal />}>
        <App />
      </Suspense>
    </CurrentUserContext.Provider>
  </Provider>
);

export default (gon) => {
  initializationLog("Application's initialization has been started...");

  initializationLog('Getting a current user...');
  const currentUser = getUser();

  initializationLog("Initializing application's store...");
  const initState = getInitState(gon);
  const store = initializeStore(initState);

  initializationLog('Connecting to a socket-server for a real-time pushing data...');
  initializeSocketClient(io, store.dispatch, currentUser, getLogger('socket-client'));

  initializationLog('Mounting the application to DOM...');
  const application = initializeApplication(store, currentUser);
  ReactDOM.render(
    application,
    document.getElementById('chat'),
  );

  initializationLog('Application has been initialized and mounted.');
};
