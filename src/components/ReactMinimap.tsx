import React from 'react';
import _ from 'lodash';
import './react-minimap.css';

export class Minimap extends React.Component {

  static defaultProps = {
    className: '',
    width: 200,
    height: 200,
    keepAspectRatio: false,
    onMountCenterOnX: false,
    onMountCenterOnY: false,
  };

  constructor(props) {
    super(props);
    this.down = this.down.bind(this);
    this.move = this.move.bind(this);
    this.synchronize = this.synchronize.bind(this);
    this.init = this.init.bind(this);
    this.up = this.up.bind(this);

    this.resize = _.throttle(this.synchronize, 100);

    this.state = {
      viewport: null,
      width: props.width,
      height: props.height,
      fontSize: 10,
      ratioX: 1,
    };

    this.downState = false;
    this.initState = false;
  }

  componentDidMount() {
    console.log("ReactMinimap: mount->", this.props);
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
    const { keepAspectRatio } = this.props; //to be removed - it is not currently needed or used
    const { scrollWidth, scrollHeight, scrollTop, scrollLeft } =
      this.leftsource;
    const sourceRect = this.leftsource.getBoundingClientRect();

    console.log("ReactMinimap:init:leftsource.getBoundingClientRect(): ", sourceRect);
    console.log("ReactMinimap:init: scrollWidth, scrollHeight, scrollTop, scrollLeft",scrollWidth, scrollHeight, scrollTop, scrollLeft);

    let { width, height } = this.props; //width and height are in small scale (minimap) units

    let ratioX = width / scrollWidth; //using this ratio only because it preserves how each row in minimap looks
    let ratioY = height / scrollHeight; //ignored for now
    console.log("ReactMinimap:init: ratioX, ratioY", ratioX, ratioY);

    if (keepAspectRatio) {
      if (ratioX < ratioY) {
        ratioY = ratioX;
        height = Math.round(scrollHeight / (scrollWidth / width));
      } else {
        ratioX = ratioY;
        width = Math.round(scrollWidth / (scrollHeight / height));
      }
    }

    this.setState({
      ...this.state,
      height,
      width,
      ratioX,
    });
  }

  down(e) {
    const { ratioX } = this.state;
    const pos = this.minimap.getBoundingClientRect(); //this is in small scale (minimap) units

    console.log("ReactMinimap:down:minimap.getBoundingClientRect(): ", pos);

    //this.x and this.y are in small scale units
    //this.l this.t this.w and this.h are in large scale (same as left content) units
    this.x = Math.round(pos.left + this.l * ratioX + this.w * ratioX / 2);
    this.y = Math.round(pos.top + this.t * ratioX + this.h * ratioX / 2);

    console.log("ReactMinimap:down:this.x, this.y: ", this.x, this.y);

    // console.log("ReactMinimap:down:this.minimap.scrollLeft, this.minimap.scrollTop: ", this.minimap.scrollLeft, this.minimap.scrollTop);
    // this.l += this.minimap.scrollLeft; //scroll is in large units
    // this.t += this.minimap.scrollTop;

    this.downState = true;
    this.move(e);
  }

  up() {
    this.downState = false;
  }

  move(e) {
    if (this.downState === false) return;

    const { width, height, ratioX } = this.state; //width and height are in small scale (minimap) units
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

    console.log("ReactMinimap:move:this.x, this.y, event.clientX, event.clientY: ", this.x, this.y, event.clientX, event.clientY);

    //scroll is in large units
    let dx = event.clientX - this.x + this.minimap.scrollLeft * ratioX; //small scale units on this line
    let dy = event.clientY - this.y + this.minimap.scrollTop * ratioX; //small scale units on this line

    let largeDx = dx / ratioX; //convert difference to large scale (left content) units
    let largeDy = dy / ratioX; //convert difference to large scale (left content) units

    console.log("ReactMinimap:move:dx, dy: ", dx, dy);

    if (this.l + largeDx < 0) {
      largeDx = -this.l;
    }
    if (this.t + largeDy < 0) {
      largeDy = -this.t;
    }
    if (this.l + this.w + largeDx > this.minimap.scrollWidth) { //scroll is in large (left content) units
      largeDx = this.minimap.scrollWidth - this.l - this.w;     //everything is large scale
    }
    if (this.t + this.h + largeDy > this.minimap.scrollHeight) { 
      largeDy = this.minimap.scrollHeight - this.t - this.h;
    }

    //console.log("ReactMinimap:move:dx, dy: ", dx, dy);
    console.log("ReactMinimap:move:largedx, largedy: ", largeDx, largeDy);

    this.x += dx; //if we run into issues, may need to do the four if statements above to cull dx and dy (in small units)
    this.y += dy; //for now it seems to be fine

    this.l += largeDx;
    this.t += largeDy;

    // Sanity checks:
    this.l = this.l < 0 ? 0 : this.l;
    this.t = this.t < 0 ? 0 : this.t;

    //const coefX = width / this.leftsource.scrollWidth;
    //const coefY = height / this.leftsource.scrollHeight;
    const left = this.l;
    const top = this.t;

    this.leftsource.scrollLeft = left;
    this.leftsource.scrollTop = top;
    this.redraw();
  }

  synchronize(options) {
    const { ratioX } = this.state;

    //everything is in large (left source) units
    const rect = this.leftsource.getBoundingClientRect();

    const dims = [rect.width, rect.height];
    const scroll = [this.leftsource.scrollLeft, this.leftsource.scrollTop];

    const lW = dims[0];
    const lH = dims[1];
    const lX = scroll[0];
    const lY = scroll[1];

    // Ternary operation includes sanity check
    this.w = lW;
      //Math.round(lW) > this.state.width ? this.state.width : Math.round(lW);
    this.h = lH;
      //Math.round(lH) > this.state.height ? this.state.height : Math.round(lH);
    this.l = lX;
    this.t = lY;

    //scroll the minimap
    if(this.t < this.minimap.scrollTop)
      this.minimap.scrollTop = this.t;
    if(this.l < this.minimap.scrollLeft)
      this.minimap.scrollLeft = this.l;
    
    if(this.t + this.h > this.minimap.scrollTop + this.minimap.getBoundingClientRect().height / ratioX)
      this.minimap.scrollTop += -(this.minimap.scrollTop + this.minimap.getBoundingClientRect().height / ratioX) +
                                (this.t + this.h);

    //old code, not used below this line
    // if (options !== undefined) {
    //   if (options.centerOnX === true) {
    //     this.leftsource.scrollLeft =
    //       this.leftsource.scrollWidth / 2 - dims[0] / 2;
    //   }

    //   if (options.centerOnY === true) {
    //     this.leftsource.scrollTop =
    //       this.leftsource.scrollHeight / 2 - dims[1] / 2;
    //   }
    // }

    // const coefX = width / this.leftsource.scrollWidth;
    // const coefY = height / this.leftsource.scrollHeight;
    // const left = this.l / coefX;
    // const top = this.t / coefY;
    // TODO : get top & left

    this.redraw();
  }


  redraw() {
    console.log("ReactMinimap:redraw:this.w, this.h, this.l, this.t: ", this.w, this.h, this.l, this.t);
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
    const { width, height, ratioX } = this.state;
    console.log("ReactMinimap:render: ", width, height, ratioX);

    return (
      <div className={'minimap-container ' + this.props.className}>
        <div
          className="minimap"
          style={{
            width: `${width/ratioX}px`,
            height: `${height/ratioX}px`,
            /* fontSize: '0.114rem', */
            transform: `scale(${ratioX})`,
            transformOrigin: `top right`,
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
          {this.props.children}
        </div>

        <div
          className={'minimap-container-scroll'}
          onScroll={this.synchronize}
          ref={(container) => {
            this.leftsource = container;
          }}
          style={{
            marginRight: `${width+50}px`,
          }}
        >
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default Minimap;
