import { Box, Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { actions, WorkflowStatus } from "../../contexts/EthContext/state";
import useEthContext from "../../hooks/useEthContext";
import { getRPCErrorMessage } from "../Common/error";
import SnackbarAlert from "../Common/SnackbarAlert";
import ProposalsList from "./ProposalsList";

const MakeProposalForm = () => {
    const { state: { contract, accounts, currentWorkflowStatus }, dispatch } = useEthContext()
    const [workflowStatus, setWorkflowStatus] = useState(currentWorkflowStatus)
    const [proposalDesc, setProposalDesc] = useState('')

    const [open, setOpen] = useState(false)
    const [message, setMessage] = useState('')
    const [severity, setSeverity] = useState('success')

    useEffect(() => {
        setWorkflowStatus(currentWorkflowStatus)
    }, [contract, accounts, dispatch, currentWorkflowStatus])

    const handleProposalDescChange = e => {
        setProposalDesc(e.target.value);
    }

    const handleMakeProposal = async () => {
        try {
            await contract.methods.addProposal(proposalDesc).call({from: accounts[0]})
            const proposalCall = await contract.methods.addProposal(proposalDesc).send({from: accounts[0]})
            .on("transactionHash", async (transactionHash) => {
                setMessage('Your proposal is being registered')
                setSeverity('success')
                setOpen(true)
        
                dispatch({
                    type: actions.tx,
                    data: { transactionHash }
                })
            })
            
            if (proposalCall.events.ProposalRegistered.returnValues.proposalId > 0) {
                setMessage('Proposal submitted successfully')
                setSeverity('success')
            } else {
                setMessage('Error while submitting successfully')
                setSeverity('error')
            }

            dispatch({
                type: actions.tx,
                data: { transactionHash: '' }
            })
            setProposalDesc('')
        }
        catch (err) {
            console.log(err)
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
        <Box
            component="form"
            sx={{
                '& > :not(style)': { m: 1, width: '40ch' },
            }}
            noValidate
            autoComplete="off"
        >
            { workflowStatus === WorkflowStatus.ProposalsRegistrationStarted &&
            <>
                <TextField label="Your proposal" value={proposalDesc} onChange={handleProposalDescChange} variant="standard" />
                <Button onClick={handleMakeProposal} variant="contained">Send proposal</Button>
            </>
            }
            <ProposalsList />
            <SnackbarAlert open={open} setOpen={setOpen} message={message} severity={severity} />
        </Box>
    )
}

export default MakeProposalForm