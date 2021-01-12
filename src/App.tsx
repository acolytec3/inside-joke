import React from "react";
import Libp2p from "libp2p";
import WS from "libp2p-websockets";
import { NOISE } from "libp2p-noise";
import gossip from "libp2p-gossipsub";
import mplex from "libp2p-mplex";
import PeerID from "peer-id";
import WStar from "libp2p-webrtc-star";
import { HashedBotIdenticon } from "@digitalungdom/bot-identicon";
import { BiSend } from "react-icons/bi";
import GlobalContext, { initState } from "./context/globalContext";
import {
  Box,
  Button,
  Input,
  Skeleton,
  Text,
  VStack,
  HStack,
  IconButton,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { send, receive } from "./providers/encryptedChat";
import { RsaPublicKey } from "crypto";
import { NOT_TYPING, TYPING } from "./context/constants";
import globalReducer from "./reducers/globalReducer";
import Profile from "./components/profile";
import PeerProfile from "./components/peerProfile";

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
      // "/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star",
      // "/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star",
      "/ip4/127.0.0.1/tcp/13579/wss/p2p-webrtc-star",
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
  const [msg, setMsg] = React.useState<string>();
  const [messageList, updateList] = React.useState<any[]>([]);
  const [chatOn, setChatOn] = React.useState(false);
  const [showTyping, setTyping] = React.useState(false);
  const [stillTyping, setStillTyping] = React.useState(false);
  const toast = useToast();

  React.useEffect(() => {
    startUp();
  }, []);

  React.useEffect(() => {
    const checkPulse = async () => {
      try {
        console.log("is anybody out there?", await node.ping(state.remotePeer!));
        setTimeout(() => checkPulse(), 5000);
      } catch (err) {
        console.log("Error!", err);
        toast({
          title: "Connection lost!",
          description: "Your friend seems to have disconnected.",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
        setChatOn(false);
        setMsg("");
        updateList([]);
      }
    };
    if (chatOn) {
      setTimeout(() => checkPulse(), 5000);
    }
  }, [chatOn]);

  const startUp = async () => {
    let nodeId = await PeerID.create({ bits: 1024, keyType: "RSA" });
    let nodeOptions = { ...options, peerId: nodeId };
    if (node && node.isStarted) await node.stop();
    //@ts-ignore
    node = await Libp2p.create(nodeOptions);
    dispatch({ type: "LOAD_NODE", payload: node });
    await node.handle("/encryptedChat/1.0", async ({ stream }) => {
      let mes = await receive(stream, node);
      if (mes === "#1512BA") {
        setTyping(true);
      } else if (mes === "#1512AB") {
        setTyping(false);
      } else {
        updateList((messages) => [...messages, { from: "them", message: mes }]);
        setTyping(false);
      }
    });
    await node.start();
    console.log("listening on: " + node.peerId.toB58String());
  };

  const sendMessage = async () => {
    send(msg!, node, state.remotePeer!, state.remotePeerPubKey);
    updateList((messages) => [...messages, { from: "me", message: msg! }]);
    setMsg("");
    setStillTyping(false);
  };

  const typing = async (evt: React.ChangeEvent<HTMLInputElement>) => {
    setMsg(evt.target.value);
    if (evt.target.value !== "" && !stillTyping) {
      send(TYPING, node, state.remotePeer!, state.remotePeerPubKey);
      setStillTyping(true);
    }
    if (evt.target.value === "" && stillTyping) {
      send(NOT_TYPING, node, state.remotePeer!, state.remotePeerPubKey);
      setStillTyping(false);
    }
  };

  return (
    <GlobalContext.Provider value={{ dispatch, state }}>
      <VStack align="center" w="100vw">
        {!chatOn && (
          <>
            <Profile />
            <PeerProfile chatOff={() => setChatOn(true)}/>
          </>
        )}
        {chatOn && (
          <Box>
            <Box position="absolute" height="100%" w="100vw" left="0px">
              {messageList.length > 0 &&
                messageList.map((msg) => {
                  return (
                    <HStack key={msg.message}>
                      <HashedBotIdenticon
                        identifier={
                          msg.from === "me" ? state.libp2p?.peerId.toJSON().pubKey! : state.remotePeerPubKeyString
                        }
                        size={48}
                      />
                      <Text>{msg.message}</Text>
                    </HStack>
                  );
                })}
              {showTyping && (
                <HStack>
                  <HashedBotIdenticon
                    identifier={state.remotePeerPubKeyString}
                    size={48}
                  />
                  <Skeleton>
                    <Text>
                      Some very long message that you'll never see!!! Hello!
                    </Text>
                  </Skeleton>
                </HStack>
              )}
            </Box>
            <HStack
              justifyContent="center"
              spacing={3}
              position="fixed"
              bottom="0px"
              left="0px"
              w="100vw"
            >
              <HashedBotIdenticon identifier={state.libp2p?.peerId.toJSON().pubKey!} size={48} />
              <Input
                opacity="100%"
                bg="white"
                placeholder="Say something"
                maxWidth="300px"
                value={msg}
                onChange={(evt) => typing(evt)}
                onKeyPress={(evt) => evt.key === "Enter" && sendMessage()}
              />
              <IconButton
                aria-label="send message"
                isDisabled={msg === "" || !state.remotePeer}
                onClick={sendMessage}
                icon={<BiSend />}
              />
            </HStack>
          </Box>
        )}
      </VStack>
    </GlobalContext.Provider>
  );
}
