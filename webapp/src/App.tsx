import React, {ReactNode, useEffect, useState} from 'react';
import {
  HashRouter as Router,
  Route
} from 'react-router-dom';
import ApolloClient from 'apollo-boost';
import { ThemeProvider } from '@material-ui/core/styles'
import { ApolloProvider } from '@apollo/react-hooks';

import {ExplorePage} from "./ExplorePage";
import {GamePage} from "./GamePage";
import theme from "./theme";


const client = new ApolloClient({
  uri: 'https://helloworld-278017.ew.r.appspot.com/graphql',
});

const InnerContent = () => {
  return (
    <>
      <Route exact path="/">
        <ExplorePage/>
      </Route>
      <Route path="/game/:id/">
        <GamePage/>
      </Route>
    </>
  );
};

const App = () => (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <Router>
          <InnerContent />
        </Router>
      </ThemeProvider>
    </ApolloProvider>
);

export default App;
