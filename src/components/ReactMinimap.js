import React from 'react';
import _ from 'lodash';
import Child from './Child';
import './react-minimap.css';

export class Minimap extends React.Component {

  static defaultProps = {
    className: '',
    width: 200,
    height: 200,
    keepAspectRatio: false,
    childComponent: Child,
    onMountCenterOnX: false,
    onMountCenterOnY: false,
  };

  constructor(props) {
    super(props);
    this.down = this.down.bind(this);
    this.move = this.move.bind(this);
    this.synchronize = this.synchronize.bind(this);
    this.synchronizeRight = this.synchronizeRight.bind(this);
    this.init = this.init.bind(this);
    this.up = this.up.bind(this);

    this.resize = _.throttle(this.synchronize, 100);

    this.state = {
      children: null,
      viewport: null,
      width: props.width,
      height: props.height,
    };

    this.downState = false;
    this.initState = false;
  }

  componentDidMount() {
    const { onMountCenterOnX, onMountCenterOnY } = this.props;
    setTimeout(() =>
      this.synchronize({
        centerOnX: onMountCenterOnX,
        centerOnY: onMountCenterOnY,
      })
    );
    window.addEventListener('resize', this.resize);
    this.init();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.keepAspectRatio !== this.props.keepAspectRatio) {
      setTimeout(this.synchronize);
    } else if (nextProps.children !== this.props.children) {
      setTimeout(this.synchronize);
    }
  }

  componentDidUpdate() {
    if (this.initState) {
      this.initState = false;
    } else {
      this.initState = true;
      this.init();
    }
  }

  init() {
    const { childComponent, keepAspectRatio } = this.props;
    const ChildComponent = childComponent;
    const { scrollWidth, scrollHeight, scrollTop, scrollLeft } =
      this.leftsource;
    const sourceRect = this.leftsource.getBoundingClientRect();

    let { width, height } = this.props;

    let ratioX = width / scrollWidth;
    let ratioY = height / scrollHeight;

    if (keepAspectRatio) {
      if (ratioX < ratioY) {
        ratioY = ratioX;
        height = Math.round(scrollHeight / (scrollWidth / width));
      } else {
        ratioX = ratioY;
        width = Math.round(scrollWidth / (scrollHeight / height));
      }
    }

    const nodes = this.leftsource.querySelectorAll(this.props.selector);
    this.setState({
      ...this.state,
      height,
      width,
      children: _.map(nodes, (node, key) => {
        const { width, height, left, top } = node.getBoundingClientRect();

        const wM = width * ratioX;
        const hM = height * ratioY;
        const xM = (left + scrollLeft - sourceRect.left) * ratioX;
        const yM = (top + scrollTop - sourceRect.top) * ratioY;

        return (
          <ChildComponent
            key={key}
            width={Math.round(wM)}
            height={Math.round(hM)}
            left={Math.round(xM)}
            top={Math.round(yM)}
            node={node}
          />
        );
      }),
    });
  }

  down(e) {
    const pos = this.minimap.getBoundingClientRect();

    this.x = Math.round(pos.left + this.l + this.w / 2);
    this.y = Math.round(pos.top + this.t + this.h / 2);

    this.downState = true;
    this.move(e);
  }

  up() {
    this.downState = false;
  }

  move(e) {
    if (this.downState === false) return;

    const { width, height } = this.state;
    let event;

    e.preventDefault();
    if (e.type.match(/touch/)) {
      if (e.touches.length > 1) {
        return;
      }
      event = e.touches[0];
    } else {
      event = e;
    }

    let dx = event.clientX - this.x;
    let dy = event.clientY - this.y;
    if (this.l + dx < 0) {
      dx = -this.l;
    }
    if (this.t + dy < 0) {
      dy = -this.t;
    }
    if (this.l + this.w + dx > width) {
      dx = width - this.l - this.w;
    }
    if (this.t + this.h + dy > height) {
      dy = height - this.t - this.h;
    }

    this.x += dx;
    this.y += dy;

    this.l += dx;
    this.t += dy;

    // Sanity checks:
    this.l = this.l < 0 ? 0 : this.l;
    this.t = this.t < 0 ? 0 : this.t;

    const coefX = width / this.leftsource.scrollWidth;
    const coefY = height / this.leftsource.scrollHeight;
    const left = this.l / coefX;
    const top = this.t / coefY;

    this.leftsource.scrollLeft = Math.round(left);
    this.leftsource.scrollTop = Math.round(top);
    this.rightsource.scrollLeft = Math.round(left);
    this.rightsource.scrollTop = Math.round(top);
    this.redraw();
  }

  synchronize(options) {
    const { width, height } = this.state;

    const rect = this.leftsource.getBoundingClientRect();

    const dims = [rect.width, rect.height];
    const scroll = [this.leftsource.scrollLeft, this.leftsource.scrollTop];
    const scaleX = width / this.leftsource.scrollWidth;
    const scaleY = height / this.leftsource.scrollHeight;

    const lW = dims[0] * scaleX;
    const lH = dims[1] * scaleY;
    const lX = scroll[0] * scaleX;
    const lY = scroll[1] * scaleY;

    // Ternary operation includes sanity check
    this.w =
      Math.round(lW) > this.state.width ? this.state.width : Math.round(lW);
    this.h =
      Math.round(lH) > this.state.height ? this.state.height : Math.round(lH);
    this.l = Math.round(lX);
    this.t = Math.round(lY);
    if (options !== undefined) {
      if (options.centerOnX === true) {
        this.leftsource.scrollLeft =
          this.leftsource.scrollWidth / 2 - dims[0] / 2;
        this.rightsource.scrollLeft =
          this.leftsource.scrollWidth / 2 - dims[0] / 2;
      }

      if (options.centerOnY === true) {
        this.leftsource.scrollTop =
          this.leftsource.scrollHeight / 2 - dims[1] / 2;
        this.rightsource.scrollTop =
          this.leftsource.scrollHeight / 2 - dims[1] / 2;
      }
    }

    const coefX = width / this.leftsource.scrollWidth;
    const coefY = height / this.leftsource.scrollHeight;
    const left = this.l / coefX;
    const top = this.t / coefY;
    // TODO : get top & left
    this.rightsource.scrollLeft = Math.round(left);
    this.rightsource.scrollTop = Math.round(top);

    this.redraw();
  }

  synchronizeRight(options) {
    const { width, height } = this.state;

    const rect = this.rightsource.getBoundingClientRect();

    const dims = [rect.width, rect.height];
    const scroll = [this.rightsource.scrollLeft, this.rightsource.scrollTop];
    const scaleX = width / this.rightsource.scrollWidth;
    const scaleY = height / this.rightsource.scrollHeight;

    const lW = dims[0] * scaleX;
    const lH = dims[1] * scaleY;
    const lX = scroll[0] * scaleX;
    const lY = scroll[1] * scaleY;

    // Ternary operation includes sanity check
    this.w =
      Math.round(lW) > this.state.width ? this.state.width : Math.round(lW);
    this.h =
      Math.round(lH) > this.state.height ? this.state.height : Math.round(lH);
    this.l = Math.round(lX);
    this.t = Math.round(lY);

    if (options !== undefined) {
      if (options.centerOnX === true) {
        this.leftsource.scrollLeft =
          this.rightsource.scrollWidth / 2 - dims[0] / 2;
        this.rightsource.scrollLeft =
          this.rightsource.scrollWidth / 2 - dims[0] / 2;
      }

      if (options.centerOnY === true) {
        this.leftsource.scrollTop =
          this.rightsource.scrollHeight / 2 - dims[1] / 2;
        this.rightsource.scrollTop =
          this.rightsource.scrollHeight / 2 - dims[1] / 2;
      }
    }

    const coefX = width / this.rightsource.scrollWidth;
    const coefY = height / this.rightsource.scrollHeight;
    const left = this.l / coefX;
    const top = this.t / coefY;
    // TODO : get top & left
    this.leftsource.scrollLeft = Math.round(left);
    this.leftsource.scrollTop = Math.round(top);

    this.redraw();
  }

  redraw() {
    this.setState({
      ...this.state,
      viewport: (
        <div
          className="minimap-viewport"
          style={{
            width: this.w,
            height: this.h,
            left: this.l,
            top: this.t,
          }}
        />
      ),
    });
  }

  render() {
    const { width, height } = this.state;

    return (
      <div className={'minimap-container ' + this.props.className}>
        <div
          className="minimap"
          style={{
            width: `${width}px`,
            height: `${height}px`,
            fontSize: '0.114rem',
          }}
          ref={(minimap) => {
            this.minimap = minimap;
          }}
          onMouseDown={this.down}
          onTouchStart={this.down}
          onTouchMove={this.move}
          onMouseMove={this.move}
          onTouchEnd={this.up}
          onMouseUp={this.up}
        >
          {this.state.viewport}
          {this.props.RightContent}
        </div>

        <div
          className={'minimap-container-scroll'}
          onScroll={this.synchronize}
          ref={(container) => {
            this.leftsource = container;
          }}
        >
          {this.props.LeftContent}
        </div>
        <div
          className={'minimap-container-scroll'}
          onScroll={this.synchronizeRight}
          ref={(container) => {
            this.rightsource = container;
          }}
        >
          {this.props.RightContent}
        </div>
      </div>
    );
  }
}

export default Minimap;
