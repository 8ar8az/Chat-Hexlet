import React from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { MdSend } from 'react-icons/md';

const styleForButtonIcon = {
  marginTop: '-2px',
};

const SendingButton = ({ sending, icon, ...props }) => {
  const Icon = icon || MdSend;

  return (
    <Button {...props}>
      {sending ? <Spinner as="span" animation="border" variant="light" role="status" size="sm" /> : <Icon style={styleForButtonIcon} />}
    </Button>
  );
};

export default SendingButton;
