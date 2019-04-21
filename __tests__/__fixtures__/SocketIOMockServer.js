import EventEmmiter from 'events';

export default class SocketIOMockServer {
  constructor() {
    this.connection = new EventEmmiter();
  }

  getSocketIOClient() {
    return () => this.connection;
  }

  emit(event, ...args) {
    this.connection.emit(event, ...args);
  }
}
