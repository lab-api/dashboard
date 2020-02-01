''' A script for running the API in debug mode for front-end development '''
from dashboard import API
import attr
from parametric import Parameter, Attribute, Instrument, Switch, Toggle

@attr.s
class TAPro(Instrument):
    frequency = Attribute('frequency', 394798.25)
    current = Attribute('current', 126)
    voltage = Attribute('voltage', 74.6)
    emission = Toggle('emission', False)

    name = attr.ib(default='TA Pro')

@attr.s
class Coils(Instrument):
    gradient = Attribute('gradient', 50.2)
    offset = Attribute('current offset', 3)
    powered = Toggle('powered', False)

    name = attr.ib(default='Quadrupole coils')

inst = TAPro(name='laser')
inst2 = Coils()

pmt = Parameter("PMT voltage", 0.7)
api = API(globals(), debug=True, port=8000)
api.serve()
