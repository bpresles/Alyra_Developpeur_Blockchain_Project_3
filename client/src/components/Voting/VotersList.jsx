import { useEffect, useState } from "react";
import useEthContext from "../../hooks/useEthContext";
import { getRPCErrorMessage } from "../Common/error";
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

const VotersList = () => {
    const { state: { contract, accounts } } = useEthContext()
    const [voters, setVoters] = useState({})

    useEffect(() => {
        const addVoterToList = async (voterAddress) => {
            const voter = await contract.methods.getVoter(voterAddress).call({ from: voterAddress })
            const voterInfos = {}
            voterInfos[voterAddress] = voter
            setVoters(current => {
                return {...current, ...voterInfos}
            });
        }

        (async () => {
            try {
                // Find all proposals submitted in the contract since last reset.
                const initialVoteSessionBlock = await contract.methods.votingSessionStartBlock().call({ from: accounts[0] })
                let oldEvents = await contract.getPastEvents('VoterRegistered', {
                            fromBlock: initialVoteSessionBlock,
                            toBlock: 'latest'
                });

                console.log(oldEvents)

                if (oldEvents && oldEvents.length > 0) {
                    oldEvents.map(async event => {
                        const voterAddress = event.returnValues.voterAddress
                        if (!voters[voterAddress]) {
                            addVoterToList(voterAddress)
                        }
                    });
                }

                await contract.events.VoterRegistered({fromBlock: 'earliest'})
                    .on('data', async event => {
                        const voterAddress = event.returnValues.voterAddress
                        if (!voters[voterAddress]) {
                            addVoterToList(voterAddress)
                        }
                    })
                    .on('changed', changed => console.log(changed))
                    .on('error', error => console.log(error))
                    .on('connected', str => console.log(str))

                await contract.events.VotingSessionReinitialized({fromBlock: 'earliest'})
                    .on('data', async event => {
                        const reset = event.returnValues.reset
                        if (reset) {
                            setVoters({})
                        }
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
    }, [contract, accounts, setVoters, voters])
    
    console.log(Object.keys(voters))

    return (
        <Box sx={{ width: '100%' }}>
            <List>
            {
                (Object.keys(voters)).map((voterAddress) => {
                    return (<ListItem key={voterAddress}>
                        <ListItemText 
                            primary={voterAddress}
                            secondary={
                                <span>Has voted ? {voters[voterAddress].hasVoted ? 'Yes' : 'No'}</span>
                            } />
                    </ListItem>)
                })
            }
            </List>
        </Box>
    )
}

export default VotersList
