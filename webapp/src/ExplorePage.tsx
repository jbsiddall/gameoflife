import React from 'react';
import {Container, Box, Button, Typography} from '@material-ui/core';
import {NavBar, CreateGameButton} from "./NavBar";
import {useStyles} from "./style";

const ExplorePage = () => {
  const classes = useStyles();

  return (
      <Box>
        <NavBar>
          <Typography variant="h6" className={classes.title}>
            Explore
          </Typography>
          <CreateGameButton/>
        </NavBar>
        <Container>
          contents goes here
        </Container>
      </Box>
  )
};

export {ExplorePage};
