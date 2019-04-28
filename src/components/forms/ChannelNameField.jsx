import React from 'react';
import { InputGroup } from 'react-bootstrap';
import { withTranslation } from 'react-i18next';
import cn from 'classnames';

import DataSendingButton from '../buttons/DataSendingButton';
import DialogError from './DialogError';

@withTranslation()
class ChannelNameField extends React.Component {
  render() {
    const { input, meta, t } = this.props;

    const classes = cn({
      'form-control': true,
      'is-valid': meta.valid && meta.touched,
      'is-invalid': meta.invalid && meta.touched,
    });

    return (
      <div className="channel-name-field">
        <InputGroup>
          <input type="text" className={classes} placeholder={t('labels:inputs.channels.nameFieldPlaceholder')} disabled={meta.submitting} {...input} />
          <InputGroup.Append>
            <DataSendingButton
              type="submit"
              variant="success"
              disabled={meta.invalid || meta.submitting}
              sending={meta.submitting}
            />
          </InputGroup.Append>
        </InputGroup>
        {meta.invalid && meta.touched && <DialogError className="channel-name-field-error">{meta.error}</DialogError>}
      </div>
    );
  }
}

export default ChannelNameField;
