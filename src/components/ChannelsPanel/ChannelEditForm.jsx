/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Form } from 'react-bootstrap';
import _ from 'lodash';
import { withTranslation } from 'react-i18next';

import connect from '../../../lib/connect';
import { channelsSelector } from '../../selectors';
import ChannelNameField from './ChannelNameField';
import DialogError from '../DialogError';

const mapStateToProps = state => ({
  channels: channelsSelector(state),
});

@connect(mapStateToProps)
@withTranslation()
@reduxForm({ touchOnChange: true, touchOnBlur: false })
class ChannelEditForm extends React.Component {
  validateUniqueChannelName = (value) => {
    const { channels, t } = this.props;

    if (_.some(channels, { name: value })) {
      return t('errors:channelNameNotUnique');
    }

    return undefined;
  };

  validateEmptyChannelName = (value) => {
    const { t } = this.props;

    if (_.isEmpty(value)) {
      return t('errors:channelNameIsEmpty');
    }

    return undefined;
  }

  render() {
    const {
      className,
      handleSubmit,
      error,
      submitting,
    } = this.props;

    return (
      <Form className={className} onSubmit={handleSubmit}>
        <Field component={ChannelNameField} name="channelName" validate={[this.validateEmptyChannelName, this.validateUniqueChannelName]} />
        {error && !submitting && <DialogError className="editing-channel-form-error" />}
      </Form>
    );
  }
}

export default ChannelEditForm;
