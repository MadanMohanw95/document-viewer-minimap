import React, { useState, useEffect } from 'react';
import SideBySide from './SideBySide';

const fileName = '2021-2022_10K-ipsum-lorem.json'

const LeftContent = () => {
  const [data, setData]=useState([]);
  const [diffText, setDifText]=useState('Loading...');

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
  }

  const paragraphs = diffText.split(/(?:\r\n|\n|\r)/g).filter((par) => par.length > 2);
  return (paragraphs.map((par, index)=>{
      return (
          <SideBySide key={index}
                      diffText={par}
                      paragraphIndex={index}
          />
      );
      
    })
  );
};

export default LeftContent;
