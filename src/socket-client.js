import * as actions from './actions';

export default (socketClient, storeDispatch, currentUser, socketLogger) => {
  const logNewMessageFromServer = (messageType, data) => {
    socketLogger('New message from server has been received. Type: "%s". Data: %O', messageType, data);
  };

  const socket = socketClient();

  socket
    .on('connect', () => {
      socketLogger('Socket-client has been connected');
    })
    .on('connect_error', (err) => {
      socketLogger('Error occurs during socket client attempts to connect with the server: %O', err);
    })
    .on('connect_timeout', (timeout) => {
      socketLogger('Timeout occurs during socket client attempts to connect with the server: %s', timeout);
    })
    .on('error', (err) => {
      socketLogger('Error occurs during socket client-server data transfer: %O', err);
    })
    .on('disconnect', (reason) => {
      socketLogger("Socket's client-server connection has been disconnected by reason: %O", reason);
    })
    .on('newChannel', (data) => {
      logNewMessageFromServer('newChannel', data);

      const { data: { attributes: channel } } = data;
      storeDispatch(actions.addChannelSuccess({ channel }));
    })
    .on('removeChannel', (data) => {
      logNewMessageFromServer('removeChannel', data);

      const { data: { id } } = data;
      storeDispatch(actions.removeChannelSuccess({ id }));
    })
    .on('renameChannel', (data) => {
      logNewMessageFromServer('renameChannel', data);

      const { data: { attributes: channel } } = data;
      storeDispatch(actions.updateChannelSuccess({ channel }));
    })
    .on('newMessage', (data) => {
      logNewMessageFromServer('newMessage', data);

      const { data: { attributes: message } } = data;
      if (message.author.id !== currentUser.id) {
        storeDispatch(actions.addMessageSuccess({ message }));
      }
    });
};
