import cn from 'classnames';
import _ from 'lodash';
import React from 'react';
import { ListGroup } from 'react-bootstrap';
import { withTranslation } from 'react-i18next';

import connect from '../../lib/connect';
import { messagesBoxBottomAlignStateSelector, messagesForCurrentChannelSelector } from '../selectors';
import ScrollableContainer from './containers/ScrollableContainer';

const style = {
  minHeight: '400px',
};

const mapStateToProps = state => ({
  messages: messagesForCurrentChannelSelector(state),
  messagesBoxBottomAlignState: messagesBoxBottomAlignStateSelector(state),
});

@connect(mapStateToProps)
@withTranslation()
class MessagesBox extends React.Component {
  handleScroll = (scrollStatus) => {
    const {
      messagesBoxBottomAlignState,
      setMessageBoxAlignToBottom,
      unsetMessageBoxAlignToBottom,
    } = this.props;

    const {
      offset: { y: offsetY },
      limit: { y: limitY },
    } = scrollStatus;

    if ((offsetY === limitY) && (messagesBoxBottomAlignState === 'off')) {
      setMessageBoxAlignToBottom();
    } else if ((offsetY !== limitY) && (messagesBoxBottomAlignState === 'on')) {
      unsetMessageBoxAlignToBottom();
    }
  };

  renderMessage = message => (
    <ListGroup.Item key={message.id} className="message border-top">
      <small className="border-bottom border-success message-author">{`${message.author.username}:`}</small>
      <div className="mt-2 text-break message-text">{message.text}</div>
    </ListGroup.Item>
  );

  render() {
    const {
      messages,
      messagesBoxBottomAlignState,
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
      <ScrollableContainer className="mb-4 border rounded border-warning" onScroll={this.handleScroll} alignToBottom={messagesBoxBottomAlignState === 'on'}>
        <ListGroup as="ul" variant="flush" className={classes} style={style}>
          {boxContent}
        </ListGroup>
      </ScrollableContainer>
    );
  }
}

export default MessagesBox;
