import React from 'react';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import { withTranslation } from 'react-i18next';
import {
  Form,
  InputGroup,
} from 'react-bootstrap';

import connect from '../../../lib/connect';
import { currentChannelIdSelector } from '../../selectors';
import CurrentUserContext from '../../context';
import DataSendingButton from '../buttons/DataSendingButton';
import DialogError from './DialogError';

const newMessageTextFieldId = 'new-message-text';

const styleForTextarea = {
  resize: 'none',
};

const mapStateToProps = state => ({
  currentChannelId: currentChannelIdSelector(state),
});

@connect(mapStateToProps)
@withTranslation()
@reduxForm({ destroyOnUnmount: false })
class NewMessageForm extends React.Component {
  static contextType = CurrentUserContext;

  handleFormSubmit = async (values) => {
    const {
      reset,
      currentChannelId,
      sendMessage,
    } = this.props;

    const message = { ...values, author: this.context };

    try {
      await sendMessage({ message, currentChannelId });
      reset();
    } catch (err) {
      throw new SubmissionError({ _error: err });
    }
  };

  render() {
    const {
      pristine,
      submitting,
      handleSubmit,
      error,
      t,
    } = this.props;

    return (
      <Form className="mb-2 new-message-form" onSubmit={handleSubmit(this.handleFormSubmit)}>
        <Form.Group controlId={newMessageTextFieldId} className="mb-0">
          <Form.Label className="font-weight-bold">{t('labels:inputs.newMessageText')}</Form.Label>
          <InputGroup>
            <Field name="text" component="textarea" rows="3" className="form-control" disabled={submitting} id={newMessageTextFieldId} style={styleForTextarea} />
            <InputGroup.Append>
              <DataSendingButton type="submit" variant="success" disabled={pristine || submitting} sending={submitting} />
            </InputGroup.Append>
          </InputGroup>
        </Form.Group>
        {error && !submitting && <DialogError className="new-message-form-error" />}
      </Form>
    );
  }
}

export default NewMessageForm;
