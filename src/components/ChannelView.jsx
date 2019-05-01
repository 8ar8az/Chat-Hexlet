import React from 'react';

import connect from '../../lib/connect';
import MessagesBox from './MessagesBox';
import NewMessageForm from './forms/NewMessageForm';
import { currentChannelIdSelector } from '../selectors';

const mapStateToProps = state => ({
  currentChannelId: currentChannelIdSelector(state),
});

const style = {
  right: 0,
  left: 0,
  top: 0,
  bottom: 0,
};

@connect(mapStateToProps)
class ChannelView extends React.Component {
  render() {
    const { currentChannelId } = this.props;

    return (
      <div className="channel-view flex-grow-1 position-relative">
        <div className="d-flex flex-column position-absolute" style={style}>
          <MessagesBox />
          <NewMessageForm key={currentChannelId} form={`newMessageForChannel-${currentChannelId}`} />
        </div>
      </div>
    );
  }
}

export default ChannelView;
