import { useState } from "react";
import useEthContext from "../../hooks/useEthContext";

const ResetVotingSession = () => {
    const { state: {contract, accounts} } = useEthContext();
    const [resetStatus, setResetStatus] = useState(false);

    const resetVote = async () => {
        const resetResult = await contract.methods.resetVotingProcess().send({from: accounts[0]});
        setResetStatus(resetResult.events.VotingSessionReinitialized.returnValues.reset)
    };

    return (
        <div>
            <button onClick={resetVote}>Reset Vote</button>&nbsp;<span>{resetStatus ? 'Done' : ''}</span>
        </div>
    );
}

export default ResetVotingSession;
