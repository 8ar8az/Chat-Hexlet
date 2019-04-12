import React from 'react';
import { Row } from 'react-bootstrap';

import ChannelsList from './ChannelsList';
import ChannelView from './ChannelView';

const App = () => (
  <Row as="main">
    <ChannelsList />
    <ChannelView />
  </Row>
);

export default App;
