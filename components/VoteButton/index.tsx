import { livepeerGovernor } from "@lib/api/abis/main/LivepeerGovernor";
import { poll } from "@lib/api/abis/main/Poll";
import { getLivepeerGovernorAddress } from "@lib/api/contracts";
import { Button } from "@livepeer/design-system";
import { useAccountAddress, useHandleTransaction } from "hooks";
import {
  Address,
  UsePrepareContractWriteConfig,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";

import { useMemo } from "react";
import { useLivepeerGovernorAddress } from "hooks/useContracts";

type Props = React.ComponentProps<typeof Button> & {
  pollAddress?: Address;
  proposalId?: string;
  choiceId: number;
  reason?: string;
};


const Index = ({
  pollAddress,
  proposalId,
  choiceId,
  reason,
  children,
  ...props
}: Props) => {
  const accountAddress = useAccountAddress();
  const { data: livepeerGovernorAddress } = useLivepeerGovernorAddress();

  const preparedWriteConfig = useMemo<UsePrepareContractWriteConfig>(() => {
    if (proposalId) {
      const hasReason = typeof reason === "string" && reason.length > 3;
      return {
        enabled: Boolean(accountAddress && livepeerGovernorAddress),
        address: livepeerGovernorAddress,
        abi: livepeerGovernor,
        functionName: hasReason ? "castVoteWithReason" : "castVote",
        args: hasReason
          ? [BigInt(proposalId), choiceId, reason]
          : [BigInt(proposalId), choiceId],
      };
    }
    return {
      enabled: Boolean(pollAddress && accountAddress),
      address: pollAddress,
      abi: poll,
      functionName: "vote",
      args: [BigInt(choiceId)],
    };
  }, [
    livepeerGovernorAddress,
    proposalId,
    pollAddress,
    choiceId,
    accountAddress,
    reason,
  ]);

  const { config } = usePrepareContractWrite(preparedWriteConfig);
  const { data, isLoading, write, error, isSuccess } = useContractWrite(config);

  useHandleTransaction("vote", data, error, isLoading, isSuccess, {
    choiceId,
    choiceName: proposalId
      ? { 0: "Against", 1: "For", 2: "Abstain" }[choiceId]
      : { 0: "No", 1: "Yes" }[choiceId],
    reason,
  });

  if (!accountAddress) {
    return null;
  }

  return (
    <Button onClick={write} {...props}>
      {children}
    </Button>
  );
};

export default Index;
