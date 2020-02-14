''' A script for running the API in debug mode for front-end development '''
from dashboard import API
from parametric import Instrument
from parametric.factory import Knob, Switch, Measurement, Selector

class TAPro(Instrument):
    def __init__(self, name='TA Pro'):
        super().__init__(name=name)
        self.frequency = Knob('frequency', 394798.25)
        self.current = Knob('current', 126, bounds=(0, 130))
        self.voltage = Knob('voltage', 74.6, bounds=(0, 140))
        self.emission = Switch('emission', False)
        self.temperature = Knob('temperature', 30)
        self.wavemeter_reading = Measurement('wavemeter', self.read_wavemeter)

    def read_wavemeter(self):
        return self.frequency()

class Coils(Instrument):
    def __init__(self, name='Coils'):
        super().__init__(name=name)
        self.gradient = Knob('gradient', 50.2, bounds=(0, 80))
        self.offset = Knob('offset', 3, bounds=(-10, 10))
        self.powered = Switch('powered', False)
        self.selector = Selector('selector', 0, [0, 1, 2])

class GreenController(Instrument):
    def __init__(self):
        super().__init__(name='556 controller')
        self.enabled = Switch('enabled', True)
        self.trapping = IntensityServo(name='trapping')
        self.pump = IntensityServo(name='optical pumping')

class IntensityServo(Instrument):
    def __init__(self, name='IntensityServo'):
        super().__init__(name=name)
        self.setpoint = Knob('setpoint', 4.1, bounds=(0, 5))
        self.lock = Switch('lock', False)

class PMT(Instrument):
    def __init__(self, name='PMT'):
        super().__init__(name=name)
        self.voltage = Knob('voltage', 0.7, bounds=(0, 1))
        self.fluorescence = Measurement('fluorescence', self.measure_fluorescence)

    def measure_fluorescence(self):
        return 10**self.voltage

inst = TAPro(name='Laser')
inst2 = Coils()
green = GreenController()
pmt = PMT()

api = API(globals(), debug=True, port=8000)
api.serve()
