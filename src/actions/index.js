import { createAction } from 'redux-actions';
import axios from 'axios';

import routes from '../routes';

export const addChannelRequest = createAction('CHANNEL_ADD_REQUEST');
export const addChannelSuccess = createAction('CHANNEL_ADD_SUCCESS');
export const addChannelFailure = createAction('CHANNEL_ADD_FAILURE');

export const updateChannelRequest = createAction('CHANNEL_UPDATE_REQUEST');
export const updateChannelSuccess = createAction('CHANNEL_UPDATE_SUCCESS');
export const updateChannelFailure = createAction('CHANNEL_UPDATE_FAILURE');

export const removeChannelRequest = createAction('CHANNEL_REMOVE_REQUEST');
export const removeChannelSuccess = createAction('CHANNEL_REMOVE_SUCCESS');
export const removeChannelFailure = createAction('CHANNEL_REMOVE_FAILURE');

export const changeCurrentChannel = createAction('CURRENT_CHANNEL_CHANGE');

export const sendMessageSuccess = createAction('MESSAGE_SEND_SUCCESS');

export const setMessageBoxAlignToBottom = createAction('MESSAGE_BOX_SET_ALIGN_TO_BOTTOM');
export const unsetMessageBoxAlignToBottom = createAction('MESSAGE_BOX_UNSET_ALIGN_TO_BOTTOM');

export const showAddingChannelDialog = createAction('ADDING_CHANNEL_DIALOG_SHOW');
export const hideAddingChannelDialog = createAction('ADDING_CHANNEL_DIALOG_HIDE');

export const showUpdatingChannelDialog = createAction('UPDATING_CHANNEL_DIALOG_SHOW');
export const hideUpdatingChannelDialog = createAction('UPDATING_CHANNEL_DIALOG_HIDE');

export const showRemovingChannelDialog = createAction('REMOVING_CHANNEL_DIALOG_SHOW');
export const hideRemovingChannelDialog = createAction('REMOVING_CHANNEL_DIALOG_HIDE');

export const receiveMessageFromServer = createAction('MESSAGE_RECEIVE_FROM_SERVER');
export const addChannelByServer = createAction('CHANNEL_ADD_BY_SERVER');
export const removeChannelByServer = createAction('CHANNEL_REMOVE_BY_SERVER');
export const updateChannelByServer = createAction('CHANNEL_UPDATE_BY_SERVER');

export const connectWithServer = createAction('CONNECTION_WITH_SERVER_SET_ONLINE');
export const disconnectWithServer = createAction('CONNECTION_WITH_SERVER_SET_OFFLINE');

export const sendMessage = ({ message, currentChannelId }) => async (dispatch) => {
  const requestData = { type: 'messages', attributes: { ...message } };
  const url = routes.messagesForParticularChannel(currentChannelId);

  const { data } = await axios.post(url, { data: requestData });
  dispatch(sendMessageSuccess({ message: data.data.attributes }));
};

export const addChannel = ({ channelName }) => async (dispatch) => {
  dispatch(addChannelRequest());
  try {
    const url = routes.allChannels();
    const requestData = { type: 'channels', attributes: { name: channelName } };

    const { data } = await axios.post(url, { data: requestData });
    dispatch(addChannelSuccess({ channel: data.data.attributes }));
  } catch (err) {
    dispatch(addChannelFailure());
    throw err;
  }
};

export const updateChannel = ({ channelName, updatingChannel }) => async (dispatch) => {
  dispatch(updateChannelRequest());
  try {
    const url = routes.particularChannel(updatingChannel.id);
    const requestData = { type: 'channels', id: updatingChannel.id, attributes: { name: channelName } };

    await axios.patch(url, { data: requestData });
    dispatch(updateChannelSuccess({ channel: { ...updatingChannel, name: channelName } }));
  } catch (err) {
    dispatch(updateChannelFailure());
    throw err;
  }
};

export const removeChannel = ({ id }) => async (dispatch) => {
  dispatch(removeChannelRequest({ id }));
  try {
    const url = routes.particularChannel(id);
    await axios.delete(url);
    dispatch(removeChannelSuccess({ id }));
  } catch (err) {
    dispatch(removeChannelFailure({ id }));
  }
};
