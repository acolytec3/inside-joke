import { pipe } from 'it-pipe'
import crypto from 'libp2p-crypto'
import libp2p from 'libp2p'
import PeerId from 'peer-id';

export const receive = async (stream: any, node: libp2p): Promise<string> => {
    let pk = await crypto.keys.supportedKeys.rsa.unmarshalRsaPrivateKey(
      node.peerId.marshalPrivKey()
    );
    let decryptedMsg = '';
    await pipe(stream.source, async function (source) {
      let message = "";
      for await (const msg of source) {
        message += msg.toString("utf8");
      }
      let decryptedMsgArray = new Uint8Array(message.match(/.{1,2}/g)!.map((byte: string) => parseInt(byte, 16))
      );
      decryptedMsg = new TextDecoder().decode(pk.decrypt(decryptedMsgArray));
    });
    return decryptedMsg;
  };

export const send = async (msg: string, node: libp2p, peerId: PeerId, peerPubKey: crypto.keys.supportedKeys.rsa.RsaPublicKey) => {
    if (peerId) {
      let found = await node.peerStore.get(peerId);
      let encryptedMessage = peerPubKey.encrypt(new TextEncoder().encode(msg));
      let hexEncMsg = encryptedMessage.reduce(
        (str: string, byte: number) => str + byte.toString(16).padStart(2, "0"),
        ""
      );
      if (found && found.addresses.length > 0 && msg && node) {
        try {
          const { stream } = await node.dialProtocol(peerId, ["/encryptedChat/1.0"]);
          pipe(hexEncMsg, stream);
        } catch (err) {
          console.log(err);
        }
      }
    }
  };