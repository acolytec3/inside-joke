import React from "react";
import Libp2p from "libp2p";
import WS from "libp2p-websockets";
import { NOISE } from "libp2p-noise";
import gossip from "libp2p-gossipsub";
import mplex from "libp2p-mplex";
import PeerID from "peer-id";
import WStar from "libp2p-webrtc-star";

import GlobalContext, { initState } from "./context/globalContext";
import { VStack } from "@chakra-ui/react";

import globalReducer from "./reducers/globalReducer";
import Profile from "./components/profile";
import PeerProfile from "./components/peerProfile";
import ChatWindow from "./components/chatWindow";

var node: Libp2p;

const options = {
  modules: {
    transport: [WS, WStar],
    connEncryption: [NOISE],
    streamMuxer: [mplex],
    pubsub: gossip,
  },
  addresses: {
    listen: [
      "/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star",
      "/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star",
      //"/ip4/127.0.0.1/tcp/13579/wss/p2p-webrtc-star",
    ],
  },
  config: {
    pubsub: {
      enabled: true,
    },
  },
};

export default function App() {
  const [state, dispatch] = React.useReducer(globalReducer, initState);
  const [chatOn, setChatOn] = React.useState(false);

  React.useEffect(() => {
    startUp();
  }, []);

  const startUp = async () => {
    let nodeId = await PeerID.create({ bits: 1024, keyType: "RSA" });
    let nodeOptions = { ...options, peerId: nodeId };
    if (node && node.isStarted) await node.stop();
    //@ts-ignore
    node = await Libp2p.create(nodeOptions);
    dispatch({ type: "LOAD_NODE", payload: node });
    await node.start();
    console.log("listening on: " + node.peerId.toB58String());
  };

  return (
    <GlobalContext.Provider value={{ dispatch, state }}>
      <VStack align="center" w="100vw">
        {!chatOn && (
          <>
            <Profile />
            <PeerProfile chatOff={() => setChatOn(true)} />
          </>
        )}
        {chatOn && (
          <ChatWindow chatOn={chatOn} chatOff={() => setChatOn(false)} />
        )}
      </VStack>
    </GlobalContext.Provider>
  );
}
