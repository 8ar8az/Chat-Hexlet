import React from 'react';
import Scrollbar from 'smooth-scrollbar';

export default class ScrollableContainer extends React.Component {
  constructor(props) {
    super(props);

    this.containerElement = React.createRef();
  }

  componentDidMount() {
    const { onScroll } = this.props;

    this.container = Scrollbar.init(this.containerElement.current, { alwaysShowTracks: true });
    if (onScroll) {
      this.container.addListener(onScroll);
    }

    this.setContainerAlign();
  }

  componentDidUpdate() {
    this.setContainerAlign();
  }

  componentWillUnmount() {
    const { onScroll } = this.props;

    if (onScroll) {
      this.container.removeListener(onScroll);
    }
  }

  setContainerAlign() {
    const {
      alignToBottom,
      alignToTop,
      alignToLeft,
      alignToRight,
    } = this.props;

    this.container.update();

    const {
      limit: { x: limitX, y: limitY },
      offset: { x: offsetX, y: offsetY },
    } = this.container;

    if (alignToTop) {
      this.container.scrollTo(offsetX, 0);
    } else if (alignToBottom) {
      this.container.scrollTo(offsetX, limitY);
    }

    if (alignToLeft) {
      this.container.scrollTo(0, offsetY);
    } else if (alignToRight) {
      this.container.scrollTo(limitX, offsetY);
    }
  }

  render() {
    const { children, className, style } = this.props;
    return (
      <div className={className} style={style} ref={this.containerElement}>
        {children}
      </div>
    );
  }
}
