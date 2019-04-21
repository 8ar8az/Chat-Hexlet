import React from 'react';
import _ from 'lodash';
import { withTranslation } from 'react-i18next';
import {
  ListGroup,
  ButtonGroup,
  Button,
} from 'react-bootstrap';

import connect from '../../lib/connect';
import { channelsSelector, currentChannelIdSelector } from '../selectors';

const mapStateToProps = state => ({
  channels: channelsSelector(state),
  currentChannelId: currentChannelIdSelector(state),
});

@connect(mapStateToProps)
@withTranslation()
class ChannelsList extends React.Component {
  renderChannel = (channel) => {
    const { currentChannelId, t } = this.props;

    return (
      <ListGroup.Item key={channel.id} as="li" action active={channel.id === currentChannelId} className="channel-item d-flex align-items-center">
        {channel.name}
        <ButtonGroup size="sm" className="ml-auto">
          <Button className="button-channel-edit" variant="success">{t('labels:buttons.channel.edit')}</Button>
          {channel.removable && <Button className="button-channel-remove" variant="danger">{t('labels:buttons.channel.delete')}</Button>}
        </ButtonGroup>
      </ListGroup.Item>
    );
  };

  render() {
    const { channels } = this.props;

    return (
      <ListGroup as="ul" className="channels-list">
        {_.map(channels, this.renderChannel)}
      </ListGroup>
    );
  }
}

export default ChannelsList;
