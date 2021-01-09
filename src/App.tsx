import React from "react";
import Libp2p from "libp2p";
import WS from "libp2p-websockets";
import { NOISE } from "libp2p-noise";
import gossip from "libp2p-gossipsub";
import mplex from "libp2p-mplex";
import PeerID from "peer-id";
import WStar from "libp2p-webrtc-star";
import crypto from "libp2p-crypto";
import QRCode from "qrcode.react";
import QrReader from "react-qr-scanner";
import { HashedBotIdenticon } from "@digitalungdom/bot-identicon";
import { BiSend } from "react-icons/bi";
import {
  Box,
  Button,
  Input,
  Skeleton,
  Text,
  useClipboard,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  HStack,
  IconButton,
  Textarea,
  useToast,
  Spinner,
  Center,
} from "@chakra-ui/react";

import { send, receive } from "./providers/encryptedChat";

import { RsaPublicKey } from "crypto";

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
  const [id, setId] = React.useState("");
  const [msg, setMsg] = React.useState<string>();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [remotePeerKeyString, setRemote] = React.useState<string>("");
  const [peerId, setRemotePeerID] = React.useState<PeerID>();
  const [peerPubKey, setPubKey] = React.useState<RsaPublicKey>();
  const [messageList, updateList] = React.useState<any[]>([]);
  const [open, setOpen] = React.useState(false);
  const [chatOn, setChatOn] = React.useState(false);
  const [showTyping, setTyping] = React.useState(false);
  const [stillTyping, setStillTyping] = React.useState(false);
  const [dialing, setDialing] = React.useState(false);
  const toast = useToast();
  const { onCopy } = useClipboard(id);

  React.useEffect(() => {
    startUp();
  }, []);

  React.useEffect(() => {
    const checkPulse = async () => {
      try {
        console.log('is anybody out there?', await node.ping(peerId!))
        setTimeout(() => checkPulse(), 5000)
      }
      catch (err) {
        console.log('Error!', err)
        toast({
          title: "Connection lost!",
          description: "Your friend seems to have disconnected.",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
        setRemote('');
        setChatOn(false);
        setPubKey(undefined)
        setRemotePeerID(undefined)
        setMsg('')
        updateList([])
      }
    }
    if (chatOn) {
      setTimeout(() => checkPulse(), 5000);
    }
  }, [chatOn])

  const getKey = async () => {
    if (remotePeerKeyString) {
      setDialing(true);
      let peer: PeerID;
      let key: crypto.PublicKey;
      try {
        peer = await PeerID.createFromPubKey(remotePeerKeyString);
        key = crypto.keys.unmarshalPublicKey(peer.marshalPubKey());
      } catch (err) {
        console.log("Error!", err);
        toast({
          title: "Invalid address",
          description: "Scan your friend's QR code and try again",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
        setRemote("");
        setDialing(false);
        return;
      }
      let time = Date.now();
      let connected = false;
      do {
        try {
          console.log("ping ", await node.ping(peer));
          connected = true;
        } catch (err) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
          console.log("Error!", err);
        }
      } while (Date.now() - time < 5000 && !connected);
      if (connected) {
        setRemotePeerID(peer);
        //@ts-ignore
        setPubKey(key as RsaPublicKey);
        setChatOn(true);
      } else {
        toast({
          title: "Couldn't find friend!",
          description: "Scan your friend's QR code and try again",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      }
      setRemote("");
      setDialing(false);
    }
  };

  const startUp = async () => {
    setLoading(true);
    let nodeId = await PeerID.create({ bits: 1024, keyType: "RSA" });
    let nodeOptions = { ...options, peerId: nodeId };
    if (node && node.isStarted) await node.stop();
    //@ts-ignore
    node = await Libp2p.create(nodeOptions);

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
    setId(node.peerId.toJSON().pubKey!);
    console.log("listening on: " + node.peerId.toB58String());
    setLoading(false);
  };

  const sendMessage = async () => {
    send(msg!, node, peerId!, peerPubKey);
    updateList((messages) => [...messages, { from: "me", message: msg! }]);
    setMsg("");
    setStillTyping(false);
  };

  const typing = async (evt: React.ChangeEvent<HTMLInputElement>) => {
    setMsg(evt.target.value);
    if (evt.target.value !== "" && !stillTyping) {
      send("#1512BA", node, peerId!, peerPubKey);
      setStillTyping(true);
    }
    if (evt.target.value === "" && stillTyping) {
      send("#1512AB", node, peerId!, peerPubKey);
      setStillTyping(false);
    }
  };

  return (
    <VStack align="center" w="100vw">
      {!chatOn && (
        <>
          <Box d="flex" alignItems="baseline">
            <Skeleton isLoaded={!loading && id !== ""}>
              <HashedBotIdenticon identifier={id} />
            </Skeleton>
            <Skeleton isLoaded={!loading && id !== ""}>
              <Box align="center">
                <QRCode value={id ? id : ""} size={200} />
                <Text
                  mt={2}
                  whiteSpace="nowrap"
                  overflow="hidden"
                  textOverflow="ellipsis"
                  w="200px"
                  cursor="pointer"
                  onClick={onCopy}
                >
                  {node && node.peerId.toJSON().pubKey}
                </Text>
              </Box>
            </Skeleton>
          </Box>
          <Box d="flex" alignItems="baseline">
            <Skeleton isLoaded={remotePeerKeyString !== ""}>
              <HashedBotIdenticon identifier={remotePeerKeyString} />
            </Skeleton>
            <Box align="center">
              <Textarea
                height="200px"
                width="200px"
                value={remotePeerKeyString}
                placeholder="Peer's Public Key"
                type="password"
                onChange={(evt) => setRemote(evt.target.value)}
              />
              <HStack>
                <Button onClick={getKey}>Find a friend</Button>
                <Button onClick={() => setOpen(true)}>Read QR Code</Button>
              </HStack>
            </Box>
          </Box>
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
                      identifier={msg.from === "me" ? id : remotePeerKeyString}
                      size={48}
                    />
                    <Text>{msg.message}</Text>
                  </HStack>
                );
              })}
            {showTyping && (
              <HStack>
                <HashedBotIdenticon
                  identifier={remotePeerKeyString}
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
            <HashedBotIdenticon identifier={id} size={48} />
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
              isDisabled={msg === "" || !peerId}
              onClick={sendMessage}
              icon={<BiSend />}
            />
          </HStack>
        </Box>
      )}
      <Modal isOpen={open} onClose={() => setOpen(false)}>
        <ModalOverlay>
          <ModalContent>
            <ModalBody>
              <QrReader
                delay={300}
                onError={(err: any) => console.log(err)}
                onScan={(res: any) => {
                  setRemote(res);
                  if (res) setOpen(false);
                }}
                style={{ width: "100%" }}
              />
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      </Modal>
      <Modal isCentered closeOnEsc={false} isOpen={dialing} onClose={() => { }}>
        <ModalOverlay>
          <ModalContent>
            <ModalBody>
              <Center h="50px">
                <Spinner mr="10px"/>
                <Text>Phoning a friend</Text>
              </Center>
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </VStack>
  );
}
