import { useState } from "react";
import useEthContext from "../../hooks/useEthContext";
import { getRPCErrorMessage } from "../Common/error";

const MakeProposalForm = () => {
    const { state: { contract, accounts } } = useEthContext()
    const [proposalSubmitted, setProposalSubmitted] = useState(0)
    const [proposalDesc, setProposalDesc] = useState('')
    const [error, setError] = useState('')

    const handleProposalDescChange = e => {
        setProposalDesc(e.target.value);
    }

    const handleMakeProposal = async () => {
        try {
            await contract.methods.addProposal(proposalDesc).call({from: accounts[0]})
            const proposalCall = await contract.methods.addProposal(proposalDesc).send({from: accounts[0]})
            setProposalSubmitted(proposalCall.events.ProposalRegistered.returnValues.proposalId)
        }
        catch (err) {
            console.log(err)
            setError(getRPCErrorMessage(err))
        }
    }

    return (
        <>
            {error ? <div className="error">{error}</div> : '' }
            { !error ? 
                <>
            <label htmlFor="proposal">Proposal: </label>
            <input type="text" name="proposal" value={proposalDesc} onChange={handleProposalDescChange}></input>
            <button onClick={handleMakeProposal}>Make proposal</button>
            &nbsp;<span>{proposalSubmitted > 0 ? `Your proposal has been submitted successfully with ID: ${proposalSubmitted}` : ''}</span>
            </> : <></>
            }
        </>
    )

}

export default MakeProposalForm