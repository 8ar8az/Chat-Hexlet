import { createAction } from 'redux-actions';

export const addChannelSuccess = createAction('CHANNEL_ADD_SUCCESS');

export const updateChannelSuccess = createAction('CHANNEL_UPDATE_SUCCESS');

export const removeChannelRequest = createAction('CHANNEL_REMOVE_REQUEST');
export const removeChannelSuccess = createAction('CHANNEL_REMOVE_SUCCESS');
export const removeChannelFailure = createAction('CHANNEL_REMOVE_FAILURE');

export const changeCurrentChannel = createAction('CURRENT_CHANNEL_CHANGE');

export const addMessagelSuccess = createAction('MESSAGE_ADD_SUCCESS');
