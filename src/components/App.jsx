import React from 'react';
import { Row, Col } from 'react-bootstrap';

import ChannelsList from './ChannelsList';
import ChannelView from './ChannelView';
import LanguagePanel from './LanguagePanel';

const styleForMain = {
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
};

const App = () => (
  <Row as="main" className="position-absolute" style={styleForMain}>
    <Col as="aside" xs={4} className="d-flex flex-column">
      <ChannelsList />
      <LanguagePanel />
    </Col>
    <Col as="section" className="position-relative">
      <ChannelView />
    </Col>
  </Row>
);

export default App;
