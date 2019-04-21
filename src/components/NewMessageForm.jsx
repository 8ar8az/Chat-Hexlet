import React from 'react';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import { withTranslation } from 'react-i18next';
import {
  Form,
  Button,
  Alert,
  Spinner,
} from 'react-bootstrap';

import connect from '../../lib/connect';
import { currentChannelIdSelector } from '../selectors';
import CurrentUserContext from './CurrentUserContext';

const NEW_MESSAGE_TEXT_INPUT_ID = 'new-message-text';

const styleForTextarea = {
  resize: 'none',
};
const styleForErrorMessage = {
  height: '38px',
  lineHeight: '38px',
};

const mapStateToProps = state => ({
  currentChannelId: currentChannelIdSelector(state),
});

@connect(mapStateToProps)
@withTranslation()
@reduxForm()
class NewMessageForm extends React.Component {
  static contextType = CurrentUserContext;

  handleFormSubmit = async (values) => {
    const {
      reset,
      currentChannelId,
      addMessage,
      setMessageBoxAlignToBottom,
    } = this.props;

    const message = { ...values, author: this.context };

    try {
      await addMessage({ message, currentChannelId });
      reset();
      setMessageBoxAlignToBottom();
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
        <Form.Group controlId={NEW_MESSAGE_TEXT_INPUT_ID}>
          <Form.Label className="font-weight-bold">{t('labels:inputs.newMessageText')}</Form.Label>
          <Field name="text" component="textarea" rows="3" className="form-control" disabled={submitting} id={NEW_MESSAGE_TEXT_INPUT_ID} style={styleForTextarea} />
        </Form.Group>
        <div>
          {error && !submitting && <Alert variant="danger" className="new-message-sending-error float-left m-0 px-3 py-0" style={styleForErrorMessage}>{t('errors:messageSendingError')}</Alert>}
          <Button className="float-right" type="submit" variant="primary" disabled={pristine || submitting}>
            {submitting && <Spinner as="span" animation="border" variant="light" role="status" size="sm" className="d-inline-block mr-2" />}
            {submitting ? t('labels:buttons.messageSending', { context: 'inProcess' }) : t('labels:buttons.messageSending')}
          </Button>
          <div className="clearfix" />
        </div>
      </Form>
    );
  }
}

export default NewMessageForm;
