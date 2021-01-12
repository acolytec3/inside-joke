import { createContext } from 'react'
import Libp2p  from 'libp2p'
import PeerId from 'peer-id'
import { RsaPublicKey } from 'crypto'

export type globalState = {
    libp2p: Libp2p | undefined,
    remotePeer: PeerId | undefined,
    remotePeerPubKeyString: string | undefined,
    remotePeerPubKey: RsaPublicKey | undefined
}

export const initState: globalState = {
        libp2p: undefined,
        remotePeer: undefined,
        remotePeerPubKeyString: '',
        remotePeerPubKey: undefined

}

const GlobalContext = createContext<{state:globalState, dispatch: React.Dispatch<any>}>({state: initState, dispatch: () => null} )

export { GlobalContext as default }