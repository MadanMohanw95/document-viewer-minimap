import React from 'react';
import ReactMinimap from './ReactMinimap';
import LeftContent from './LeftContent';
import RightContent from './RightContent';

const ArticleMinimap = () => (
  <ReactMinimap
    selector=".highlight"
    height={window.innerHeight}
    width={150}
    keepAspectRatio={false}
    LeftContent={<LeftContent />}
    RightContent={<RightContent />}
  />
);
export default ArticleMinimap;
