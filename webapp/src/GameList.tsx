import React from 'react';
import {useGetAllGamesQuery} from "./generated/graphql";
import gql from 'graphql-tag';
import {List, ListItem} from "@material-ui/core";

gql`
    query getAllGames {
        games {
            id
            name
        }
    }
`;

const GameList = (props: {gameSelected: (gameId: string) => void}) => {
  const allGamesResult = useGetAllGamesQuery();
  const games = (allGamesResult.loading || !allGamesResult.data)
      ? []
      : allGamesResult.data.games;

  return (
      <List>
        {games.map(game => (
            <ListItem key={game.id} button onClick={() => props.gameSelected(game.id)}>{game.name}</ListItem>
        ))}
    </List>
    )
};

export {GameList};
