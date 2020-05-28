import {useCallback, useEffect, useState} from "react";

const useGameView = (props: {cellSize: number}) => {
  const [[width, height], setSize] = useState<[number, number]>([window.innerWidth, window.innerHeight]);

  const onResizeCallback = useCallback(() => {
    setSize([window.innerWidth, window.innerHeight])
  }, [setSize]);

  useEffect(() => {
    window.addEventListener('resize', onResizeCallback);
    return () => {
      window.removeEventListener('resize', onResizeCallback);
    }
  }, [onResizeCallback]);

  return [
      Math.floor(width / props.cellSize),
      Math.floor(height / props.cellSize)
  ];
}

export default useGameView;
