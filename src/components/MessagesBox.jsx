import React from 'react';
import { ListGroup } from 'react-bootstrap';
import { withTranslation } from 'react-i18next';
import _ from 'lodash';
import cn from 'classnames';

import connect from '../../lib/connect';
import { messagesForCurrentChannelSelector, messagesBoxAlignToBottomStateSelector } from '../selectors';
import ScrollableContainer from './ScrollableContainer';

const style = {
  minHeight: '400px',
};

const mapStateToProps = state => ({
  messages: messagesForCurrentChannelSelector(state),
  messagesBoxAlignToBottomState: messagesBoxAlignToBottomStateSelector(state),
});

@connect(mapStateToProps)
@withTranslation()
class MessagesBox extends React.Component {
  handleScroll = (scrollStatus) => {
    const {
      messagesBoxAlignToBottomState,
      setMessageBoxAlignToBottom,
      unsetMessageBoxAlignToBottom,
    } = this.props;

    const {
      offset: { y: offsetY },
      limit: { y: limitY },
    } = scrollStatus;

    if (offsetY === limitY && !messagesBoxAlignToBottomState) {
      setMessageBoxAlignToBottom();
    } else if (offsetY !== limitY && messagesBoxAlignToBottomState) {
      unsetMessageBoxAlignToBottom();
    }
  };

  renderMessage = message => (
    <ListGroup.Item key={message.id} className="message">
      <small className="border-bottom border-success message-author">{`${message.author.username}:`}</small>
      <div className="mt-2 text-break message-text">{message.text}</div>
    </ListGroup.Item>
  );

  render() {
    const {
      messages,
      messagesBoxAlignToBottomState,
      t,
    } = this.props;

    const noMessages = _.isEmpty(messages);

    const boxContent = noMessages
      ? <li className="text-center">{t('info:channelHasNotMessage')}</li>
      : _.map(messages, this.renderMessage);

    const classes = cn({
      'justify-content-center': noMessages,
      'messages-box': true,
    });

    return (
      <ScrollableContainer className="mb-4 border rounded border-warning" onScroll={this.handleScroll} alignToBottom={messagesBoxAlignToBottomState}>
        <ListGroup as="ul" variant="flush" className={classes} style={style}>
          {boxContent}
        </ListGroup>
      </ScrollableContainer>
    );
  }
}

export default MessagesBox;
