import React, { Suspense } from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import {
  render,
  wait,
  fireEvent,
  waitForElement,
  cleanup,
} from 'react-testing-library';
import nock from 'nock';
import path from 'path';
import fs from 'fs';

import '../lib/i18next';
import getLogger from '../lib/logger';
import App from '../src/components/App';
import LanguageLoadingModal from '../src/components/LanguageLoadingModal';
import reducers from '../src/reducers';
import { getInitState } from '../src/app';
import { getNextId } from '../server/routes';
import CurrentUserContext from '../src/components/CurrentUserContext';
import routes from '../src/routes';
import initSocketClient from '../src/socket-client';
import SocketIOMockServer from './__fixtures__/SocketIOMockServer';

let asFragment;
let getByText;
let getByLabelText;
let getByDisplayValue;

let generalChannelId;

let store;

const user1 = { id: '2ad4e', username: 'Funny_User' };
const user2 = { id: '3be5f', username: 'Sad_User' };

const host = 'http://localhost';

const timeout = delayMs => new Promise((resolve) => {
  setTimeout(resolve, delayMs);
});

beforeAll(() => {
  nock.disableNetConnect();

  generalChannelId = getNextId();
  const initialData = {
    channels: [
      { id: generalChannelId, name: 'general', removable: false },
      { id: getNextId(), name: 'random', removable: false },
      { id: getNextId(), name: 'my-channel', removable: true },
    ],
    messages: [
      {
        id: getNextId(),
        channelId: generalChannelId,
        text: 'Test1',
        author: user1,
      },
      {
        id: getNextId(),
        channelId: generalChannelId,
        text: 'Test2',
        author: user2,
      },
      {
        id: getNextId(),
        channelId: generalChannelId,
        text: 'Test3',
        author: user1,
      },
    ],
    currentChannelId: generalChannelId,
  };

  store = createStore(
    reducers,
    getInitState(initialData),
    applyMiddleware(thunk),
  );

  const vdom = (
    <Provider store={store}>
      <CurrentUserContext.Provider value={user1}>
        <Suspense fallback={<LanguageLoadingModal />}>
          <App />
        </Suspense>
      </CurrentUserContext.Provider>
    </Provider>
  );

  ({
    asFragment,
    getByText,
    getByLabelText,
    getByDisplayValue,
  } = render(vdom));
});

afterAll(cleanup);

test('Init state render', async () => {
  nock(host)
    .get(/\/locales\/en\/.+\.json/gi)
    .times(3)
    .reply(200, (uri, requestBody, cb) => {
      const { base } = path.parse(uri);
      fs.readFile(path.resolve(__dirname, '..', 'assets/locales/en', base), cb);
    });

  expect(asFragment()).toMatchSnapshot();

  await waitForElement(() => getByLabelText("Enter new message's text:"));
  expect(asFragment()).toMatchSnapshot();
});

test('Attemp to add a new message by the user', async () => {
  const idForNewMessage = getNextId();
  const textForNewMessage = "I'm here! Look at me!";

  nock(host)
    .post(routes.messagesForParticularChannel(generalChannelId))
    .delay(1000)
    .reply(201, {
      data: {
        type: 'messages',
        id: idForNewMessage,
        attributes: {
          id: idForNewMessage,
          author: user1,
          channelId: generalChannelId,
          text: textForNewMessage,
        },
      },
    })
    .post(routes.messagesForParticularChannel(generalChannelId))
    .delay(500)
    .replyWithError();

  const newMessageTextInput = getByLabelText("Enter new message's text:");
  fireEvent.change(newMessageTextInput, { target: { value: textForNewMessage } });
  await waitForElement(() => getByDisplayValue(textForNewMessage));
  expect(asFragment()).toMatchSnapshot();

  const newMessageFormSubmitButton = getByText('Send');
  fireEvent.click(newMessageFormSubmitButton);
  await waitForElement(() => getByText('Sending...'));
  expect(asFragment()).toMatchSnapshot();

  await waitForElement(() => getByText('Send'));
  expect(asFragment()).toMatchSnapshot();

  fireEvent.change(newMessageTextInput, { target: { value: textForNewMessage } });
  await waitForElement(() => getByDisplayValue(textForNewMessage));
  fireEvent.click(newMessageFormSubmitButton);
  await wait(() => getByText('An error occurred while sending the message. Try again later.'));
  expect(asFragment()).toMatchSnapshot();
});

test("Attemp to change a interface's language", async () => {
  nock(host)
    .get(/\/locales\/ru\/.+\.json/gi)
    .times(3)
    .reply(200, (uri, requestBody, cb) => {
      const { base } = path.parse(uri);
      fs.readFile(path.resolve(__dirname, '..', 'assets/locales/ru', base), cb);
    });

  const languageChangeToRussianButton = getByText('Russian');
  fireEvent.click(languageChangeToRussianButton);
  await waitForElement(() => getByText('Выберите язык:'));
  expect(asFragment()).toMatchSnapshot();

  const languageChangeToEnglishButton = getByText('Английский');
  fireEvent.click(languageChangeToEnglishButton);
  await waitForElement(() => getByText('Choose language:'));
  expect(asFragment()).toMatchSnapshot();
});

test('Check socket.IO real-time getting messages', async () => {
  const mockServer = new SocketIOMockServer();
  const socketIOMockClient = mockServer.getSocketIOClient();

  initSocketClient(socketIOMockClient, store.dispatch, user1, getLogger('socket-client'));

  const message = {
    id: getNextId(),
    channelId: generalChannelId,
    text: 'New message!',
    author: user2,
  };

  mockServer.emit('newMessage', { data: { type: 'messages', id: message.id, attributes: { ...message } } });
  await waitForElement(() => getByText('New message!'));
  expect(asFragment()).toMatchSnapshot();

  const message2 = {
    id: getNextId(),
    channelId: generalChannelId,
    text: 'More new message!',
    author: user1,
  };

  mockServer.emit('newMessage', { data: { type: 'messages', id: message2.id, attributes: { ...message2 } } });
  await timeout(1000);
  expect(asFragment()).toMatchSnapshot();
});
