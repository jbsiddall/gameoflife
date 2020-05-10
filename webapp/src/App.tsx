import React from 'react';
import {
  HashRouter as Router,
  Route
} from 'react-router-dom';

import {ExplorePage} from "./ExplorePage";
import {GamePage} from "./GamePage";

const App = () => (
      <Router>
        <Route path="/explore">
          <ExplorePage/>
        </Route>
        <Route path="/game/:id">
          <GamePage/>
        </Route>
      </Router>
);

export default App;
