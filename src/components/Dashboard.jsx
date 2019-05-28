import React from 'react';
import { Navbar } from 'react-bootstrap';
import { withTranslation } from 'react-i18next';

import ChannelsPanel from './ChannelsPanel';
import LanguagePanel from './LanguagesPanel';

@withTranslation()
class Dashboard extends React.Component {
  render() {
    const { t } = this.props;

    return (
      <Navbar className="p-0 flex-grow-1 align-items-stretch" expand="md">
        <Navbar.Toggle label="dashboard">{t('labels:dashboard')}</Navbar.Toggle>
        <Navbar.Collapse id="dashboard" className="mt-2 mt-md-0 border-bottom flex-column flex-grow-1 align-items-stretch">
          <ChannelsPanel />
          <LanguagePanel />
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default Dashboard;
