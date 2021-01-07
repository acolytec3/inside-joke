import React from "react";
import Libp2p from "libp2p";
import WS from "libp2p-websockets";
import { NOISE } from "libp2p-noise";
import gossip from "libp2p-gossipsub";
import mplex from "libp2p-mplex";
import PeerID from "peer-id";
import WStar from "libp2p-webrtc-star";
import crypto from "libp2p-crypto";
import QRCode from 'qrcode.react';
import QrReader from 'react-qr-scanner'
import { HashedBotIdenticon } from '@digitalungdom/bot-identicon'

import {
  Box,
  Button,
  Heading,
  Input,
  Skeleton,
  Text,
  useClipboard,
  VStack, Modal, ModalOverlay, ModalContent, ModalBody
} from "@chakra-ui/react";

import { send, receive} from './providers/encryptedChat'

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
    //  "/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star",
    //  "/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star",
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
  const [remotePeerKeyString, setRemote] = React.useState<string>();
  const [peerId, setRemotePeerID] = React.useState<PeerID>();
  const [peerPubKey, setPubKey] = React.useState<RsaPublicKey>();
  const [messageList, updateList] = React.useState<string[]>([]);
  const [open, setOpen] = React.useState(false);
  const { onCopy } = useClipboard(id);

  React.useEffect(() => {
    console.log(messageList)
  },[messageList])
  const getKey = async () => {
      if (remotePeerKeyString) {
        let peer = await PeerID.createFromPubKey(remotePeerKeyString);
        let key = crypto.keys.unmarshalPublicKey(peer.marshalPubKey());
        setRemotePeerID(peer);
        setRemote('')
        //@ts-ignore
        setPubKey(key as RsaPublicKey);
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
      console.log(messageList)
      let mes = await receive(stream, node);
      updateList(messages => [...messages, mes])
    });
    await node.start();
    setId(node.peerId.toJSON().pubKey!);
    console.log("listening on: " + node.peerId.toB58String());
    setLoading(false);
  };

  return (
    <VStack align="center" w="100vw">
      <Heading>Inside Joke</Heading>
      <Button onClick={() => startUp()}>Start Node</Button>
      <Button onClick={() => setOpen(true)}>Read QR Code</Button>
      <VStack>
        <Heading size="sm">Public Key</Heading>
        <Skeleton isLoaded={!loading && id !== ""}>
          {/*@ts-ignore*/}
          <HashedBotIdenticon identifier={id} />
          <Text whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis" w="200px" cursor="pointer" onClick={onCopy}>
            {node && node.peerId.toJSON().pubKey}
          </Text>
        </Skeleton>
        <Skeleton isLoaded={!loading && id !== ""}>
          <QRCode value={id ? id : ''} />
        </Skeleton>
      </VStack>
      <Input
        value={remotePeerKeyString}
        placeholder="Peer's Public Key"
        onChange={(evt) => setRemote(evt.target.value)}
      />
      <Button onClick={getKey}>Set Peer Key</Button>
      {node && node.isStarted && (
        <Box>
          <Input value={msg} onChange={(evt) => setMsg(evt.target.value)} />
          <Button isDisabled={msg === '' || !peerId} onClick={() => { send(msg!, node, peerId!, peerPubKey!); setMsg('')}}>Send Message</Button>
          {messageList.length > 0 &&
            messageList.map((msg) => {
              return <Text>{msg}</Text>;
            })}
        </Box>
      )}
      <Modal isOpen={open} onClose={() => setOpen(false)}>
        <ModalOverlay>
          <ModalContent>
            <ModalBody>
              <QrReader
                delay={300}
                onError={(err: any) => console.log(err)}
                onScan={(res: any) => { setRemote(res); if (res) setOpen(false) }}
                style={{ width: '100%' }}
              />
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </VStack>
  );
}
