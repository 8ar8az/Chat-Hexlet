import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';
import _ from 'lodash';
import * as actions from '../actions';

const channels = handleActions({
  [actions.addChannelSuccess](state, { payload: { channel } }) {
    const { byId, allIds } = state;
    return {
      ...state,
      byId: { ...byId, [channel.id]: channel },
      allIds: [...allIds, channel.id],
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

export default combineReducers({
  channels,
  channelRemovingState,
});
