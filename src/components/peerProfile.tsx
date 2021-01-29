import {
  Box,
  Button,
  Center,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Skeleton,
  Spinner,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { HashedBotIdenticon } from "@digitalungdom/bot-identicon";
import PeerId from "peer-id";
import React from "react";
import GlobalContext from "../context/globalContext";
import crypto from "libp2p-crypto";
import { RsaPublicKey } from "crypto";
import QrReader from "react-qr-scanner";

interface PeerProps {
  chatOff: () => void;
}

const PeerProfile: React.FC<PeerProps> = ({ chatOff }) => {
  const { state, dispatch } = React.useContext(GlobalContext);
  const [dialing, setDialing] = React.useState(false);
  const [remote, setRemote] = React.useState<string>("");
  const [open, setOpen] = React.useState(false);
  const toast = useToast();

  const getKey = async () => {
    if (remote) {
      setDialing(true);
      let peer: PeerId;
      let key: crypto.PrivateKey;
      try {
        peer = await PeerId.createFromPrivKey(remote);
        console.log(peer)
        key = await crypto.keys.unmarshalPrivateKey(peer.marshalPrivKey());
        console.log(key)
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
          console.log("ping ", await state.libp2p?.ping(peer));
          connected = true;
        } catch (err) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
          console.log("Error!", err);
        }
      } while (Date.now() - time < 5000 && !connected);
      if (connected) {
        dispatch({
          type: "SET_PEER",
          payload: {
            remotePeer: peer,
            //@ts-ignore
            remotePeerPubKey: key as RsaPublicKey,
            remotePeerPubKeyString: remote,
          },
        });
        chatOff();
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

  return (
    <Box d="flex" alignItems="baseline">
      <Skeleton isLoaded={remote !== ""}>
        <HashedBotIdenticon identifier={remote} />
      </Skeleton>
      <Box align="center">
        <Textarea
          height="200px"
          width="200px"
          value={remote}
          placeholder="Peer's Public Key"
          type="password"
          onChange={(evt) => setRemote(evt.target.value)}
        />
        <HStack>
          <Button onClick={getKey}>Find a friend</Button>
          <Button onClick={() => setOpen(true)}>Read QR Code</Button>
        </HStack>
      </Box>
      <Modal isCentered closeOnEsc={false} isOpen={dialing} onClose={() => {}}>
        <ModalOverlay>
          <ModalContent>
            <ModalBody>
              <Center h="50px">
                <Spinner mr="10px" />
                <Text>Phoning a friend</Text>
              </Center>
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      </Modal>
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
    </Box>
  );
};

export default PeerProfile;
