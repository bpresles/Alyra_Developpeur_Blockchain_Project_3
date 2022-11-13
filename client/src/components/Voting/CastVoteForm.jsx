import { useEffect, useState } from "react";
import useEthContext from "../../hooks/useEthContext";
import { getRPCErrorMessage } from "../Common/error";

const CastVoteForm = () => {
    const { state: { web3, contract, accounts } } = useEthContext()

    const [proposalSelected, setProposalSelected] = useState(1)
    const [proposals, setProposals] = useState([]);
    const [voteSubmitted, setVoteSubmitted] = useState(0);
    const [error, setError] = useState('');

    useEffect(() => {
        (async () => {
            try {
                setError('');
                const proposalsResult = await contract.methods.getAllProposals().call({from: accounts[0]})
                console.log(proposalsResult)
                setProposals(proposalsResult)
            }
            catch (e) {
                const reason = getRPCErrorMessage(e);
                setError(reason);
            }

            await contract.events.Voted({fromBlock: 'earliest'})
            .on('data', event => {
              let eventVal = event.returnValues.proposalId;
              setVoteSubmitted(eventVal);
              console.log(eventVal);
            })
            .on('changed', changed => console.log(changed))
            .on('error', error => console.log(error))
            .on('connected', str => console.log(str));
        })()
    }, [contract, accounts, setProposals])

    const handleProposalSelect = (e) => {
        setProposalSelected(e.target.value)
    };

    const submitVote = async () => {
        await contract.methods.setVote(proposalSelected).send({from: accounts[0]})
    }

    return (
        <>
            {error ? <div className="error">{error}</div> : '' }
            { !error ? 
                <>
                    <select name="proposalSelect" value={proposalSelected} onChange={handleProposalSelect}>
                        {(proposals).map((proposal, index) => {
                            if (index > 0)
                                return (<option key={index} value={index}>{proposal.description}</option>)
                        })}
                    </select>
                    <button onClick={submitVote}>Submit my vote</button>
                    &nbsp;<span>{voteSubmitted ? `Your vote for proposal id ${voteSubmitted} has been submitted successfully` : '' }</span>
                </>
                : <></>
            }
        </>
    );
}

export default CastVoteForm;