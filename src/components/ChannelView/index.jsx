import React from 'react';
import { withTranslation } from 'react-i18next';
import _ from 'lodash';

import connect from '../../../lib/connect';
import MessagesBox from './MessagesBox';
import NewMessageForm from './NewMessageForm';
import { currentChannelIdSelector } from '../../selectors';

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
@withTranslation()
class ChannelView extends React.Component {
  validateNewMessageForm = (values) => {
    const { t } = this.props;

    if (_.isEmpty(_.trim(values.text))) {
      return { text: t('errors:emptyNewMessageText') };
    }
    return {};
  }

  render() {
    const { currentChannelId } = this.props;

    return (
      <div className="channel-view flex-grow-1 position-relative">
        <div className="d-flex flex-column position-absolute" style={style}>
          <MessagesBox />
          <NewMessageForm key={currentChannelId} form={`newMessageForChannel-${currentChannelId}`} validate={this.validateNewMessageForm} />
        </div>
      </div>
    );
  }
}

export default ChannelView;
