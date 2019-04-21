import path from 'path';

const API_PART_URL = 'api/v1';
const CHANNELS_PART_URL = 'channels';
const MESSAGES_PART_URL = 'messages';

export default {
  allChannels: () => path.resolve(API_PART_URL, CHANNELS_PART_URL),
  particularChannel: channelId => path.resolve(API_PART_URL, CHANNELS_PART_URL, String(channelId)),
  messagesForParticularChannel: channelId => path.resolve(
    API_PART_URL,
    CHANNELS_PART_URL,
    String(channelId),
    MESSAGES_PART_URL,
  ),
};
