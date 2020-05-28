import gql from 'graphql-tag';
import * as React from 'react';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactComponents from '@apollo/react-components';
import * as ApolloReactHoc from '@apollo/react-hoc';
import * as ApolloReactHooks from '@apollo/react-hooks';
export type Maybe<T> = T | null;
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Query = {
   __typename?: 'Query';
  games: Array<Game>;
  game: Game;
};


export type QueryGameArgs = {
  id: Scalars['ID'];
};

export type Game = {
   __typename?: 'Game';
  id: Scalars['ID'];
  name: Scalars['String'];
  steps: Array<GameStep>;
};


export type GameStepsArgs = {
  start: Scalars['Int'];
  end: Scalars['Int'];
};

export type GameStep = {
   __typename?: 'GameStep';
  id: Scalars['ID'];
  order: Scalars['Int'];
  livingCells: Array<Cell>;
};


export type GameStepLivingCellsArgs = {
  x: Scalars['Int'];
  y: Scalars['Int'];
  width: Scalars['Int'];
  height: Scalars['Int'];
};

export type Cell = {
   __typename?: 'Cell';
  x: Scalars['Int'];
  y: Scalars['Int'];
};

export type Mutations = {
   __typename?: 'Mutations';
  createGame: CreateGame;
};


export type MutationsCreateGameArgs = {
  height: Scalars['Int'];
  name: Scalars['String'];
  width: Scalars['Int'];
  x: Scalars['Int'];
  y: Scalars['Int'];
};

export type CreateGame = {
   __typename?: 'CreateGame';
  game: Game;
};

export type GetAllGamesQueryVariables = {};


export type GetAllGamesQuery = (
  { __typename?: 'Query' }
  & { games: Array<(
    { __typename?: 'Game' }
    & Pick<Game, 'id' | 'name'>
  )> }
);

export type GetGameQueryVariables = {
  gameId: Scalars['ID'];
  x: Scalars['Int'];
  y: Scalars['Int'];
  width: Scalars['Int'];
  height: Scalars['Int'];
  start: Scalars['Int'];
  end: Scalars['Int'];
};


export type GetGameQuery = (
  { __typename?: 'Query' }
  & { game: (
    { __typename: 'Game' }
    & Pick<Game, 'id' | 'name'>
    & { steps: Array<(
      { __typename?: 'GameStep' }
      & Pick<GameStep, 'id' | 'order'>
      & { livingCells: Array<(
        { __typename?: 'Cell' }
        & Pick<Cell, 'x' | 'y'>
      )> }
    )> }
  ) }
);

export type CreateGameMutationVariables = {
  name: Scalars['String'];
  x: Scalars['Int'];
  y: Scalars['Int'];
  width: Scalars['Int'];
  height: Scalars['Int'];
};


export type CreateGameMutation = (
  { __typename?: 'Mutations' }
  & { createGame: (
    { __typename?: 'CreateGame' }
    & { game: (
      { __typename?: 'Game' }
      & Pick<Game, 'id'>
    ) }
  ) }
);


export const GetAllGamesDocument = gql`
    query getAllGames {
  games {
    id
    name
  }
}
    `;
export type GetAllGamesComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<GetAllGamesQuery, GetAllGamesQueryVariables>, 'query'>;

    export const GetAllGamesComponent = (props: GetAllGamesComponentProps) => (
      <ApolloReactComponents.Query<GetAllGamesQuery, GetAllGamesQueryVariables> query={GetAllGamesDocument} {...props} />
    );
    
export type GetAllGamesProps<TChildProps = {}, TDataName extends string = 'data'> = {
      [key in TDataName]: ApolloReactHoc.DataValue<GetAllGamesQuery, GetAllGamesQueryVariables>
    } & TChildProps;
export function withGetAllGames<TProps, TChildProps = {}, TDataName extends string = 'data'>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  GetAllGamesQuery,
  GetAllGamesQueryVariables,
  GetAllGamesProps<TChildProps, TDataName>>) {
    return ApolloReactHoc.withQuery<TProps, GetAllGamesQuery, GetAllGamesQueryVariables, GetAllGamesProps<TChildProps, TDataName>>(GetAllGamesDocument, {
      alias: 'getAllGames',
      ...operationOptions
    });
};

/**
 * __useGetAllGamesQuery__
 *
 * To run a query within a React component, call `useGetAllGamesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllGamesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllGamesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllGamesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetAllGamesQuery, GetAllGamesQueryVariables>) {
        return ApolloReactHooks.useQuery<GetAllGamesQuery, GetAllGamesQueryVariables>(GetAllGamesDocument, baseOptions);
      }
export function useGetAllGamesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetAllGamesQuery, GetAllGamesQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetAllGamesQuery, GetAllGamesQueryVariables>(GetAllGamesDocument, baseOptions);
        }
export type GetAllGamesQueryHookResult = ReturnType<typeof useGetAllGamesQuery>;
export type GetAllGamesLazyQueryHookResult = ReturnType<typeof useGetAllGamesLazyQuery>;
export type GetAllGamesQueryResult = ApolloReactCommon.QueryResult<GetAllGamesQuery, GetAllGamesQueryVariables>;
export const GetGameDocument = gql`
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
export type GetGameComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<GetGameQuery, GetGameQueryVariables>, 'query'> & ({ variables: GetGameQueryVariables; skip?: boolean; } | { skip: boolean; });

    export const GetGameComponent = (props: GetGameComponentProps) => (
      <ApolloReactComponents.Query<GetGameQuery, GetGameQueryVariables> query={GetGameDocument} {...props} />
    );
    
export type GetGameProps<TChildProps = {}, TDataName extends string = 'data'> = {
      [key in TDataName]: ApolloReactHoc.DataValue<GetGameQuery, GetGameQueryVariables>
    } & TChildProps;
export function withGetGame<TProps, TChildProps = {}, TDataName extends string = 'data'>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  GetGameQuery,
  GetGameQueryVariables,
  GetGameProps<TChildProps, TDataName>>) {
    return ApolloReactHoc.withQuery<TProps, GetGameQuery, GetGameQueryVariables, GetGameProps<TChildProps, TDataName>>(GetGameDocument, {
      alias: 'getGame',
      ...operationOptions
    });
};

/**
 * __useGetGameQuery__
 *
 * To run a query within a React component, call `useGetGameQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetGameQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetGameQuery({
 *   variables: {
 *      gameId: // value for 'gameId'
 *      x: // value for 'x'
 *      y: // value for 'y'
 *      width: // value for 'width'
 *      height: // value for 'height'
 *      start: // value for 'start'
 *      end: // value for 'end'
 *   },
 * });
 */
export function useGetGameQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetGameQuery, GetGameQueryVariables>) {
        return ApolloReactHooks.useQuery<GetGameQuery, GetGameQueryVariables>(GetGameDocument, baseOptions);
      }
export function useGetGameLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetGameQuery, GetGameQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetGameQuery, GetGameQueryVariables>(GetGameDocument, baseOptions);
        }
export type GetGameQueryHookResult = ReturnType<typeof useGetGameQuery>;
export type GetGameLazyQueryHookResult = ReturnType<typeof useGetGameLazyQuery>;
export type GetGameQueryResult = ApolloReactCommon.QueryResult<GetGameQuery, GetGameQueryVariables>;
export const CreateGameDocument = gql`
    mutation createGame($name: String!, $x: Int!, $y: Int!, $width: Int!, $height: Int!) {
  createGame(name: $name, x: $x, y: $y, width: $width, height: $height) {
    game {
      id
    }
  }
}
    `;
export type CreateGameMutationFn = ApolloReactCommon.MutationFunction<CreateGameMutation, CreateGameMutationVariables>;
export type CreateGameComponentProps = Omit<ApolloReactComponents.MutationComponentOptions<CreateGameMutation, CreateGameMutationVariables>, 'mutation'>;

    export const CreateGameComponent = (props: CreateGameComponentProps) => (
      <ApolloReactComponents.Mutation<CreateGameMutation, CreateGameMutationVariables> mutation={CreateGameDocument} {...props} />
    );
    
export type CreateGameProps<TChildProps = {}, TDataName extends string = 'mutate'> = {
      [key in TDataName]: ApolloReactCommon.MutationFunction<CreateGameMutation, CreateGameMutationVariables>
    } & TChildProps;
export function withCreateGame<TProps, TChildProps = {}, TDataName extends string = 'mutate'>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  CreateGameMutation,
  CreateGameMutationVariables,
  CreateGameProps<TChildProps, TDataName>>) {
    return ApolloReactHoc.withMutation<TProps, CreateGameMutation, CreateGameMutationVariables, CreateGameProps<TChildProps, TDataName>>(CreateGameDocument, {
      alias: 'createGame',
      ...operationOptions
    });
};

/**
 * __useCreateGameMutation__
 *
 * To run a mutation, you first call `useCreateGameMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateGameMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createGameMutation, { data, loading, error }] = useCreateGameMutation({
 *   variables: {
 *      name: // value for 'name'
 *      x: // value for 'x'
 *      y: // value for 'y'
 *      width: // value for 'width'
 *      height: // value for 'height'
 *   },
 * });
 */
export function useCreateGameMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateGameMutation, CreateGameMutationVariables>) {
        return ApolloReactHooks.useMutation<CreateGameMutation, CreateGameMutationVariables>(CreateGameDocument, baseOptions);
      }
export type CreateGameMutationHookResult = ReturnType<typeof useCreateGameMutation>;
export type CreateGameMutationResult = ApolloReactCommon.MutationResult<CreateGameMutation>;
export type CreateGameMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateGameMutation, CreateGameMutationVariables>;