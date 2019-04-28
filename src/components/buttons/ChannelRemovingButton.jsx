import React from 'react';
import { Button } from 'react-bootstrap';
import { MdDelete, MdDone } from 'react-icons/md';
import { withTranslation } from 'react-i18next';

import ButtonWithPopover from './ButtonWithPopover';
import { removingChannelDialogDisplaySelector, channelRemovingStateSelector } from '../../selectors';
import connect from '../../../lib/connect';
import DialogError from '../forms/DialogError';
import DataSendingButton from './DataSendingButton';

const mapStateToProps = (state, props) => ({
  removingChannelDialogDisplay: removingChannelDialogDisplaySelector(state, props),
  channelRemovingState: channelRemovingStateSelector(state, props),
});

@connect(mapStateToProps)
@withTranslation()
class ChannelRemovingButton extends React.Component {
  handleButtonClick = (event) => {
    event.stopPropagation();

    const { removingChannelId, showRemovingChannelDialog } = this.props;
    showRemovingChannelDialog({ id: removingChannelId });
  };

  handlePopoverHide = () => {
    const { removingChannelId, hideRemovingChannelDialog, channelRemovingState } = this.props;

    if (channelRemovingState !== 'requested') {
      hideRemovingChannelDialog({ id: removingChannelId });
    }
  };

  handleConfirmButtonClick = () => {
    const { removingChannelId, removeChannel } = this.props;
    removeChannel({ id: removingChannelId });
  };

  buttonRender = targetRef => (
    <Button ref={targetRef} className="removing-channel-button" variant="danger" onClick={this.handleButtonClick}>
      <MdDelete />
    </Button>
  );

  render() {
    const { channelRemovingState, removingChannelDialogDisplay, t } = this.props;

    return (
      <ButtonWithPopover
        buttonRender={this.buttonRender}
        popoverPlacement="right"
        popoverShow={removingChannelDialogDisplay === 'shown'}
        onPopoverHide={this.handlePopoverHide}
        popoverTitle={t('labels:inputs.channels.removing')}
        popoverId="removing-channel-popover"
      >
        <div className="text-center removing-channel-confirm-form">
          <DataSendingButton icon={MdDone} variant="success" disabled={channelRemovingState === 'requested'} sending={channelRemovingState === 'requested'} onClick={this.handleConfirmButtonClick} />
        </div>
        {(channelRemovingState === 'failed') && <DialogError className="removing-channel-error" />}
      </ButtonWithPopover>
    );
  }
}

export default ChannelRemovingButton;
