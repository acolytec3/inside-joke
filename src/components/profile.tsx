import React from "react";
import GlobalContext from "../context/globalContext";
import { Box, Skeleton, Text, useClipboard } from "@chakra-ui/react";
import { HashedBotIdenticon } from "@digitalungdom/bot-identicon";
import QRCode from "qrcode.react";

const Profile = () => {
  const [loading, setLoading] = React.useState(true);
  const [id, setId] = React.useState<string>("");
  const { state } = React.useContext(GlobalContext);
  const { onCopy } = useClipboard(id);

  React.useEffect(() => {
    let mounted = true;
    console.log(state.libp2p);
    if (state.libp2p?.peerId && mounted) {
      setId(state.libp2p.peerId.toJSON().privKey!);
      setLoading(false);
    }
    return () => {
      mounted = false;
    };
  }, [state.libp2p]);

  return (
    <Box d="flex" alignItems="baseline">
      <Skeleton isLoaded={!loading && id !== ""}>
        <HashedBotIdenticon identifier={id} />
      </Skeleton>
      <Skeleton isLoaded={!loading && id !== ""}>
        <Box align="center" marginY={5}>
          <QRCode value={id ? id : ""} size={400} />
          <Text
            mt={2}
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
            w="200px"
            cursor="pointer"
            onClick={onCopy}
          >
            {state.libp2p && state.libp2p.peerId.toJSON().pubKey}
          </Text>
        </Box>
      </Skeleton>
    </Box>
  );
};

export default Profile;
