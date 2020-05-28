import random
import fireo

from server import settings, models

fireo.connection(from_file=settings.FIREBASE_ORM_CERTIFICATE)


def main() -> None:
    x, y, width, height = 0, 0, 10, 10

    living_cells = [
        (cx, cy)
        for cx in range(x, x + width)
        for cy in range(y, y + height)
        if random.random() > 0.5
    ]

    game = models.Game(name="Random 1")
    step1 = models.Step(
        game=game,
        order=0,
        living_cells_x=[x for (x,_) in living_cells],
        living_cells_y=[y for (_,y) in living_cells]
    )
    game.save()
    step1.save()


if __name__ == '__main__':
    main()
