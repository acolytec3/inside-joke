import { globalState } from "../context/globalContext";

const globalReducer = (
  state: globalState,
  action: { type: string; payload: any }
): globalState => {
  console.log("Current state is:");
  console.log(state);
  console.log("Action requested is:");
  console.log(action);

  switch (action.type) {
    case "LOAD_NODE": {
      return { ...state, libp2p: action.payload };
    }

    case "SET_PEER": {
      console.log('action is', action)
      return { ...state, 
        remotePeer: action.payload.remotePeer, 
        remotePeerPubKey: action.payload.remotePeerPubKey, 
        remotePeerPubKeyString: action.payload.remotePeerPubKeyString }
    }
    default:
      return state;
  }
};

export default globalReducer;
