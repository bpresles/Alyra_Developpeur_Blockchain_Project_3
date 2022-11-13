import { useEffect, useState } from "react";
import useEthContext from "../../hooks/useEthContext";

const MakeProposalForm = () => {
    const { state: { contract, accounts } } = useEthContext()
    const [proposalSubmitted, setProposalSubmitted] = useState(0)
    const [proposalDesc, setProposalDesc] = useState('')

    useEffect(() => {
        (async () => {
            await contract.events.ProposalRegistered({fromBlock: 'earliest'})
            .on('data', event => {
                let eventVal = parseInt(event.returnValues.proposalId);
                setProposalSubmitted(eventVal);
                console.log(eventVal);
            })
            .on('changed', changed => console.log(changed))
            .on('error', error => console.log(error))
            .on('connected', str => console.log(str));
        })()
    }, [contract, accounts, setProposalSubmitted])

    const handleProposalDescChange = e => {
        setProposalDesc(e.target.value);
    }

    const handleMakeProposal = async () => {
        await contract.methods.addProposal(proposalDesc).send({from: accounts[0]})
    }

    return (
        <>
            <label htmlFor="proposal">Proposal: </label>
            <input type="text" name="proposal" value={proposalDesc} onChange={handleProposalDescChange}></input>
            <button onClick={handleMakeProposal}>Make proposal</button>
            &nbsp;<span>{proposalSubmitted > 0 ? `Your proposal has been submitted successfully with ID: ${proposalSubmitted}` : ''}</span>
        </>
    )

}

export default MakeProposalForm