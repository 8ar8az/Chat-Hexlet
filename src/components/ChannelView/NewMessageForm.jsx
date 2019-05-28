import React from 'react';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import { withTranslation } from 'react-i18next';
import {
  Form,
  InputGroup,
} from 'react-bootstrap';

import connect from '../../../lib/connect';
import { currentChannelIdSelector, newMessageTextFieldStateSelector } from '../../selectors';
import CurrentUserContext from '../../context';
import DataSendingButton from '../DataSendingButton';
import DialogError from '../DialogError';

const newMessageTextFieldId = 'new-message-text';

const styleForTextarea = {
  resize: 'none',
};

const mapStateToProps = state => ({
  currentChannelId: currentChannelIdSelector(state),
  newMessageTextFieldState: newMessageTextFieldStateSelector(state),
});

@connect(mapStateToProps)
@withTranslation()
@reduxForm({ destroyOnUnmount: false })
class NewMessageForm extends React.Component {
  static contextType = CurrentUserContext;

  constructor(props) {
    super(props);

    this.newMessageTextField = React.createRef();
  }

  componentDidUpdate() {
    const { newMessageTextFieldState } = this.props;
    const newMessageTextInput = this.newMessageTextField.current.getRenderedComponent();

    if (newMessageTextFieldState === 'focused') {
      newMessageTextInput.focus();
    } else {
      newMessageTextInput.blur();
    }
  }

  handleFormSubmit = async (values) => {
    const {
      reset,
      currentChannelId,
      sendMessage,
      focusNewMessageTextField,
    } = this.props;

    const message = { ...values, author: this.context };

    try {
      await sendMessage({ message, currentChannelId });
      reset();
    } catch (err) {
      throw new SubmissionError({ _error: err });
    } finally {
      focusNewMessageTextField();
    }
  };

  handleNewMessageFieldKeyPress = (event) => {
    const { handleSubmit } = this.props;

    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(this.handleFormSubmit)();
    }
  };

  handleNewMessageFieldFocus = () => {
    const { focusNewMessageTextField, newMessageTextFieldState } = this.props;
    if (newMessageTextFieldState !== 'focused') {
      focusNewMessageTextField();
    }
  };

  handleNewMessageFieldBlur = () => {
    const { blurNewMessageTextField, newMessageTextFieldState } = this.props;
    if (newMessageTextFieldState !== 'blurred') {
      blurNewMessageTextField();
    }
  };

  render() {
    const {
      submitting,
      pristine,
      handleSubmit,
      error,
      t,
    } = this.props;

    return (
      <Form className="mb-2 new-message-form" onSubmit={handleSubmit(this.handleFormSubmit)}>
        <Form.Group controlId={newMessageTextFieldId} className="mb-0">
          <Form.Label className="font-weight-bold">{t('labels:inputs.newMessageText')}</Form.Label>
          <InputGroup>
            <Field
              ref={this.newMessageTextField}
              forwardRef
              component="textarea"
              name="text"
              rows="3"
              className="form-control"
              disabled={submitting}
              id={newMessageTextFieldId}
              onKeyPress={this.handleNewMessageFieldKeyPress}
              onFocus={this.handleNewMessageFieldFocus}
              onBlur={this.handleNewMessageFieldBlur}
              style={styleForTextarea}
            />
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
