import React from 'react';
import ReactMinimap from './ReactMinimap';
import LeftContent from './LeftContent';

const ArticleMinimap = () => (
  <ReactMinimap
    height={window.innerHeight-200}
    width={150}
    keepAspectRatio={false}
  >
    <LeftContent />
  </ReactMinimap>
);
export default ArticleMinimap;
