import React, { useState, useEffect } from 'react';
import SideBySide from './SideBySide';
import { Markup } from 'interweave';

const fileName = '2021-2022_10K-ipsum-lorem.json'

const LeftContent = () => {
  const [data, setData]=useState([]);
  const [diffText, setDifText]=useState('Loading...');
  const [cleanText, setCleanText]=useState(diffText);

  const getData=()=>{
    fetch(fileName
    ,{
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
       }
    }
    )
      .then(function(response){
        //console.log(response)
        return response.json();
      })
      .then(function(myJson) {
        //console.log(myJson);
        setData(myJson)
      });
  }

  useEffect(()=>{
    getData()
  },[])

  
  const { diffed } = data;
  if(diffed && diffed !== diffText){
    setDifText(diffed);
    console.log("difText Changed");
  }

  const paragraphs = diffText.split(/(?:\r\n|\n|\r)/g).filter((par) => par.length > 2);
  var cleaned = diffText.replace(/(?:\r\n|\n|\r)/g, '</div><div>');
  cleaned = cleaned.replace(/<ins(.*?)>(.*?)<\/ins>/g, '');
  cleaned = '<div>' + cleaned + '</div>';
  console.log("split text -> ", paragraphs);
  return (paragraphs.map((par, index)=>{
      if(par.length > 2)
        return (
          <SideBySide diffText={par}
                      paragraphIndex={index}
          />
        );
    })
//    <Markup content={cleaned} /> 
  );
};

export default LeftContent;
