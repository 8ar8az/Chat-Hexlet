import React from 'react';
import _ from 'lodash';
import { withTranslation } from 'react-i18next';
import {
  ListGroup,
  ButtonGroup,
} from 'react-bootstrap';

import connect from '../../lib/connect';
import { channelsSelector, currentChannelIdSelector } from '../selectors';
import ScrollableContainer from './containers/ScrollableContainer';
import ChannelAddingButton from './buttons/ChannelAddingButton';
import ChannelRemovingButton from './buttons/ChannelRemovingButton';
import ChannelUpdatingButton from './buttons/ChannelUpdatingButton';
import ChannelUpdatingModal from './modals/ChannelUpdatingModal';

const style = {
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
};

const mapStateToProps = state => ({
  channels: channelsSelector(state),
  currentChannelId: currentChannelIdSelector(state),
});

@connect(mapStateToProps)
@withTranslation()
class ChannelsList extends React.Component {
  handleChannelClick = id => () => {
    const { changeCurrentChannel } = this.props;
    changeCurrentChannel({ id });
  };

  renderChannel = (channel) => {
    const { currentChannelId } = this.props;

    return (
      <ListGroup.Item
        key={channel.id}
        className="channel d-flex align-items-center text-break"
        as="li"
        action
        active={channel.id === currentChannelId}
        onClick={this.handleChannelClick(channel.id)}
      >
        {channel.name}
        <ButtonGroup size="sm" className="ml-auto">
          <ChannelUpdatingButton updatingChannelId={channel.id} />
          {channel.removable && <ChannelRemovingButton removingChannelId={channel.id} />}
        </ButtonGroup>
      </ListGroup.Item>
    );
  };

  render() {
    const { channels, t } = this.props;

    return (
      <div className="channels-panel flex-grow-1 d-flex flex-column">
        <h3 className="channels-panel-label text-center">{t('labels:headers.channelsSwitch')}</h3>
        <ChannelAddingButton />
        <div className="flex-grow-1 position-relative mb-4">
          <div className="position-absolute d-flex flex-column channels-list-wrapper" style={style}>
            <ScrollableContainer className="border rounded">
              <ListGroup as="ul" variant="flush" className="channels-list">
                {_.map(channels, this.renderChannel)}
              </ListGroup>
            </ScrollableContainer>
          </div>
        </div>
        <ChannelUpdatingModal />
      </div>
    );
  }
}

export default ChannelsList;
