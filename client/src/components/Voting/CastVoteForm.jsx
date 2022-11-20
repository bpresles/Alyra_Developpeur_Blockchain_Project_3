import { Box, Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";
import { useEffect, useState } from "react";
import { actions } from "../../contexts/EthContext/state";
import useEthContext from "../../hooks/useEthContext";
import { getRPCErrorMessage } from "../Common/error";
import SnackbarAlert from "../Common/SnackbarAlert";

const CastVoteForm = () => {
    const { state: { contract, accounts }, dispatch } = useEthContext()

    const [proposalSelected, setProposalSelected] = useState(1)
    const [proposals, setProposals] = useState([{description: 'GENESIS'}]);

    const [open, setOpen] = useState(false)
    const [message, setMessage] = useState('')
    const [severity, setSeverity] = useState('success')

    useEffect(() => {
        (async () => {
            try {
                setProposals([{description: 'GENESIS'}])

                // Find all proposals submitted in the contract since last reset.
                const initialVoteSessionBlock = await contract.methods.votingSessionStartBlock().call({ from: accounts[0] })
                let oldEvents = await contract.getPastEvents('ProposalRegistered', {
                            fromBlock: initialVoteSessionBlock,
                            toBlock: 'latest'
                });

                if (oldEvents && oldEvents.length > 0) {
                    oldEvents.map(async event => {
                        const proposal = await contract.methods.getOneProposal(event.returnValues.proposalId).call({ from: accounts[0] })
                        setProposals(current => [...current, proposal])
                    });
                }
            }
            catch (e) {
                const reason = getRPCErrorMessage(e);
                setMessage(reason)
                setSeverity('error')
                setOpen(true)
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
                .on("transactionHash", async (transactionHash) => {
                    setMessage('Vote in progress')
                    setSeverity('success')
                    setOpen(true)
            
                    dispatch({
                        type: actions.tx,
                        data: { transactionHash }
                    })
                })

            const proposalIdVoted = voteResult.events.Voted.returnValues.proposalId
            
            if (proposalIdVoted > 0) {
                setMessage('Vote submitted')
                setSeverity('success')
            } else {
                setMessage('Error while submitting your vote')
                setSeverity('error')
            }

            dispatch({
                type: actions.tx,
                data: { transactionHash: '' }
            })
        } 
        catch(err) {
            console.log(err);
            setMessage(getRPCErrorMessage(err))
            setSeverity('error')

            dispatch({
                type: actions.tx,
                data: { transactionHash: '' }
            })
        }

        setOpen(true)
    }

    return (
        <>
        { proposals.length > 0 ? 
            <Box
                component="form"
                sx={{
                    '& > :not(style)': { m: 1, width: '40ch' },
                }}
                noValidate
                autoComplete="off"
            >
                
                <FormControl>
                    <FormLabel>Choose a proposal</FormLabel>
                    <RadioGroup defaultValue={proposalSelected} onChange={handleProposalSelect}>
                        {(proposals).map((proposal, index) => {
                            // Index 0 is genesis proposal
                            if (index > 0) {
                                return (<FormControlLabel value={index} control={<Radio />} label={proposal.description} />)
                            }
                            return (<></>)
                        })}
                    </RadioGroup>
                    <Button onClick={submitVote} variant="contained">Vote</Button>
                    <SnackbarAlert open={open} setOpen={setOpen} message={message} severity={severity} />
                </FormControl>
            </Box>
            : <></>
        }
    </>
    );
}

export default CastVoteForm;