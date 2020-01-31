''' A script for running the API in debug mode for front-end development '''
from dashboard import API
import attr
from parametric import Parameter, Attribute, Instrument

@attr.s
class MyInstrument(Instrument):
    x = Attribute('x', 0)
    y = Attribute('y', 0)
    z = Attribute('z', 0)
    name = attr.ib(default='MyInstrument')

u = Parameter('u', 0)
v = Parameter('v', 1)
w = Parameter('w', 2)

inst = MyInstrument(x=3, y=4, z=5)

api = API(globals(), debug=True)
api.serve()
