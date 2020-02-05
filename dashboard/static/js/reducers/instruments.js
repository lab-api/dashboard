function getID(instrument, parameter){
  return instrument.concat('->', parameter)
}

export default function reducer(state=[], action) {
  switch(action.type) {
    default : return state;

    case 'addInstrument':
      return state.concat([action.instrument])
    }
}
