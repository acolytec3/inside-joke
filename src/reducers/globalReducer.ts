import { globalState } from '../context/globalContext';

const globalReducer = (state: globalState, action: { type: string, payload: any }): globalState => {
    console.log('Current state is:')
    console.log(state)
    console.log('Action requested is:')
    console.log(action)
    switch (action.type) {
        default: return state
    }
}

export default globalReducer