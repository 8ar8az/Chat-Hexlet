import { createAction } from 'redux-actions';
import axios from 'axios';

import routes from '../routes';

export const addChannelSuccess = createAction('CHANNEL_ADD_SUCCESS');

export const updateChannelSuccess = createAction('CHANNEL_UPDATE_SUCCESS');

export const removeChannelRequest = createAction('CHANNEL_REMOVE_REQUEST');
export const removeChannelSuccess = createAction('CHANNEL_REMOVE_SUCCESS');
export const removeChannelFailure = createAction('CHANNEL_REMOVE_FAILURE');

export const changeCurrentChannel = createAction('CURRENT_CHANNEL_CHANGE');

export const addMessageSuccess = createAction('MESSAGE_ADD_SUCCESS');

export const setMessageBoxAlignToBottom = createAction('MESSAGE_BOX_SET_ALIGN_TO_BOTTOM');
export const unsetMessageBoxAlignToBottom = createAction('MESSAGE_BOX_UNSET_ALIGN_TO_BOTTOM');

export const addMessage = ({ message, currentChannelId }) => async (dispatch) => {
  const requestData = { type: 'message', attributes: { ...message } };
  const url = routes.messagesForParticularChannel(currentChannelId);

  const { data } = await axios.post(url, { data: requestData });
  dispatch(addMessageSuccess({ message: data.data.attributes }));
};
