from dashboard import API
import attr
from parametric import Parameter, Attribute, Instrument

@attr.s
class MyInstrument(Instrument):
    x = Attribute('x', 0)
    name = attr.ib(default='MyInstrument')

y = Parameter('y', 1)
inst = MyInstrument(x=2)

api = API(globals())
api.run()

def test_parameter_endpoints():
    api.get('/parameters/y/set/3.14')    # set parameter value
    assert api.get('/parameters/y/get') == 3.14  # get parameter value

def test_instrument_endpoints():
    api.get('/instruments/MyInstrument/parameters/x/set/6.28')  # set instrument parameter
    assert api.get('/instruments/MyInstrument/parameters/x/get') == 6.28  # get instrument parameter

def test_shutdown():
    api.get('/shutdown')
