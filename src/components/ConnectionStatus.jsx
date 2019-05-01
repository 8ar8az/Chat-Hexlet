import React from 'react';
import { Badge } from 'react-bootstrap';

import CurrentUserContext from '../context';
import connect from '../../lib/connect';
import { connectionWithServerStateSelector } from '../selectors';

const mapStateToProps = state => ({
  connectionWithServerState: connectionWithServerStateSelector(state),
});

@connect(mapStateToProps)
class ConnectionStatus extends React.Component {
  static contextType = CurrentUserContext;

  render() {
    const { username } = this.context;
    const { connectionWithServerState } = this.props;

    return (
      <div className="connection-status">
        <h6 className="text-right">
          {username}
          <Badge className="ml-2" pill variant={connectionWithServerState === 'online' ? 'success' : 'danger'}>{connectionWithServerState}</Badge>
        </h6>
      </div>
    );
  }
}

export default ConnectionStatus;
