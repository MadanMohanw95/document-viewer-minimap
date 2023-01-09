import React from 'react';
import ReactMinimap from './ReactMinimap.tsx';
import LeftContent from './LeftContent.tsx';

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
