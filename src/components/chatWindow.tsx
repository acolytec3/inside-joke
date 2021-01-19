import {
  Box,
  HStack,
  IconButton,
  Input,
  Skeleton,
  Text,
  useToast,
} from "@chakra-ui/react";
import { HashedBotIdenticon } from "@digitalungdom/bot-identicon";
import React from "react";
import { BiSend } from "react-icons/bi";
import GlobalContext from "../context/globalContext";
import { receive, send } from "../providers/encryptedChat";
import { NOT_TYPING, TYPING } from "../context/constants";

interface ChatProps {
  chatOn: boolean;
  chatOff: () => void;
}

const ChatWindow: React.FC<ChatProps> = ({ chatOn, chatOff }) => {
  const { state } = React.useContext(GlobalContext);
  const [msg, setMsg] = React.useState<string>();
  const [messageList, updateList] = React.useState<any[]>([]);
  const [showTyping, setTyping] = React.useState(false);
  const [stillTyping, setStillTyping] = React.useState(false);
  const toast = useToast();

  React.useEffect(() => {
    state.libp2p!.handle("/encryptedChat/1.0", async ({ stream }) => {
      let mes = await receive(stream, state.libp2p!);
      if (mes === TYPING) {
        setTyping(true);
      } else if (mes === NOT_TYPING) {
        setTyping(false);
      } else {
        updateList((messages) => [...messages, { from: "them", message: mes }]);
        setTyping(false);
      }
    });
  });

  React.useEffect(() => {
    const checkPulse = async () => {
      try {
        console.log(
          "is anybody out there?",
          await state.libp2p!.ping(state.remotePeer!)
        );
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
        chatOff();
        setMsg("");
        updateList([]);
      }
    };
    if (chatOn) {
      setTimeout(() => checkPulse(), 5000);
    }
  }, [chatOn]);

  const sendMessage = async () => {
    send(msg!, state.libp2p!, state.remotePeer!, state.remotePeerPubKey);
    updateList((messages) => [...messages, { from: "me", message: msg! }]);
    setMsg("");
    setStillTyping(false);
  };

  const typing = async (evt: React.ChangeEvent<HTMLInputElement>) => {
    setMsg(evt.target.value);
    if (evt.target.value !== "" && !stillTyping) {
      send(TYPING, state.libp2p!, state.remotePeer!, state.remotePeerPubKey);
      setStillTyping(true);
    }
    if (evt.target.value === "" && stillTyping) {
      send(
        NOT_TYPING,
        state.libp2p!,
        state.remotePeer!,
        state.remotePeerPubKey
      );
      setStillTyping(false);
    }
  };
  return (
    <Box>
      <Box position="absolute" height="100%" w="100vw" left="0px">
        {messageList.length > 0 &&
          messageList.map((msg) => {
            return (
              <HStack key={msg.message}>
                <HashedBotIdenticon
                  identifier={
                    msg.from === "me"
                      ? state.libp2p?.peerId.toJSON().pubKey!
                      : state.remotePeerPubKeyString
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
        <HashedBotIdenticon
          identifier={state.libp2p?.peerId.toJSON().pubKey!}
          size={48}
        />
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
  );
};

export default ChatWindow;
