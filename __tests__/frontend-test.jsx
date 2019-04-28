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
import { getInitState, initializeStore, initializeApplication } from '../src/app';
import { getNextId } from '../server/routes';
import routes from '../src/routes';
import initializeSocketClient from '../src/socket-client';
import SocketIOMockServer from './__fixtures__/SocketIOMockServer';

jest.mock('popper.js', () => {
  const PopperJS = jest.requireActual('popper.js');

  return class {
    static placements = PopperJS.placements;

    constructor() {
      /* eslint-disable lodash/prefer-noop */
      this.destroy = () => {};
      this.scheduleUpdate = () => {};
      /* eslint-enable lodash/prefer-noop */
    }
  };
});

const generalChannelId = getNextId();
const generalChannelName = 'general';
const user1 = { id: getNextId(), username: 'Funny_User' };
const user2 = { id: getNextId(), username: 'Sad_User' };

const idForNewChannel = getNextId();
const newChannelName = 'abc-channel';
const nameForChannelUpdating = 'new-channel';

const myChannelName = 'my-channel';
const idForMyChannel = getNextId();

const textForNewMessage = "I'm here! Look at me!";

const host = 'http://localhost';
const errorMessage = 'something is wrong';

const mockGon = {
  channels: [
    { id: generalChannelId, name: generalChannelName, removable: false },
    { id: getNextId(), name: 'random', removable: false },
    { id: idForMyChannel, name: myChannelName, removable: true },
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


const timeout = delayMs => new Promise((resolve) => {
  setTimeout(resolve, delayMs);
});

let asFragment;
let getByText;
let getByLabelText;
let getByDisplayValue;
let container;
let getByPlaceholderText;

let store;

beforeAll(() => {
  nock.disableNetConnect();

  const initState = getInitState(mockGon);
  store = initializeStore(initState);
  const application = initializeApplication(store, user1);

  ({
    asFragment,
    getByText,
    getByLabelText,
    getByDisplayValue,
    container,
    getByPlaceholderText,
  } = render(application));
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

test("Attempt to change a interface's language", async () => {
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

test('Attempt to add new channel', async () => {
  nock(host)
    .post(`/${routes.allChannels()}`)
    .reply(201, {
      data: {
        type: 'channels',
        id: idForNewChannel,
        attributes: {
          id: idForNewChannel,
          name: newChannelName,
          removable: true,
        },
      },
    })
    .post(`/${routes.allChannels()}`)
    .replyWithError(errorMessage);

  const addChannel = async (channelName) => {
    const addingChannelButton = container.querySelector('.adding-channel-button');
    fireEvent.click(addingChannelButton);

    const addingChannelInput = await waitForElement(() => getByPlaceholderText('Channel name...'));
    fireEvent.change(addingChannelInput, { target: { value: channelName } });
    await waitForElement(() => getByDisplayValue(channelName));

    // poppovers is added to the end of BODY element,
    // therefore it isn't in the React application container
    const sumbitAddingChannelButton = document.body.querySelector('#adding-channel-popover button[type="submit"]');
    fireEvent.click(sumbitAddingChannelButton);
    await wait(() => {
      if (document.body.contains(addingChannelInput) && addingChannelInput.disabled) {
        throw new Error();
      }
    });
  };

  await addChannel(newChannelName);
  await waitForElement(() => getByText(newChannelName));
  expect(asFragment()).toMatchSnapshot();

  await addChannel(nameForChannelUpdating);
  await waitForElement(() => getByText('An error occurred while sending the data. Try again later.'));
  const languagePanelHeader = getByText('Choose language:');
  const addingChannelPoppover = document.body.querySelector('#adding-channel-popover');
  fireEvent.click(languagePanelHeader);
  await wait(() => {
    if (document.body.contains(addingChannelPoppover)) {
      throw new Error();
    }
  });
});

test('Attempt to update channel', async () => {
  nock(host)
    .patch(`/${routes.particularChannel(idForNewChannel)}`)
    .reply(204)
    .patch(`/${routes.particularChannel(idForNewChannel)}`)
    .replyWithError(errorMessage);

  const updateChannel = async (channelElement, channelName) => {
    const currentChannelName = channelElement.textContent;
    const updatingDialogButton = channelElement.querySelector('.updating-channel-button');
    fireEvent.click(updatingDialogButton);
    const channelNameInput = await waitForElement(() => getByDisplayValue(currentChannelName));

    fireEvent.focus(channelNameInput);
    await timeout(1);
    fireEvent.change(channelNameInput, { target: { value: channelName } });
    await waitForElement(() => getByDisplayValue(channelName));
    fireEvent.blur(channelNameInput);
    await timeout(1);

    const submitUpdatingButton = document.body.querySelector('.updating-channel-modal button[type="submit"]');
    fireEvent.click(submitUpdatingButton);
    await wait(() => {
      if (document.body.contains(channelNameInput) && channelNameInput.disabled) {
        throw new Error();
      }
    });
  };

  const closeChannelUpdatingModal = async () => {
    const closeModalButton = document.body.querySelector('.updating-channel-modal button.close');
    fireEvent.click(closeModalButton);
    await wait(() => {
      if (document.body.contains(closeModalButton)) {
        throw new Error();
      }
    });
  };

  const updatingChannel = getByText(newChannelName);

  await updateChannel(updatingChannel, 'general');
  await waitForElement(() => getByText("Such channel's name is already exist."));
  await closeChannelUpdatingModal();

  await updateChannel(updatingChannel, nameForChannelUpdating);
  await waitForElement(() => getByText(nameForChannelUpdating));
  expect(asFragment()).toMatchSnapshot();

  await updateChannel(updatingChannel, 'wrong-channel');
  await waitForElement(() => getByText('An error occurred while sending the data. Try again later.'));
  await closeChannelUpdatingModal();
});

test('Attempt to remove channel', async () => {
  nock(host)
    .delete(`/${routes.particularChannel(idForMyChannel)}`)
    .reply(204)
    .delete(`/${routes.particularChannel(idForNewChannel)}`)
    .replyWithError(errorMessage);

  const removeChannel = async (channelElement) => {
    const removingDialogButton = channelElement.querySelector('.removing-channel-button');
    fireEvent.click(removingDialogButton);
    await waitForElement(() => getByText('Removing channel?'));

    const submitRemovingButton = document.body.querySelector('.removing-channel-confirm-form button');
    fireEvent.click(submitRemovingButton);
    await wait(() => {
      if (document.body.contains(submitRemovingButton) && submitRemovingButton.disabled) {
        throw new Error();
      }
    });
  };

  const myChannel = getByText(myChannelName);
  await removeChannel(myChannel);
  await wait(() => {
    if (document.body.contains(myChannel)) {
      throw new Error();
    }
  });
  expect(asFragment()).toMatchSnapshot();

  const addedChannel = getByText(nameForChannelUpdating);
  await removeChannel(addedChannel);
  await waitForElement(() => getByText('An error occurred while sending the data. Try again later.'));
  const languagePanelHeader = getByText('Choose language:');
  const removingChannelPoppover = document.body.querySelector('#removing-channel-popover');
  fireEvent.click(languagePanelHeader);
  await wait(() => {
    if (document.body.contains(removingChannelPoppover)) {
      throw new Error();
    }
  });
});

test('Attempt to add a new message by the user', async () => {
  const idForNewMessage = getNextId();

  nock(host)
    .post(`/${routes.messagesForParticularChannel(generalChannelId)}`)
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
    .post(`/${routes.messagesForParticularChannel(generalChannelId)}`)
    .replyWithError(errorMessage);


  const sendNewMessage = async (messageText) => {
    const newMessageTextInput = getByLabelText("Enter new message's text:");
    const newMessageFormSubmitButton = container.querySelector('.new-message-form button[type="submit"]');

    fireEvent.change(newMessageTextInput, { target: { value: messageText } });
    await waitForElement(() => getByDisplayValue(messageText));
    fireEvent.click(newMessageFormSubmitButton);
    await wait(() => {
      if (newMessageTextInput.disabled) {
        throw new Error();
      }
    });
  };

  await sendNewMessage(textForNewMessage);
  await waitForElement(() => getByText(textForNewMessage));
  expect(asFragment()).toMatchSnapshot();

  await sendNewMessage(textForNewMessage);
  await wait(() => getByText('An error occurred while sending the data. Try again later.'));
  expect(asFragment()).toMatchSnapshot();
});

test('Attempt to change current channel', async () => {
  const addedChannel = getByText(nameForChannelUpdating);
  fireEvent.click(addedChannel);
  await waitForElement(() => getByText('This channel does not have any messages yet... :('));
  expect(asFragment()).toMatchSnapshot();

  const generalChannel = getByText(generalChannelName);
  fireEvent.click(generalChannel);
  await waitForElement(() => getByText(textForNewMessage));
  expect(asFragment()).toMatchSnapshot();
});

test('Check socket.IO real-time getting messages', async () => {
  const mockServer = new SocketIOMockServer();
  const socketIOMockClient = mockServer.getSocketIOClient();

  initializeSocketClient(socketIOMockClient, store.dispatch, user1, getLogger('socket-client'));

  const message = {
    id: getNextId(),
    channelId: generalChannelId,
    text: 'New message!',
    author: user2,
  };

  mockServer.emit('newMessage', { data: { type: 'messages', id: message.id, attributes: message } });
  await waitForElement(() => getByText(message.text));
  expect(asFragment()).toMatchSnapshot();

  const message2 = {
    id: getNextId(),
    channelId: generalChannelId,
    text: 'More new message!',
    author: user1,
  };

  mockServer.emit('newMessage', { data: { type: 'messages', id: message2.id, attributes: message2 } });
  await timeout(300);
  expect(asFragment()).toMatchSnapshot();

  const newChannel = {
    id: getNextId(),
    removable: true,
    name: 'channelFromMockIOServer',
  };

  mockServer.emit('newChannel', { data: { type: 'channels', id: newChannel.id, attributes: newChannel } });
  await waitForElement(() => getByText(newChannel.name));
  expect(asFragment()).toMatchSnapshot();

  const updatingChannel = { ...newChannel, name: 'updatingFromMockIOServer' };

  mockServer.emit('renameChannel', { data: { type: 'channels', id: updatingChannel.id, attributes: updatingChannel } });
  await waitForElement(() => getByText(updatingChannel.name));
  expect(asFragment()).toMatchSnapshot();

  mockServer.emit('removeChannel', { data: { type: 'channels', id: updatingChannel.id } });
  timeout(300);
  expect(asFragment()).toMatchSnapshot();
});
