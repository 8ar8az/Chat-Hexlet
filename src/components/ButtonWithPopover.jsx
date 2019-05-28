import React from 'react';
import { Overlay, Popover } from 'react-bootstrap';

class ButtonWithPopover extends React.Component {
  constructor(props) {
    super(props);

    this.buttonTarget = React.createRef();
  }

  handleClick = (event) => {
    event.stopPropagation();
  };

  render() {
    const {
      buttonRender,
      popoverPlacement,
      popoverShow,
      onPopoverHide,
      popoverTitle,
      popoverId,
      children,
    } = this.props;

    return (
      <>
        {buttonRender(this.buttonTarget)}
        <Overlay
          placement={popoverPlacement}
          target={this.buttonTarget.current}
          show={popoverShow}
          rootClose
          onHide={onPopoverHide}
        >
          {({
            ref,
            style,
            placement,
            arrowProps,
          }) => (
            <Popover
              title={<div className="text-center">{popoverTitle}</div>}
              id={popoverId}
              ref={ref}
              style={style}
              placement={placement}
              arrowProps={arrowProps}
              onClick={this.handleClick}
            >
              {children}
            </Popover>
          )}
        </Overlay>
      </>
    );
  }
}

export default ButtonWithPopover;
