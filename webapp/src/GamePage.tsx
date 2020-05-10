import React from 'react';
import {useParams} from 'react-router-dom';

const GamePage = () => {
  const params = useParams<{id: string}>();

  return (
      <div>Hello from GamePage {params.id}</div>
  )
};

export {GamePage};