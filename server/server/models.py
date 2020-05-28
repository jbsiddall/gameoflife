from fireo.models import Model
from fireo import fields

class Game(Model):
    name = fields.TextField()

class Step(Model):
    game = fields.ReferenceField(Game)
    order = fields.NumberField()
    living_cells_x = fields.ListField()
    living_cells_y = fields.ListField()
