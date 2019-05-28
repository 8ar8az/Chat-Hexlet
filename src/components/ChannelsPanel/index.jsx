import React from 'react';
import _ from 'lodash';
import { withTranslation } from 'react-i18next';
import {
  ListGroup,
  ButtonGroup,
} from 'react-bootstrap';
import cn from 'classnames';

import connect from '../../../lib/connect';
import { channelsSelector, currentChannelIdSelector } from '../../selectors';
import ScrollableContainer from '../ScrollableContainer';
import ChannelAddingButton from './ChannelAddingButton';
import ChannelRemovingButton from './ChannelRemovingButton';
import ChannelUpdatingButton from './ChannelUpdatingButton';
import ChannelUpdatingModal from './ChannelUpdatingModal';

const style = {
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
};

const mapStateToProps = state => ({
  channels: channelsSelector(state),
  currentChannelId: currentChannelIdSelector(state),
});

@connect(mapStateToProps)
@withTranslation()
class ChannelsList extends React.Component {
  constructor(props) {
    super(props);
    this.mdMediaQuery = window.matchMedia('(min-width: 768px)');
  }

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

    const classes = cn({
      'channels-list-wrapper': true,
      'position-absolute d-flex flex-column': this.mdMediaQuery.matches,
    });

    return (
      <div className="channels-panel flex-grow-1 d-flex flex-column">
        <h3 className="channels-panel-label text-center">{t('labels:headers.channelsSwitch')}</h3>
        <ChannelAddingButton />
        <div className="mb-4 flex-grow-1 position-relative">
          <div className={classes} style={style}>
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
