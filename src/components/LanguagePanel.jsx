import React from 'react';
import { withTranslation } from 'react-i18next';
import { Button } from 'react-bootstrap';

@withTranslation()
class LanguagePanel extends React.Component {
  handleButtonClick = (language) => {
    const { i18n } = this.props;

    i18n.changeLanguage(language);
  };

  handleChangeLanguageToEnglish = () => {
    this.handleButtonClick('en');
  };

  handleChangeLanguageToRussian = () => {
    this.handleButtonClick('ru');
  };

  getButtonVatiant = (language) => {
    const { i18n } = this.props;

    if (language === i18n.language) {
      return 'success';
    }

    return 'light';
  };

  render() {
    const { t } = this.props;

    return (
      <div className="mt-auto mb-2 language-panel">
        <h5 className="text-center language-panel-label">{t('labels:inputs.languageChoice')}</h5>
        <div className="d-flex justify-content-around">
          <Button className="button-language-change-to-english" variant={this.getButtonVatiant('en')} onClick={this.handleChangeLanguageToEnglish}>{t('labels:buttons.language.english')}</Button>
          <Button className="button-language-change-to-russian" variant={this.getButtonVatiant('ru')} onClick={this.handleChangeLanguageToRussian}>{t('labels:buttons.language.russian')}</Button>
        </div>
      </div>
    );
  }
}

export default LanguagePanel;
