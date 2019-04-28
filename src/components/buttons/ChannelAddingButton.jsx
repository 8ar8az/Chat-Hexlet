import React from 'react';
import { Button } from 'react-bootstrap';
import { withTranslation } from 'react-i18next';
import { MdAdd } from 'react-icons/md';
import { SubmissionError } from 'redux-form';

import connect from '../../../lib/connect';
import { addingChannelDialogDisplaySelector, channelAddingStateSelector } from '../../selectors';
import ChannelEditForm from '../forms/ChannelEditForm';
import ButtonWithPopover from './ButtonWithPopover';

const mapStateToProps = state => ({
  addingChannelDialogDisplay: addingChannelDialogDisplaySelector(state),
  channelAddingState: channelAddingStateSelector(state),
});

@connect(mapStateToProps)
@withTranslation()
class ChannelAddingButton extends React.Component {
  handleButtonClick = () => {
    const { showAddingChannelDialog } = this.props;
    showAddingChannelDialog();
  };

  handlePopoverHide = () => {
    const { hideAddingChannelDialog, channelAddingState } = this.props;

    if (channelAddingState !== 'requested') {
      hideAddingChannelDialog();
    }
  };

  handleSubmitForm = async (values, dispatch, props) => {
    const { addChannel } = props;

    try {
      await addChannel(values);
    } catch (err) {
      throw new SubmissionError({ _error: err });
    }
  };

  buttonRender = targetRef => (
    <Button ref={targetRef} variant="success" size="lg" block className="mb-3 adding-channel-button" onClick={this.handleButtonClick}>
      <MdAdd size="2rem" />
    </Button>
  );

  render() {
    const { addingChannelDialogDisplay, t } = this.props;

    return (
      <ButtonWithPopover
        buttonRender={this.buttonRender}
        popoverPlacement="bottom"
        popoverShow={addingChannelDialogDisplay === 'shown'}
        onPopoverHide={this.handlePopoverHide}
        popoverTitle={t('labels:inputs.channels.adding')}
        popoverId="adding-channel-popover"
      >
        <ChannelEditForm className="adding-channel-form" form="addingChannel" onSubmit={this.handleSubmitForm} />
      </ButtonWithPopover>
    );
  }
}

export default ChannelAddingButton;
