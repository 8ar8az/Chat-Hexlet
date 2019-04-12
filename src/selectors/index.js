/* eslint-disable import/prefer-default-export */
import { createSelector } from 'reselect';
import _ from 'lodash';

const getChannelsById = state => state.channels.byId;
const getChannelsAllIds = state => state.channels.allIds;

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
