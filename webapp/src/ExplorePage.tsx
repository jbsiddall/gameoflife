import React from 'react';
import { Container, Box, Button } from '@material-ui/core';
import {NavBar} from "./NavBar";

const ExplorePage = () => {
  return (
      <Box>
        <NavBar title="Explore"/>
        <Container>
          contents goes here
        </Container>
      </Box>
  )
};

export {ExplorePage};