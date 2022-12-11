import React, { useState, useEffect } from 'react';
import { Markup } from 'interweave';


const SideBySide = (props)=>{
    const leftSide = props.diffText.replace(/<ins(.*?)>(.*?)<\/ins>/g, '');
    const rightSide = props.diffText.replace(/<del(.*?)>(.*?)<\/del>/g, '');

    return (
    <div id='diff-element-content'>
        <span>{props.paragraphIndex.toString().padStart(3, "0")}</span>
        <div id='diff-element-left'>
            
            <Markup content={leftSide} />
        </div>
        <div id='diff-element-right'>
            <Markup content={rightSide} />
        </div>
    </div>

    );
};

export default SideBySide;