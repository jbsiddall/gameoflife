from flask import Flask, jsonify, request
from flask_cors import CORS  # type: ignore
from firebase_admin import credentials
import firebase_admin.firestore
from flask_graphql import GraphQLView
import graphene
import random


def setup_db():
    cred = credentials.Certificate('./gameoflife-87179-firebase-adminsdk-4nrzx-406361d56d.json')
    firebase_app = firebase_admin.initialize_app(cred)
    db = firebase_admin.firestore.client(firebase_app)
    return db

db = setup_db()

app = Flask(__name__)
CORS(app)


class Cell(graphene.ObjectType):
    x = graphene.Int(required=True)
    y = graphene.Int(required=True)


class Game(graphene.ObjectType):
    id = graphene.ID(required=True)
    name = graphene.String(required=True)
    step_count = graphene.Int(required=True)
    living_cells = graphene.List(Cell, required=True)

    def resolve_name(self, info):
        return self.to_dict()['name']

    def resolve_step_count(self, info):
        return self.to_dict()['step_count']

    def resolve_living_cells(self, info):
        props = self.to_dict()
        return [
            Cell(x=x, y=y)
            for (x, y) in zip(props['living_cells_x'], props['living_cells_y'])
        ]


class Query(graphene.ObjectType):
    games = graphene.List(Game, required=True)
    game = graphene.Field(Game, id=graphene.ID(required=True))

    def resolve_games(self, info):
        return [doc for doc in db.collection('games').stream()]

    def resolve_game(self, info, id):
        return db.collection('games').document(id).get()


class CreateGame(graphene.Mutation):
    class Arguments:
        name = graphene.String(required=True)

    game = graphene.Field(Game, required=True)

    @staticmethod
    def mutate(self, info, name):
        living_cells = [
            (x, y)
            for x in range(50)
            for y in range(50)
            if random.random() > 0.5
        ]

        new_game = db.collection('games').document()
        new_game.create({
            'name': name,
            'step_count': 0,
            'living_cells_x': [x for (x,_) in living_cells],
            'living_cells_y': [y for (_,y) in living_cells],
        })

        return CreateGame(game=new_game.get())


class StepGame(graphene.Mutation):
    class Arguments:
        game_id = graphene.ID(required=True)

    game = graphene.Field(Game, required=True)

    @staticmethod
    def mutate(self, info, game_id):
        game = db.collection('games').document(game_id).get()
        props = game.to_dict()

        def all_neighbours(x, y):
            return [
                (nx, ny)
                for nx in range(x-1, x+2)
                for ny in range(y-1, y+2)
                if (nx, ny) != (x, y)
            ]

        def count_living_neighbours(x, y):
            return sum([
                1
                for (nx, ny) in all_neighbours(x, y)
                if (nx, ny) in living_cells
            ])

        living_cells = {
            (x, y)
            for (x, y) in zip(props['living_cells_x'], props['living_cells_y'])
        }

        candidates = {
            (nx, ny)
            for (x, y) in living_cells
            for (nx, ny) in [(x, y), *all_neighbours(x, y)]
        }

        next_living_cells = list({
            (cx, cy)
            for (cx, cy) in candidates
            for n in [count_living_neighbours(cx, cy)]
            if n == 3 or (n == 2 and (cx, cy) in living_cells)
        })

        game.reference.update({
            'step_count': props['step_count'] + 1,
            'living_cells_x': [x for (x,_) in next_living_cells],
            'living_cells_y': [y for (_,y) in next_living_cells],
        })

        return StepGame(game=game)


class Mutations(graphene.ObjectType):
    create_game = CreateGame.Field()
    step_game = StepGame.Field()


schema = graphene.Schema(query=Query, mutation=Mutations)


app.add_url_rule('/graphql', view_func=GraphQLView.as_view('graphql', schema=schema, graphiql=True))

