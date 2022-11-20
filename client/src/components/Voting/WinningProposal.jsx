import { Box, Chip } from "@mui/material";
import { useEffect, useState } from "react"
import useEthContext from "../../hooks/useEthContext";
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const WinningProposal = () => {

    const { state: { contract, accounts } } = useEthContext();
    const [winningProposal, setWinningProposal] = useState();

    useEffect(() => {
        (async () => {
            const winningProposalId = await contract.methods.winningProposalID().call({from: accounts[0]})

            if (winningProposalId > 0) {
                const winningProposal = await contract.methods.getOneProposal(winningProposalId).call({from: accounts[0]})
                setWinningProposal(winningProposal)
            }
        })()
    }, [accounts, contract, setWinningProposal])

    return (
        <Box sx={{ width: '100%', textAlign: 'center' }}>
            <Chip style={{fontSize: '14px'}} icon={<EmojiEventsIcon />} label={winningProposal ?
            (<>The winning proposal is <span style={{fontWeight: 'bold'}}>{winningProposal.description}</span></>)
            : 'No winning proposal for now' } />
        </Box>
    )
}

export default WinningProposal