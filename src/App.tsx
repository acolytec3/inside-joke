import React from "react";
import Libp2p from "libp2p";
import WS from "libp2p-websockets";
import { NOISE } from "libp2p-noise";
import gossip from "libp2p-gossipsub";
import pipe from "it-pipe";
import mplex from "libp2p-mplex";
import PeerID from "peer-id";
import WStar from "libp2p-webrtc-star";
import crypto from "libp2p-crypto";
import QRCode from 'qrcode.react';
import QrReader from 'react-qr-scanner'
import {
  Box,
  Button,
  Heading,
  HStack,
  Input,
  Skeleton,
  Text,
  useClipboard,
  VStack, Modal, ModalOverlay, ModalContent, ModalBody
} from "@chakra-ui/react";
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
  const [remotePeerKeyString, setRemote] = React.useState<string>();
  const [peerId, setRemotePeerID] = React.useState<PeerID>();
  const [peerPubKey, setPubKey] = React.useState<RsaPublicKey>();
  const [messageList, updateList] = React.useState<string[]>([]);
  const [open, setOpen] = React.useState(false);
  const { onCopy } = useClipboard(id);

  React.useEffect(() => {
    const getKey = async () => {
      if (remotePeerKeyString) {
        let peer = await PeerID.createFromPubKey(remotePeerKeyString);
        let key = crypto.keys.unmarshalPublicKey(peer.marshalPubKey());
        setRemotePeerID(peer);
        //@ts-ignore
        setPubKey(key as RsaPublicKey);
      }
    };
    if (remotePeerKeyString) {
      getKey();
    }
  }, [remotePeerKeyString]);

  const receive = async (stream: any) => {
    let pk = await crypto.keys.unmarshalPrivateKey(
      node.peerId.marshalPrivKey()
    );

    pipe(stream.source, async function (source) {
      let message = "";
      for await (const msg of source) {
        message += msg.toString("utf8");
      }
      console.log(message);
      let arrayer = new Uint8Array(message.match(/.{1,2}/g)!.map((byte: string) => parseInt(byte, 16))
      );
      let newList = [...messageList];
      //@ts-ignore
      newList.push(new TextDecoder().decode(pk.decrypt(arrayer)));
      updateList(newList);
    });
  };

  const startUp = async () => {
    setLoading(true);
    let nodeId = await PeerID.create({ bits: 1024, keyType: "RSA" });
    let nodeOptions = { ...options, peerId: nodeId };
    if (node && node.isStarted) await node.stop();
    //@ts-ignore
    node = await Libp2p.create(nodeOptions);

    await node.handle("/browser/json", async ({ stream }) => {
      receive(stream);
    });
    await node.start();
    setId(node.peerId.toJSON().pubKey!);
    console.log("listening on: " + node.peerId.toB58String());
    setLoading(false);
  };

  const sendMessage = async () => {
    if (peerId) {
      let found = await node.peerStore.get(peerId);
      //@ts-ignore
      let encryptedMessage = peerPubKey.encrypt(new TextEncoder().encode(msg));
      let hexEncMsg = encryptedMessage.reduce(
        (str: string, byte: number) => str + byte.toString(16).padStart(2, "0"),
        ""
      );
      if (msg) {
        let newList = [...messageList];
        newList.push(msg);
        updateList(newList);
      }
      if (found && found.addresses.length > 0 && msg && node) {
        try {
          const { stream } = await node.dialProtocol(peerId, ["/browser/json"]);
          pipe(hexEncMsg, stream);
        } catch (err) {
          console.log(err);
        }
      }
    }
  };

  return (
    <VStack align="center" w="100vw">
      <Heading>Inside Joke</Heading>
      <Button onClick={() => startUp()}>Start Node</Button>
      <Button onClick={() => setOpen(true)}>Read QR Code</Button>
      <HStack>
        <Text>Node ID:</Text>
        <Skeleton isLoaded={!loading && id !== ""}>
          <Text whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis" w="200px" cursor="pointer" onClick={onCopy}>
            {node && node.peerId.toJSON().pubKey}
          </Text>
        </Skeleton>
        <Skeleton isLoaded={!loading && id !== ""}>
          <QRCode value={id ? id : ''} />
        </Skeleton>
      </HStack>
      <Input
        value={remotePeerKeyString}
        placeholder="Target Listener address"
        onChange={(evt) => setRemote(evt.target.value)}
      />
      {node && node.isStarted && (
        <Box>
          <Input value={msg} onChange={(evt) => setMsg(evt.target.value)} />
          <Button onClick={sendMessage}>Send Message</Button>
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
