import React from 'react';
import { Button } from 'react-bootstrap';
import { MdModeEdit } from 'react-icons/md';

import connect from '../../../lib/connect';

@connect()
class ChannelUpdatingButton extends React.Component {
  handleButtonClick = id => (event) => {
    event.stopPropagation();

    const { showUpdatingChannelDialog } = this.props;
    showUpdatingChannelDialog({ id });
  };

  render() {
    const { updatingChannelId } = this.props;

    return (
      <Button className="updating-channel-button" variant="success" onClick={this.handleButtonClick(updatingChannelId)}>
        <MdModeEdit />
      </Button>
    );
  }
}

export default ChannelUpdatingButton;
