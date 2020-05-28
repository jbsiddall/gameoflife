from typing import List, Any, Tuple, Iterable, TYPE_CHECKING, TypeVar, Generic
from flask import Flask
from flask_cors import CORS
from flask_graphql import GraphQLView
import graphene
from graphene import ObjectType  # type: ignore
import random
from server import settings
import fireo

fireo.connection(from_file=settings.FIREBASE_ORM_CERTIFICATE)

from . import models

app = Flask(__name__)
CORS(app)


if TYPE_CHECKING:
    class MyObjectType(ObjectType[Any]):
        pass
else:
    class MyObjectType(ObjectType):
        pass



class Cell(MyObjectType):
    x = graphene.Int(required=True)
    y = graphene.Int(required=True)


class GameStep(MyObjectType):
    id = graphene.ID(required=True)
    order = graphene.Int(required=True)
    living_cells = graphene.List(graphene.NonNull(Cell), required=True,
                                 x=graphene.NonNull(graphene.Int),
                                 y=graphene.NonNull(graphene.Int),
                                 width=graphene.NonNull(graphene.Int),
                                 height=graphene.NonNull(graphene.Int))

    @staticmethod
    def resolve_living_cells(self: models.Step, _: Any, x: int, y: int, width: int, height: int) -> List[Cell]:
        props = self.to_dict()
        return [
            Cell(x=cx, y=cy)
            for (cx, cy) in zip(props['living_cells_x'], props['living_cells_y'])
            if x <= cx and cx < x + width
            if y <= cy and cy < y + height
        ]


class Game(MyObjectType):
    id = graphene.ID(required=True)
    name = graphene.String(required=True)

    steps = graphene.List(
        graphene.NonNull(GameStep),
        start=graphene.Int(required=True),
        end=graphene.Int(required=True),
        required=True
    )

    @staticmethod
    def resolve_steps(self: models.Game, _: Any, start: int, end: int) -> List[GameStep]:
        if start < 0:
            raise ValueError(f'start of "{start}" must be >= 0')
        if end <= 0:
            raise ValueError(f'end of "{end}" must be > 0')
        if end <= start:
            raise ValueError(f'end of "{end}" must be greater than start "{start}"')
        if end - start > 100:
            raise ValueError(f'can only request upto 100 steps ahead, and not {end - start}')

        latest_step: models.Step = models.Step.collection.filter('game', '==', self._meta._referenceDoc).order('-order').get()

        if start -1 > latest_step.order:
            raise ValueError(f'step window starting with {start} is too far into future')

        if latest_step.order < end - 1:
            fill_in_missing_window(self, latest_step, end)

        results: Iterable[models.Step] = (
            models.Step.collection
                .filter('game', '==', self._meta._referenceDoc)
                .filter('order', '>=', start)
                .filter('order', '<', end)
                .order('order')
                .fetch()
        )

        return list(results)


def fill_in_missing_window(game: models.Game, starting_step: models.Step, upto_order: int) -> None:
    current_step = starting_step
    last_step_needed = upto_order - 1

    while current_step.order < last_step_needed:
        current_step = generate_following_step(current_step)
        current_step.save()


def generate_following_step(step: models.Step) -> models.Step:
    def all_neighbours(x: int, y: int) -> List[Tuple[int, int]]:
        return [
            (nx, ny)
            for nx in range(x-1, x+2)
            for ny in range(y-1, y+2)
            if (nx, ny) != (x, y)
        ]

    def count_living_neighbours(x: int, y: int) -> int:
        return sum([
            1
            for (nx, ny) in all_neighbours(x, y)
            if (nx, ny) in living_cells
        ])

    living_cells = {
        (x, y)
        for (x, y) in zip(step.living_cells_x, step.living_cells_y)
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

    return models.Step(
        game=step.game,
        order=step.order+1,
        living_cells_x=[x for (x,_) in next_living_cells],
        living_cells_y=[y for (_,y) in next_living_cells],
    )


class Query(MyObjectType):
    games = graphene.List(graphene.NonNull(Game), required=True)
    game = graphene.Field(graphene.NonNull(Game), id=graphene.ID(required=True))

    @staticmethod
    def resolve_games(self: object, info: Any) -> List[models.Game]:
        return [doc for doc in models.Game.collection.fetch()]

    @staticmethod
    def resolve_game(self: object, info: Any, id: str) -> models.Game:
        return models.Game.collection.get(f'{models.Game.collection_name}/{id}')


class CreateGame(graphene.Mutation):
    class Arguments:
        name = graphene.String(required=True)
        x = graphene.Int(required=True)
        y = graphene.Int(required=True)
        width = graphene.Int(required=True)
        height = graphene.Int(required=True)

    game = graphene.Field(Game, required=True)

    @staticmethod
    def mutate(self: object, info: Any, name: str, x: int, y: int, width: int, height: int) -> 'CreateGame':
        living_cells = [
            (cx, cy)
            for cx in range(x, x + width)
            for cy in range(y, y + height)
            if random.random() > 0.5
        ]

        new_game = models.Game(name=name)
        new_step = models.Step(
            game=new_game,
            order=0,
            living_cells_x=[x for (x,_) in living_cells],
            living_cells_y=[y for (_,y) in living_cells]
        )

        new_game.save()
        new_step.save()

        return CreateGame(game=new_game)


class Mutations(MyObjectType):
    create_game = CreateGame.Field(required=True)


schema = graphene.Schema(query=Query, mutation=Mutations)


app.add_url_rule('/graphql', view_func=GraphQLView.as_view('graphql', schema=schema, graphiql=True))
