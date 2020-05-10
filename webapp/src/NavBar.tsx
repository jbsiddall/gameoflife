import React, {useCallback, useEffect, useState} from 'react';
import {AppBar, Button, Fade, IconButton, Menu, MenuItem, Toolbar, Typography} from '@material-ui/core';
import {useStyles} from "./style";
import MenuIcon from '@material-ui/icons/Menu';
import AddIcon from '@material-ui/icons/Add';
import {Game, getAllGames, createGame} from "./requests";
import {useHistory} from 'react-router-dom';

const NavBar = (props: {title: string}) => {
  const classes = useStyles();
  const [anchor, setAnchor] = useState<null | any>(null);
  const [games, setGames] = useState<Game[]>([]);
  const history = useHistory();

  useEffect(() => {
    (async () => {
      const games = await getAllGames();
      setGames(games);
    })();
  }, [setGames]);

  const handleClick = useCallback((event: React.MouseEvent) => {
    setAnchor(event.currentTarget);
  }, [setAnchor]);

  const handleClose = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    setAnchor(null);
  }, [setAnchor]);

  const handleGameSelect = useCallback((gameId: string) => {
    history.push(`/game/${gameId}`);
  }, [history]);

  const handleNewGame = useCallback(() => {
    (async () => {
      const game = await createGame('New Game');
      history.push(`/game/${game.id}`);
    })();
  }, []);

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-controls="nav-menu"
            onClick={handleClick}>
          <MenuIcon />
          <Menu
              id="nav-menu"
              anchorEl={anchor}
              keepMounted
              open={anchor !== null}
              onClose={handleClose}
              TransitionComponent={Fade}
          >
            {games.map(game => (
              <MenuItem onClick={() => handleGameSelect(game.id)}>{game.name}</MenuItem>
            ))}
          </Menu>
        </IconButton>
        <Typography variant="h6" className={classes.title}>
          {props.title}
        </Typography>
        <Button color="inherit">
          <AddIcon onClick={handleNewGame} />
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export {NavBar};