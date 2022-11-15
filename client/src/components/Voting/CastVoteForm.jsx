import { useEffect, useState } from "react";
import useEthContext from "../../hooks/useEthContext";
import { getRPCErrorMessage } from "../Common/error";

const CastVoteForm = () => {
    const { state: { contract, accounts } } = useEthContext()

    const [proposalSelected, setProposalSelected] = useState(1)
    const [proposals, setProposals] = useState([{description: 'GENESIS'}]);
    const [voteSubmitted, setVoteSubmitted] = useState(0);
    const [error, setError] = useState('');

    useEffect(() => {
        (async () => {
            try {
                setError('')
                setProposals([{description: 'GENESIS'}])

                // Find all proposals submitted in the contract since last reset.
                const initialVoteSessionBlock = await contract.methods.votingSessionStartBlock().call({ from: accounts[0] })
                let oldEvents = await contract.getPastEvents('ProposalRegistered', {
                            fromBlock: initialVoteSessionBlock,
                            toBlock: 'latest'
                });

                console.log(oldEvents)

                if (oldEvents && oldEvents.length > 0) {
                    oldEvents.map(async event => {
                        const proposal = await contract.methods.getOneProposal(event.returnValues.proposalId).call({ from: accounts[0] })
                        setProposals(current => [...current, proposal])
                    });
                }
            }
            catch (e) {
                const reason = getRPCErrorMessage(e);
                setError(reason);
            }
        })()
    }, [contract, accounts, setProposals])

    const handleProposalSelect = (e) => {
        console.log(proposals)
        setProposalSelected(e.target.value)
    };

    const submitVote = async () => {
        try {
            await contract.methods.setVote(proposalSelected).call({from: accounts[0]})
            const voteResult = await contract.methods.setVote(proposalSelected).send({from: accounts[0]})

            const proposalIdVoted = voteResult.events.Voted.returnValues.proposalId
            setVoteSubmitted(proposalIdVoted)
        } 
        catch(err) {
            console.log(err);
            setError(getRPCErrorMessage(err))
        }
    }

    return (
        <>
            { proposals.length > 0 ? 
                <>
                    <select name="proposalSelect" value={proposalSelected} onChange={handleProposalSelect}>
                        {(proposals).map((proposal, index) => {
                            // Index 0 is genesis proposal
                            if (index > 0) {
                                return (<option key={index} value={index}>{proposal.description}</option>)
                            }
                        })}
                    </select>
                    <button onClick={submitVote}>Submit my vote</button>
                    &nbsp;<span>{voteSubmitted ? `Your vote for proposal id ${voteSubmitted} has been submitted successfully` : error ? error : '' }</span>
                </>
                : <></>
            }
        </>
    );
}

export default CastVoteForm;