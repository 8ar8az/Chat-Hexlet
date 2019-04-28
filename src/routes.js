import path from 'path';

const apiPartURL = 'api/v1';
const channelsPartURL = 'channels';
const messagesPartURL = 'messages';

export default {
  allChannels: () => path.join(apiPartURL, channelsPartURL),
  particularChannel: channelId => path.join(apiPartURL, channelsPartURL, String(channelId)),
  messagesForParticularChannel: channelId => path.join(
    apiPartURL,
    channelsPartURL,
    String(channelId),
    messagesPartURL,
  ),
};
