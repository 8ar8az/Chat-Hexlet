import React from 'react';
import { Col } from 'react-bootstrap';

import ChannelView from './ChannelView';
import ConnectionStatus from './ConnectionStatus';
import Dashboard from './Dashboard';

const App = () => (
  <main className="h-100 d-flex flex-column flex-md-row">
    <Col as="aside" md={4} className="px-0 mr-md-3 mb-2 mb-md-0 d-flex flex-column">
      <Dashboard />
    </Col>
    <Col xs={11} md={8} as="section" className="d-flex flex-column flex-grow-1 px-0 ml-md-3 mw-100">
      <ConnectionStatus />
      <ChannelView />
    </Col>
  </main>
);

export default App;
