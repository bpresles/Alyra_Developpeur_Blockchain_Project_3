import { useEffect, useState } from "react"
import useEthContext from "../../hooks/useEthContext";

const WinningProposal = () => {

    const { state: { contract, accounts } } = useEthContext();
    const [winningProposal, setWinningProposal] = useState();
    const [winningProposalId, setWinningProposalId] = useState(0);

    useEffect(() => {
        (async () => {
            const winningProposalId = await contract.methods.winningProposalID().call({from: accounts[0]})

            if (winningProposalId > 0) {
                const winningProposal = await contract.methods.getOneProposal(winningProposalId).call({from: accounts[0]})
                setWinningProposal(winningProposal)
                setWinningProposalId(winningProposalId)

                console.log(winningProposalId);
            }
        })()
    }, [accounts, contract, setWinningProposal, setWinningProposalId])

    return (
        <div>
            {winningProposal ?
            `The winning proposal is ${winningProposalId}: ${winningProposal.description}`
            : 'No winning proposal for now' }
        </div>
    )
}

export default WinningProposal