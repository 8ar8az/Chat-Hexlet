import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';
import { reducer as formReducer } from 'redux-form';
import _ from 'lodash';

import * as actions from '../actions';

const channels = handleActions({
  [actions.addChannelSuccess](state, { payload: { channel } }) {
    const { byId, allIds } = state;
    return {
      ...state,
      byId: { ...byId, [channel.id]: channel },
      allIds: _.uniq([...allIds, channel.id]),
    };
  },
  [actions.removeChannelSuccess](state, { payload: { id } }) {
    const { byId, allIds, currentChannelId } = state;
    return {
      byId: _.omit(byId, id),
      allIds: _.without(allIds, id),
      currentChannelId: currentChannelId === id ? _.find(byId, { name: 'general' }) : currentChannelId,
    };
  },
  [actions.updateChannelSuccess](state, { payload: { channel } }) {
    const { byId } = state;
    return {
      ...state,
      byId: { ...byId, [channel.id]: channel },
    };
  },
  [actions.changeCurrentChannel](state, { payload: { id } }) {
    return {
      ...state,
      currentChannelId: id,
    };
  },
}, { byId: {}, allIds: [], currentChannelId: null });

const channelRemovingState = handleActions({
  [actions.removeChannelRequest](state, { payload: { id } }) {
    return { ...state, [id]: 'requested' };
  },
  [actions.removeChannelSuccess](state, { payload: { id } }) {
    return _.omit(state, id);
  },
  [actions.removeChannelFailure](state, { payload: { id } }) {
    return { ...state, [id]: 'failed' };
  },
}, {});

const messages = handleActions({
  [actions.addMessageSuccess](state, { payload: { message } }) {
    const { byId, allIds } = state;
    return {
      byId: { ...byId, [message.id]: message },
      allIds: [...allIds, message.id],
    };
  },
  [actions.removeChannelSuccess](state, { payload: { id } }) {
    const { byId, allIds } = state;
    const idsForSaving = _.filter(allIds, messageId => byId[messageId].channelId !== id);
    const idsForRemoving = _.difference(allIds, idsForSaving);

    return {
      byId: _.omit(byId, idsForRemoving),
      allIds: idsForSaving,
    };
  },
}, { byId: {}, allIds: [] });

const messagesBoxAlignToBottomState = handleActions({
  [actions.setMessageBoxAlignToBottom]: _.constant(true),
  [actions.unsetMessageBoxAlignToBottom]: _.constant(false),
}, true);

export default combineReducers({
  channels,
  channelRemovingState,
  messages,
  messagesBoxAlignToBottomState,
  form: formReducer,
});
