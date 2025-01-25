import { Button } from "@components/inputs/Button";
import Modal from "@components/base/Modal";
import { useAuth } from "@libs/useAuth";
import Image from "next/image";
import { IoCall } from "react-icons/io5";
import Ring from "@public/sounds/ring.wav";
import { useCallback, useEffect, useState } from "react";
import {
  useApolloClient,
  useMutation,
  useQuery,
  useSubscription,
} from "@apollo/client";
import { CALL_USER } from "@graphql/messages/call";
import { RECEIVED_CALL } from "@graphql/messages/receivedCall";
import { Call } from "@graphql/__generated/graphql";
import MeetingContainer from "@components/meeting/MeetingContainer";
import { GET_MEETING_FOR_CHANNEL_NAME } from "@graphql/messages/getMeetingForChannelName";
import md5 from "md5";
import { useChat } from "@libs/useChat";
import Box from "@components/base/Box";
import UserIcon from '@public/images/user-icon.png'

const useCallReceiver = () => {
  const { profile } = useAuth();

  const [incomingCall, setIncomingCall] = useState<Call | undefined>();
  useSubscription(RECEIVED_CALL, {
    variables: { myUserId: profile?.userId! },
    onData: (data) => {
      if (data.data.data?.receivedCall && !incomingCall) {
        setIncomingCall(data.data.data?.receivedCall);
      }
    },
  });
  return { incomingCall, setIncomingCall };
};

const CallContainer = ({
  userIds,
  leftCall,
}: {
  userIds: string[];
  leftCall?: () => void;
}) => {
  const channelName = md5(userIds.sort().join("|"));
  const { data, loading } = useQuery(GET_MEETING_FOR_CHANNEL_NAME, {
    variables: { channelName: channelName },
  });

  return (
    <Box loading={loading} className="w-screen fixed top-0 left-0" style={{ height: 'calc(100vh - 90px)' }}>
      <MeetingContainer
        className="w-full h-full"
        channel={channelName}
        token={data?.getMeetingForChannelName!}
        autoJoin={true}
        leftCall={leftCall}
      />
    </Box>
  );
};

const CallModal = () => {
  const { callingUser, call } = useChat();

  const client = useApolloClient();
  const [callUser] = useMutation(CALL_USER);

  const { incomingCall, setIncomingCall } = useCallReceiver();

  useEffect(() => {
    if (callingUser !== undefined) {
      client.mutate({
        mutation: CALL_USER,
        variables: {
          userId: callingUser.userId,
        },
      });
    }
  }, [callingUser, client]);

  const shouldShow = callingUser !== undefined || incomingCall != null;

  const InnerModal = () => {
    if (callingUser?.userId === incomingCall?.from.userId) {
      return (
        <CallContainer
          userIds={[callingUser?.userId!, incomingCall?.to.userId!]}
          leftCall={() => {
            setIncomingCall(undefined);
            call?.(undefined);
          }}
        />
      );
    }
    if (callingUser) {
      return (
        <Box className="flex flex-col items-center justify-center">
          <Image
            src={callingUser?.profileImage??UserIcon}
            width={500}
            height={500}
            alt="profileImage"
            className="w-16 h-16 rounded-full object-cover"
          />
          <Box className="flex justify-center space-x-4 items-center text-xl py-8">
            <IoCall className="animate-ping text-green-500" />
            <Box>Calling {callingUser?.name}</Box>
          </Box>
          <Button
            title="Hang Up"
            className="w-full"
            type="danger"
            onClick={() => call?.(undefined)}
          />
        </Box>
      );
    }
    return (
      <Box className="flex flex-col items-center justify-center">
        <Image
          src={incomingCall?.from.profileImage??UserIcon}
          width={500}
          height={500}
          alt="profileImage"
          className="w-16 h-16 rounded-full object-cover"
        />
        <Box className="flex justify-center space-x-4 items-center text-xl py-8">
          <IoCall className="animate-ping text-green-500" />
          <Box>{incomingCall?.from.name} Calling...</Box>
        </Box>
        <Box className="flex space-x-2 w-full">
          <Button
            title="Decline"
            type="danger"
            className="flex-1"
            onClick={() => setIncomingCall?.(undefined)}
          />
          <Button
            title="Accept"
            type="success"
            className="flex-1"
            onClick={async () => {
              await callUser({
                variables: {
                  userId: incomingCall?.from?.userId!,
                },
              });
              call?.(incomingCall?.from!);
            }}
          />
        </Box>
      </Box>
    );
  };

  return (
    <Modal
      closeButton={false}
      show={shouldShow}
      setShow={(show) => {
        if (!show) {
          call?.(undefined);
        }
      }}
    >
      <InnerModal />
    </Modal>
  );
};

export default CallModal;
