import React from 'react';
import { Spinner } from 'react-bootstrap';

const style = {
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 5000,
  backgroundColor: 'rgba(0, 0, 0, 0.2)',
};

const LoadingLanguageModal = () => (
  <div className="position-fixed d-flex justify-content-center align-items-center" style={style}>
    <Spinner animation="border" variant="primary" />
  </div>
);

export default LoadingLanguageModal;
