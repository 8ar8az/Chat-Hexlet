import React from 'react';
import { withTranslation } from 'react-i18next';

@withTranslation()
class FormError extends React.Component {
  render() {
    const { t, className, children } = this.props;

    return (
      <div className={`${className} invalid-feedback d-block`}>
        {(React.Children.count(children) === 0) ? t('errors:dataSendingError') : children}
      </div>
    );
  }
}

export default FormError;
