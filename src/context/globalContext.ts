import { createContext } from 'react'
import Libp2p  from 'libp2p'

export type globalState = {
    libp2p: Libp2p | undefined
}

export const initState: globalState = {
        libp2p: undefined
}

const GlobalContext = createContext<{state:globalState, dispatch: React.Dispatch<any>}>({state: initState, dispatch: () => null} )

export { GlobalContext as default }