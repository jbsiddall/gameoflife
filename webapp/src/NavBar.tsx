import React, {useCallback, useEffect, useState} from 'react';
import {
  AppBar, Box,
  Button,
  Fade,
  IconButton,
  List,
  ListItem,
  Menu,
  MenuItem,
  Popover,
  Toolbar,
  Typography
} from '@material-ui/core';
import {useStyles} from "./style";
import MenuIcon from '@material-ui/icons/Menu';
import AddIcon from '@material-ui/icons/Add';
import {useHistory} from 'react-router-dom';
import gql from 'graphql-tag';
import {useCreateGameMutation, useGetAllGamesQuery} from "./generated/graphql";
import useGameView from "./useGameView";

gql`
  mutation createGame($name: String!, $x: Int!, $y: Int!, $width: Int!, $height: Int!) {
      createGame(name: $name, x: $x, y: $y, width: $width, height: $height) {
          game {
              id
          }
      }
  }
`;


export const CreateGameButton = () => {
  const [createGameMutation, createGameResult] = useCreateGameMutation();
  const [cellsX, cellsY] = useGameView({cellSize: 50});
  const history = useHistory();

  useEffect(() => {
    if (!createGameResult.data) {
      return;
    }
    history.push(`/game/${createGameResult.data.createGame.game.id}`)
  }, [createGameResult]);

  const handleNewGame = useCallback(() => {
    createGameMutation({
      variables: {
        name: "New Game",
        x: 0,
        y: 0,
        width: cellsX,
        height: cellsY
      }
    });
  }, [createGameMutation]);

  return (
    <Button color="inherit">
      <AddIcon onClick={handleNewGame} />
    </Button>
  );
};


export const NavBar = (props: {children: React.ReactNode}) => {
  const classes = useStyles();
  return (
    <AppBar className={classes.root} position="sticky">
      <Toolbar>
        {props.children}
      </Toolbar>
    </AppBar>
  );
};

