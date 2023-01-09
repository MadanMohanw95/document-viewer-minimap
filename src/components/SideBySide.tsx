import React, { useState, useEffect } from 'react';
import { Markup } from 'interweave';


const SideBySide = ({left, right, isCollapsed, collapseOpen, ...props})=>{
    // const leftSide = props.diffText.replace(/<ins(.*?)>(.*?)<\/ins>/g, '');
    // const rightSide = props.diffText.replace(/<del(.*?)>(.*?)<\/del>/g, '');
    // const [isCollapsed, setCollapsed] = useState(leftSide === rightSide);    
    const [leftSide, setLeftSide]=useState("");
    const [rightSide, setRightSide]=useState("");

    useEffect(()=>{
        setLeftSide(left);
        setRightSide(right);
      },[left, right])
    return (
    <div id='diff-element-content'>
        <span id='clickable'
            onClick={() => collapseOpen(props.paragraphIndex, !isCollapsed[props.paragraphIndex ])}
            style={{backgroundColor: (leftSide !== rightSide ? 'lightgray': '')}}
        >
                {props.paragraphIndex.toString().padStart(3, "0")}{(!isCollapsed[props.paragraphIndex]? '>' : '\u2304')} 
        </span>
        <div id='diff-element-left'>           
            <Markup content={!isCollapsed[props.paragraphIndex]? leftSide.split(' ').slice(0, 5).join(' ')+'.....' : leftSide} />
        </div>
        <div id='diff-element-right'>
            <Markup content={!isCollapsed[props.paragraphIndex]? rightSide.split(' ').slice(0, 5).join(' ')+'.....' : rightSide} />
        </div>
    </div>

    );
};

export default SideBySide;