import * as actions from './actions';

export default (socketClient, storeDispatch, currentUser, socketLog) => {
  const logNewMessageFromServer = (messageType, data) => {
    socketLog('New message from server has been received. Type: "%s". Data: %O', messageType, data);
  };

  const socket = socketClient();

  socket
    .on('connect', () => {
      socketLog('Socket-client has been connected');
      storeDispatch(actions.connectWithServer());
    })
    .on('connect_error', (err) => {
      socketLog('Error occurs during socket client attempts to connect with the server: %O', err);
    })
    .on('connect_timeout', (timeout) => {
      socketLog('Timeout occurs during socket client attempts to connect with the server: %s', timeout);
    })
    .on('error', (err) => {
      socketLog('Error occurs during socket client-server data transfer: %O', err);
    })
    .on('disconnect', (reason) => {
      socketLog("Socket's client-server connection has been disconnected by reason: %O", reason);
      storeDispatch(actions.disconnectWithServer());
    })
    .on('newChannel', (data) => {
      logNewMessageFromServer('newChannel', data);

      const { data: { attributes: channel } } = data;
      storeDispatch(actions.addChannelByServer({ channel }));
    })
    .on('removeChannel', (data) => {
      logNewMessageFromServer('removeChannel', data);

      const { data: { id } } = data;
      storeDispatch(actions.removeChannelByServer({ id }));
    })
    .on('renameChannel', (data) => {
      logNewMessageFromServer('renameChannel', data);

      const { data: { attributes: channel } } = data;
      storeDispatch(actions.updateChannelByServer({ channel }));
    })
    .on('newMessage', (data) => {
      const { data: { attributes: message } } = data;
      if (message.author.id !== currentUser.id) {
        logNewMessageFromServer('newMessage', data);

        storeDispatch(actions.receiveMessageFromServer({ message }));
      }
    });
};
