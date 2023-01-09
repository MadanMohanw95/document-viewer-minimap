import React from 'react';
import SideBySide from './SideBySide.tsx';

const LeftContent = ({data, isCollapsed, collapseOpen, ...props}) => {
  return (data.map((par, index)=>{
      return (
          <SideBySide key={index}
                      diffText={par}
                      paragraphIndex={index}
                      left = {par.replace(/<ins(.*?)>(.*?)<\/ins>/g, '')}
                      right = {par.replace(/<del(.*?)>(.*?)<\/del>/g, '')}
                      isCollapsed = {isCollapsed} 
                      collapseOpen = {collapseOpen}
          />
      );
      
    })
  );
};

export default LeftContent;
