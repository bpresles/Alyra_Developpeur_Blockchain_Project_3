import { useState } from "react";
import useEthContext from "../../hooks/useEthContext";

const GetVoter = () => {
    const { state: { contract, owner } } = useEthContext();

    const [voterAddress, setVoterAddress] = useState('');
    const [voter, setVoter] = useState('');

    const handleVoterAddress = e => {
        setVoterAddress(e.target.value);
    }

    const handleGetVoter = async () => {
        const voter = await contract.methods.getVoter(voterAddress).call({from: owner});
        console.log(voter.isRegistered);
        setVoter(voter);
    }

    return (
        <>
            <input type="text" value={voterAddress} onChange={handleVoterAddress} />
            <button onClick={handleGetVoter}>Get voter</button>
            { voter ? <div>Has voted ? {voter.hasVoted ? 'yes' : 'no'}</div> : <></>}
            { voter && voter.hasVoted ? <div>Voted proposal id: {voter.votedProposalId}</div> : <></>}
        </>
    );
}

export default GetVoter;