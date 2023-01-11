import React, { useState, useEffect } from 'react';
import _ from "lodash";
import ReactMinimap from './ReactMinimap.tsx';
import LeftContent from './LeftContent.tsx';
const fileName = '2021-2022_10K-ipsum-lorem.json';
const collapsedByDefault = true; //default state of the paragraphs

const ArticleMinimap = () => {
  const [data, setData] = useState([]);
  const [diffText, setDifText] = useState('Loading...');
  const [isCollapsed, setCollapsed] = useState([]);
  const getData = () => {
    fetch(fileName
      , {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    )
      .then(function (response) {
        return response.json();
      })
      .then(function (myJson) {
        setData(myJson)
        const para = myJson.diffed.split(/(?:\r\n|\n|\r)/g).filter((par) => par.length > 2);
        setCollapsed(Array(para.length).fill(collapsedByDefault));
      });
  }

  useEffect(() => {
    getData()
  }, [])

  const collapseOpen = async (iteration, status) => {
    const searchEnable = _.cloneDeep(isCollapsed);
    searchEnable[iteration] = status;
    setCollapsed([...searchEnable]);
  };

  const { diffed } = data;
  if (diffed && diffed !== diffText) {
    setDifText(diffed);
  }

  const paragraphs = diffText.split(/(?:\r\n|\n|\r)/g).filter((par) => par.length > 2);
  return (
    <ReactMinimap
      height={window.innerHeight}
      width={150}
    >
      <LeftContent data={paragraphs} isCollapsed={isCollapsed}
        collapseOpen={collapseOpen}
      />
    </ReactMinimap>
  );
};

export default ArticleMinimap;
