import { createSelector } from 'reselect';
import _ from 'lodash';

const getChannelsById = state => state.channels.byId;
const getChannelsAllIds = state => state.channels.allIds;

const getMessagesById = state => state.messages.byId;
const getMessagesAllIds = state => state.messages.allIds;

export const currentChannelIdSelector = state => state.channels.currentChannelId;

export const messagesBoxAlignToBottomStateSelector = state => state.messagesBoxAlignToBottomState;

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
