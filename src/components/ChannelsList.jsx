import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
  Col,
  ListGroup,
  ButtonGroup,
  Button,
} from 'react-bootstrap';

import { channelsSelector } from '../selectors';

const mapStateToProps = state => ({
  channels: channelsSelector(state),
  currentChannelId: state.channels.currentChannelId,
});

class ChannelsList extends React.Component {
  renderChannel = (channel) => {
    const { currentChannelId } = this.props;

    return (
      <ListGroup.Item key={channel.id} as="li" action active={channel.id === currentChannelId} className="d-flex align-items-center">
        {channel.name}
        <ButtonGroup size="sm" className="ml-auto">
          <Button variant="success">Edit</Button>
          {channel.removable && <Button variant="danger">Delete</Button>}
        </ButtonGroup>
      </ListGroup.Item>
    );
  };

  render() {
    const { channels } = this.props;

    return (
      <Col as="aside" xs={4}>
        <ListGroup as="ul">
          {_.map(channels, this.renderChannel)}
        </ListGroup>
      </Col>
    );
  }
}

export default connect(mapStateToProps)(ChannelsList);
