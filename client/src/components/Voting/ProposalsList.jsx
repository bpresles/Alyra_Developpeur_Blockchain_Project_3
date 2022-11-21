import { useEffect, useState } from "react";
import useEthContext from "../../hooks/useEthContext";
import { getRPCErrorMessage } from "../Common/error";
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

const ProposalsList = () => {
    const { state: { contract, accounts } } = useEthContext()
    const [proposals, setProposals] = useState({})

    useEffect(() => {
        const addPropositionToList = async (proposalId) => {
            // Only add proposal if it's not already added
            if (!proposals[proposalId]) {
                const proposal = await contract.methods.getOneProposal(proposalId).call({ from: accounts[0] })
                const proposalInfos = {}
                proposalInfos[proposalId] = proposal
                setProposals(current => {
                    return {...current, ...proposalInfos}
                });
            }
        }

        (async () => {
            try {
                // Find all proposals submitted in the contract since last reset.
                const initialVoteSessionBlock = await contract.methods.votingSessionStartBlock().call({ from: accounts[0] })
                let oldEvents = await contract.getPastEvents('ProposalRegistered', {
                    fromBlock: initialVoteSessionBlock,
                    toBlock: 'latest'
                });

                if (oldEvents && oldEvents.length > 0) {
                    oldEvents.map(async event => {
                        addPropositionToList(event.returnValues.proposalId)
                    });
                }

                await contract.events.ProposalRegistered({fromBlock: 'earliest'})
                    .on('data', async event => {
                        addPropositionToList(event.returnValues.proposalId)
                    })
                    .on('changed', changed => console.log(changed))
                    .on('error', error => console.log(error))
                    .on('connected', str => console.log(str))
            }
            catch (e) {
                const reason = getRPCErrorMessage(e);
                console.log(reason)
            }
        })()
    }, [contract, accounts, proposals, setProposals])

    return (
        <Box sx={{ width: '100%' }}>
            {proposals && Object.keys(proposals).length > 0 &&
            <>
                <p>Proposals submitted :</p>
                <List>
                {
                    (Object.keys(proposals)).map((proposalId) => {
                        return (
                            <ListItem key={proposalId}>
                                <ListItemText primary={proposals[proposalId].description} />
                            </ListItem>
                        )
                    })
                }
                </List>
            </>
            }
        </Box>
    )
}

export default ProposalsList
