import React, { useState } from 'react';
import { Markup } from 'interweave';


const SideBySide = (props)=>{
    const leftSide = props.diffText.replace(/<ins(.*?)>(.*?)<\/ins>/g, '');
    const rightSide = props.diffText.replace(/<del(.*?)>(.*?)<\/del>/g, '');
    const [isCollapsed, setCollapsed] = useState(leftSide === rightSide);

    return (
    <div id='diff-element-content'>
        <span
            onClick={() => setCollapsed(!isCollapsed)}
            style={{backgroundColor: (leftSide !== rightSide ? 'lightgray': '')}}
        >
                {props.paragraphIndex.toString().padStart(3, "0")}{isCollapsed ? '+' : '-'} </span>
        <div id='diff-element-left'>           
            <Markup content={isCollapsed ? leftSide.split(' ').slice(0, 5).join(' ') : leftSide} />
        </div>
        <div id='diff-element-right'>
            <Markup content={isCollapsed ? rightSide.split(' ').slice(0, 5).join(' ') : rightSide} />
        </div>
    </div>

    );
};

export default SideBySide;