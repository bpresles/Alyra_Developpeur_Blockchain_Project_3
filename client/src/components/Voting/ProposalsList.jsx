import { useEffect, useState } from "react";
import useEthContext from "../../hooks/useEthContext";
import { getRPCErrorMessage } from "../Common/error";
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

const ProposalsList = () => {
    const { state: { contract, accounts } } = useEthContext()
    const [proposals, setProposals] = useState([])

    useEffect(() => {
        const addPropositionToList = async (proposalId) => {
            const proposal = await contract.methods.getOneProposal(proposalId).call({ from: accounts[0] })
            setProposals(current => {
                return [...current, proposal]
            });
        }

        (async () => {
            try {
                // Find all proposals submitted in the contract since last reset.
                const initialVoteSessionBlock = await contract.methods.votingSessionStartBlock().call({ from: accounts[0] })
                await contract.events.ProposalRegistered({fromBlock: 'earliest'})
                    .on('data', async event => {
                        addPropositionToList(event.returnValues.proposalId)
                    })
                    .on('changed', changed => console.log(changed))
                    .on('error', error => console.log(error))
                    .on('connected', str => console.log(str))

                let oldEvents = await contract.getPastEvents('ProposalRegistered', {
                            fromBlock: initialVoteSessionBlock,
                            toBlock: 'latest'
                });

                if (oldEvents && oldEvents.length > 0) {
                    oldEvents.map(async event => {
                        addPropositionToList(event.returnValues.proposalId)
                    });
                }
            }
            catch (e) {
                const reason = getRPCErrorMessage(e);
                console.log(reason)
            }
        })()
    }, [contract, accounts])

    return (
        <Box sx={{ width: '100%' }}>
            <List>
            {
                (proposals).map((proposal, index) => {
                    return (<ListItem key={index}>
                        <ListItemText 
                            primary={proposal.description}
                            secondary={
                                <span>Number of votes: {proposal.voteCount}</span>
                            } />
                    </ListItem>)
                })
            }
            </List>
        </Box>
    )
}

export default ProposalsList
