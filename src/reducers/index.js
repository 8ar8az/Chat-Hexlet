import _ from 'lodash';
import { combineReducers } from 'redux';
import { combineActions, handleActions } from 'redux-actions';
import { reducer as formReducer } from 'redux-form';
import * as actions from '../actions';

const channels = handleActions({
  [combineActions(
    actions.addChannelSuccess,
    actions.addChannelByServer,
  )](state, { payload: { channel } }) {
    const { byId, allIds } = state;
    return {
      ...state,
      byId: { ...byId, [channel.id]: channel },
      allIds: _.uniq([...allIds, channel.id]),
    };
  },
  [combineActions(
    actions.removeChannelSuccess,
    actions.removeChannelByServer,
  )](state, { payload: { id } }) {
    const { byId, allIds, currentChannelId } = state;
    return {
      byId: _.omit(byId, id),
      allIds: _.without(allIds, id),
      currentChannelId: currentChannelId === id ? _.min(allIds) : currentChannelId,
    };
  },
  [combineActions(
    actions.updateChannelSuccess,
    actions.updateChannelByServer,
  )](state, { payload: { channel } }) {
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

const messages = handleActions({
  [combineActions(
    actions.sendMessageSuccess,
    actions.receiveMessageFromServer,
  )](state, { payload: { message } }) {
    const { byId, allIds } = state;
    return {
      byId: { ...byId, [message.id]: message },
      allIds: [...allIds, message.id],
    };
  },
  [combineActions(
    actions.removeChannelSuccess,
    actions.removeChannelByServer,
  )](state, { payload: { id } }) {
    const { byId, allIds } = state;
    const idsForSaving = _.filter(allIds, messageId => byId[messageId].channelId !== id);
    const idsForRemoving = _.difference(allIds, idsForSaving);

    return {
      byId: _.omit(byId, idsForRemoving),
      allIds: idsForSaving,
    };
  },
}, { byId: {}, allIds: [] });

const channelAddingState = handleActions({
  [actions.addChannelRequest]: _.constant('requested'),
  [combineActions(actions.addChannelSuccess, actions.addChannelFailure)]: _.constant('no-requested'),
}, 'no-requested');

const channelUpdatingState = handleActions({
  [actions.updateChannelRequest]: _.constant('requested'),
  [combineActions(actions.updateChannelSuccess, actions.updateChannelFailure)]: _.constant('no-requested'),
}, 'no-requested');

const channelRemovingState = handleActions({
  [actions.removeChannelRequest](state, { payload: { id } }) {
    return { ...state, [id]: 'requested' };
  },
  [combineActions(
    actions.removeChannelSuccess,
    actions.showRemovingChannelDialog,
  )](state, { payload: { id } }) {
    return _.omit(state, id);
  },
  [actions.removeChannelFailure](state, { payload: { id } }) {
    return { ...state, [id]: 'failed' };
  },
}, {});

const addingChannelDialogState = handleActions({
  [actions.showAddingChannelDialog]: _.constant('shown'),
  [combineActions(
    actions.hideAddingChannelDialog,
    actions.addChannelSuccess,
  )]: _.constant('hidden'),
}, 'hidden');

const updatingChannelDialogState = handleActions({
  [actions.showUpdatingChannelDialog](state, { payload: { id } }) {
    return { display: 'shown', updatingChannelId: id };
  },
  [combineActions(
    actions.hideUpdatingChannelDialog,
    actions.updateChannelSuccess,
  )](state) {
    return { ...state, display: 'hidden' };
  },
}, { display: 'hidden', updatingChannelId: null });

const removingChannelDialogState = handleActions({
  [actions.showRemovingChannelDialog](state, { payload: { id } }) {
    return { ...state, [id]: 'shown' };
  },
  [combineActions(
    actions.hideRemovingChannelDialog,
    actions.removeChannelSuccess,
  )](state, { payload: { id } }) {
    return _.omit(state, id);
  },
}, {});

const messagesBoxBottomAlignState = handleActions({
  [combineActions(actions.setMessageBoxAlignToBottom, actions.sendMessageSuccess)]: _.constant('on'),
  [actions.unsetMessageBoxAlignToBottom]: _.constant('off'),
}, 'on');

const newMessageTextFieldState = handleActions({
  [actions.focusNewMessageTextField]: _.constant('focused'),
  [combineActions(
    actions.blurNewMessageTextField,
    actions.changeCurrentChannel,
  )]: _.constant('blurred'),
}, 'blurred');

const connectionWithServerState = handleActions({
  [actions.connectWithServer]: _.constant('online'),
  [actions.disconnectWithServer]: _.constant('offline'),
}, 'offline');

export default combineReducers({
  channels,
  messages,
  channelAddingState,
  channelUpdatingState,
  channelRemovingState,
  addingChannelDialogState,
  updatingChannelDialogState,
  removingChannelDialogState,
  messagesBoxBottomAlignState,
  newMessageTextFieldState,
  connectionWithServerState,
  form: formReducer,
});
