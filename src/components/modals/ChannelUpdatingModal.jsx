import React from 'react';
import { Modal } from 'react-bootstrap';
import { withTranslation } from 'react-i18next';
import { SubmissionError } from 'redux-form';

import ChannelEditForm from '../forms/ChannelEditForm';
import connect from '../../../lib/connect';
import { updatingChannelSelector, updatingChannelDialogDisplaySelector, channelUpdatingStateSelector } from '../../selectors';

const mapStateToProps = state => ({
  updatingChannel: updatingChannelSelector(state),
  updatingChannelDialogDisplay: updatingChannelDialogDisplaySelector(state),
  channelUpdatingState: channelUpdatingStateSelector(state),
});

@connect(mapStateToProps)
@withTranslation()
class EditingChannelModal extends React.Component {
  handleModalHide = () => {
    const { hideUpdatingChannelDialog, channelUpdatingState } = this.props;

    if (channelUpdatingState !== 'requested') {
      hideUpdatingChannelDialog();
    }
  };

  handleFormSubmit = async (values) => {
    const { updateChannel, updatingChannel } = this.props;

    try {
      await updateChannel({ ...values, updatingChannel });
    } catch (err) {
      throw new SubmissionError({ _error: err });
    }
  };

  render() {
    const {
      updatingChannel,
      updatingChannelDialogDisplay,
      channelUpdatingState,
      t,
    } = this.props;

    const modalBodyContent = updatingChannel
      ? <ChannelEditForm className="updating-channel-form" form="updatingChannel" initialValues={{ channelName: updatingChannel.name }} onSubmit={this.handleFormSubmit} />
      : <div className="text-center">{t('info:channelHasBeenRemoving')}</div>;

    return (
      <Modal show={updatingChannelDialogDisplay === 'shown'} centered onHide={this.handleModalHide} className="updating-channel-modal">
        <Modal.Header closeButton={channelUpdatingState !== 'requested'}>
          <Modal.Title>{t('labels:inputs.channels.updating')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalBodyContent}
        </Modal.Body>
      </Modal>
    );
  }
}

export default EditingChannelModal;
