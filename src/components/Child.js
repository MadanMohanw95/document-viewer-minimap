import React from 'react';
import './react-minimap.css';

export class Child extends React.Component {
    
  render() {
    const { width, height, left, top } = this.props;
    return (
      <div
        style={{
          position: 'absolute',
          width,
          height,
          left,
          top,
        }}
        className="minimap-children"
      />
    );
  }
}

export default Child;
