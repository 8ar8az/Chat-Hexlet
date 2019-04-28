import React from 'react';

import connect from '../../lib/connect';
import MessagesBox from './MessagesBox';
import NewMessageForm from './forms/NewMessageForm';
import { currentChannelIdSelector } from '../selectors';

const mapStateToProps = state => ({
  currentChannelId: currentChannelIdSelector(state),
});

const style = {
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
};

@connect(mapStateToProps)
class ChannelView extends React.Component {
  render() {
    const { currentChannelId } = this.props;

    return (
      <div className="channel-view d-flex flex-column position-absolute mx-3" style={style}>
        <MessagesBox />
        <NewMessageForm key={currentChannelId} form={`newMessageForChannel-${currentChannelId}`} />
      </div>
    );
  }
}

export default ChannelView;
