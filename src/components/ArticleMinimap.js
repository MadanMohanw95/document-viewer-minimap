import React from 'react';
import ReactMinimap from './ReactMinimap';
import LeftContent from './LeftContent';

const ArticleMinimap = () => (
  <ReactMinimap
    selector=".highlight"
    height={window.innerHeight}
    width={150}
    keepAspectRatio={false}
    LeftContent={<LeftContent />}
  />
);
export default ArticleMinimap;
