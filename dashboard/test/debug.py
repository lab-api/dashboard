''' A script for running the API in debug mode for front-end development '''
from dashboard import API
from parametric import Instrument
from parametric.factory import Knob, Switch, Measurement

class TAPro(Instrument):
    def __init__(self, name='TA Pro'):
        super().__init__(name=name)
        self.frequency = Knob('frequency', 394798.25)
        self.current = Knob('current', 126)
        self.voltage = Knob('voltage', 74.6)
        self.emission = Switch('emission', False)
        self.temperature = Knob('temperature', 30)
        self.wavemeter_reading = Measurement('wavemeter', self.read_wavemeter)

    def read_wavemeter(self):
        return self.frequency()

class Coils(Instrument):
    def __init__(self, name='Coils'):
        super().__init__(name=name)
        self.gradient = Knob('gradient', 50.2)
        self.offset = Knob('offset', 3)
        self.powered = Switch('powered', False)

inst = TAPro(name='laser')
inst2 = Coils()

api = API(globals(), debug=True, port=8000)
api.serve()
