import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {Box, Zoom, makeStyles, Theme, useTheme} from "@material-ui/core";
import lodash from "lodash";

const useStyles = makeStyles<Theme, {theme: Theme}>({
  root: props => ({
    borderRadius: 25,
    width: '50%',
    height: '50%',
  }),
  alive: props => ({
    backgroundColor: props.theme.palette.secondary.main,
    // boxShadow: props.theme.shadows[10],
  }),
  dead: props => ({
    // backgroundColor: props.theme.palette.grey[200],
    backgroundColor: props.theme.palette.secondary.main,
  }),
});

interface Cell {
  x: number;
  y: number;
}

export interface Props {
  animationTime: number;
  previousCells: Cell[];
  livingCells: Cell[];
  onAnimationEnd: () => void;
}

const CellBoard = (props: Props) => {
  const theme = useTheme();
  const classes = useStyles({theme});

  const cacheCells = useCallback((cells: {x: number, y: number}[]) => {
    const rows = new Map<number, Map<number, boolean>>();
    cells.forEach(({x, y}) => {
      if (!rows.has(y)) {
        rows.set(y, new Map<number, boolean>());
      }
      rows.get(y)?.set(x, true);
    });
    return rows;
  }, []);

  const livingCellsSet: Map<number, Map<number, boolean>> = useMemo(() => cacheCells(props.livingCells), [cacheCells, props.livingCells]);
  const previousCellsSet: Map<number, Map<number, boolean>> = useMemo(() => cacheCells(props.previousCells), [cacheCells, props.previousCells]);

  const allCells: {x: number, y: number}[] = lodash.uniqWith(props.previousCells.concat(props.livingCells), lodash.isEqual);

  const transitioningCount = useRef<number>(0);

  const onTransitionAdd = useCallback(() => {
    transitioningCount.current += 1;
  }, [transitioningCount]);

  const onTransitionDone = useCallback(() => {
    transitioningCount.current -= 1;

    if (transitioningCount.current === 0) {
      props.onAnimationEnd();
    }
  }, [transitioningCount, props.onAnimationEnd]);

  return (
    <Box position="relative" width="100%">
      {allCells.map(cell => {
        const living = livingCellsSet.get(cell.y)?.get(cell.x);
        return (
          <Box key={`${cell.x}|${cell.y}`} position="absolute" top={cell.y * 50} left={cell.x * 50} width={50}
               height={50}>
            <Zoom in={living} timeout={props.animationTime} onEnter={onTransitionAdd} onExit={onTransitionAdd} onEntered={onTransitionDone} onExited={onTransitionDone}>
              <Box className={classes.root + " " + (living ? classes.alive : classes.dead)}/>
            </Zoom>
          </Box>
        );
      })}
    </Box>
  );
};

export {CellBoard};
