import { useEffect } from "react";
import { useState } from "react";
import useEthContext from "../../hooks/useEthContext";

const ResetVotingSession = () => {
    const { state } = useEthContext();
    const contract = state.contract;
    const accounts = state.accounts;

    const [resetStatus, setResetStatus] = useState(false);

   /* useEffect(() => {

        (async () => {
            await contract.events.VotingSessionReinitialized({fromBlock: 'earliest'})
            .on('data', event => {
              let eventVal = event.returnValues.reset;
              setResetStatus(eventVal);
              console.log(eventVal);
            })
            .on('changed', changed => console.log(changed))
            .on('error', error => console.log(error))
            .on('connected', str => console.log(str));
        })();

    }, [contract, setResetStatus]);*/

    const resetVote = async () => {
        await contract.methods.resetVotingProcess().send({from: accounts[0]});
    };

    return (
        <>
            <button onClick={resetVote}>Reset Vote</button>&nbsp;<span>{resetStatus ? 'Done' : ''}</span>
        </>
    );
}

export default ResetVotingSession;
