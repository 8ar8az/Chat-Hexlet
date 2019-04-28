import { createSelector } from 'reselect';
import _ from 'lodash';

const getChannelsById = state => state.channels.byId;
const getChannelsAllIds = state => state.channels.allIds;

const getMessagesById = state => state.messages.byId;
const getMessagesAllIds = state => state.messages.allIds;

const getUpdatingChannelId = state => state.updatingChannelDialogState.updatingChannelId;

export const currentChannelIdSelector = state => state.channels.currentChannelId;

export const messagesBoxBottomAlignStateSelector = state => state.messagesBoxBottomAlignState;

export const addingChannelDialogDisplaySelector = state => state.addingChannelDialogState;
export const updatingChannelDialogDisplaySelector = (state) => {
  const { updatingChannelDialogState: { display } } = state;
  return display;
};
export const removingChannelDialogDisplaySelector = (
  state,
  props,
) => state.removingChannelDialogState[props.removingChannelId];

export const channelAddingStateSelector = state => state.channelAddingState;
export const channelUpdatingStateSelector = state => state.channelUpdatingState;
export const channelRemovingStateSelector = (
  state,
  props,
) => state.channelRemovingState[props.removingChannelId];

export const channelsSelector = createSelector(
  [getChannelsById, getChannelsAllIds],
  (channelsById, channelsAllIds) => {
    const channels = _.map(channelsAllIds, id => channelsById[id]);

    const sortingFn = (channel1, channel2) => {
      if (!channel1.removable && channel2.removable) return -1;
      if (channel1.removable && !channel2.removable) return 1;
      if (_.toUpper(channel1.name) < _.toUpper(channel2.name)) return -1;
      return 1;
    };

    return channels.sort(sortingFn);
  },
);

export const messagesForCurrentChannelSelector = createSelector(
  [getMessagesById, getMessagesAllIds, currentChannelIdSelector],
  (messagesById, messagesAllIds, currentChannelId) => {
    const messagesForCurrentChannel = _.filter(
      _.map(messagesAllIds, id => messagesById[id]),
      ['channelId', currentChannelId],
    );

    return _.sortBy(messagesForCurrentChannel, 'id');
  },
);

export const updatingChannelSelector = createSelector(
  [getChannelsById, getUpdatingChannelId],
  (channelsById, channelForEditId) => channelsById[channelForEditId],
);
