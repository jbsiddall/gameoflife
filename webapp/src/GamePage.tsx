import React, {useCallback, useEffect, useState} from 'react';
import {useParams, useHistory} from 'react-router-dom';
import {
  Backdrop,
  Box,
  CircularProgress, Divider,
  Drawer, IconButton,
  Typography,
  useTheme
} from "@material-ui/core";
import {NavBar} from "./NavBar";
import gql from 'graphql-tag';
import {useGetGameLazyQuery, useGetGameQuery} from "./generated/graphql";
import {useStyles} from "./style";
import useGameView from "./useGameView";
import {GameList} from "./GameList";
import MenuIcon from "@material-ui/icons/Menu";
import styled from "styled-components";
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import PauseCircleOutlineIcon from '@material-ui/icons/PauseCircleOutline';
import {CellBoard} from "./CellBoard";

gql`
    query getGame($gameId: ID!, $x: Int!, $y: Int!, $width: Int!, $height: Int!, $start: Int!, $end: Int!) {
      game(id: $gameId) {
          id
          __typename
          name
          steps(start: $start, end: $end) {
              id
              order
              livingCells(x: $x, y: $y, width: $width, height: $height) {
                  x
                  y
              }
          }
      }
  }
`;

const StyledBox = styled(Box)`
  position: fixed;
  bottom: 0px;
  left: 0px;
  right: 0px;
  z-index: 10;
`;

const StyledPauseIcon = styled(PauseCircleOutlineIcon)`
  width: 100%;
  height: 100%;
`;

const StyledPlayIcon = styled(PlayCircleOutlineIcon)`
  width: 100%;
  height: 100%;
`;

const GamePage = () => {
  const params = useParams<{id: string}>();
  const classes = useStyles();
  const theme = useTheme();
  const history = useHistory();
  const [cellsX, cellsY] = useGameView({cellSize: 50});
  const [isPlaying, setIsPlaying] = useState(false);
  const [stepState, setStepState] = useState<{currentStep: number, windowStart: number, windowEnd: number}>({
    currentStep: 0,
    windowStart: 0,
    windowEnd: 50
  });
  const [lastOrderToFinishAnimation, setLastOrderToFinishAnimation] = useState<number>(-1);

  const animationTime = 1000;

  const [preCacheGameData, {called: preCacheCalled}] = useGetGameLazyQuery();
  const {data, loading, error} = useGetGameQuery({variables: {
    gameId: params.id,
    x: 0,
    y: 0,
    width: cellsX,
    height: cellsY,
    start: stepState.windowStart,
    end: stepState.windowEnd
  }});

  const stepGame = useCallback(() => {
    setStepState(state => {
      if (state.currentStep + 1 >= state.windowEnd) {
        return {
          currentStep: state.currentStep + 1,
          windowStart: state.windowStart + 50,
          windowEnd: state.windowEnd + 50
        };
      } else {
        return {
          ...state,
          currentStep: state.currentStep + 1,
        };
      }
    });
  }, [setStepState]);

  const onPlayClicked = useCallback(() => {
    const newPlayState = !isPlaying;
    setIsPlaying(newPlayState);
    if (newPlayState) {
      stepGame();
    }
  }, [isPlaying, setIsPlaying, stepGame]);

  useEffect(() => {
    if (stepState.currentStep + 10 < stepState.windowEnd ) {
      return;
    }
    preCacheGameData({
      variables: {
        gameId: params.id,
        x: 0,
        y: 0,
        width: cellsX,
        height: cellsY,
        start: stepState.windowStart + 50,
        end: stepState.windowEnd + 50
      }
    });
  }, [stepState]);

  // useEffect(() => {
  //   if (!isPlaying) {
  //     return () => {}
  //   }
  //
  //   const handle = setInterval(stepGame, animationTime * 3);
  //   return () => {
  //     clearInterval(handle);
  //   }
  // }, [isPlaying, stepGame]);

  const onGameSelected = useCallback((gameId: string) => {
    history.push(`/game/${gameId}`);
  }, [history]);

  const [drawOpen, setDrawOpen] = useState(false);

  const previousStep = data?.game.steps.filter(step => step.order === stepState.currentStep - 1)[0];
  const currentStep = data?.game.steps.filter(step => step.order === stepState.currentStep)[0];

  const onAnimationEnd = useCallback(() => {
    if (!currentStep) {
      return;
    }

    setLastOrderToFinishAnimation(currentStep.order);

    if (isPlaying) {
      stepGame();
    }

  }, [stepGame, isPlaying, setLastOrderToFinishAnimation, currentStep]);

  if (error) {
    throw error;
  }

  if (loading || !currentStep) {
    return <Box>Loading</Box>;
  }

  return (
    <Box bgcolor={theme.palette.grey[200]} overflow="hidden" width="100vw" height="100vh">
      {loading && (
        <Backdrop className={classes.root} open={true}>
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      <NavBar>
        <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            onClick={() => setDrawOpen(true)}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6">
          {data?.game.name}
        </Typography>
      </NavBar>
      <StyledBox display="flex" flexDirection="column" alignItems="center">
        <Box onClick={onPlayClicked} width={100} height={100} bgcolor="rgba(255, 255, 255, 0.8)" borderRadius="100%">
        {isPlaying ? (
            <StyledPauseIcon />
        ) : (
            <StyledPlayIcon />
        )}
        </Box>
      </StyledBox>
      <Drawer anchor="left" open={drawOpen} onClose={() => setDrawOpen(false)}>
        <Box maxWidth={300} display="flex" flexDirection="column" mx={2} mt={2}>
          <Typography variant="h6">
            Playbooks
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Choose a playbook to run!
          </Typography>
          <Box mt={2} mb={3} >
            <Divider />
          </Box>
          <GameList gameSelected={onGameSelected}/>
        </Box>
      </Drawer>
      <CellBoard
          onAnimationEnd={onAnimationEnd}
          animationTime={animationTime}
          previousCells={previousStep?.livingCells || []}
          livingCells={currentStep?.livingCells} />
    </Box>
  );
};

export {GamePage};
