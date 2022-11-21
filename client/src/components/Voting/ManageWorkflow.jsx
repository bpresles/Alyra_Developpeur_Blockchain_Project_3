import { Box, Button, Step, StepLabel } from '@mui/material';
import Stepper from '@mui/material/Stepper';
import { useEffect, useState } from 'react';
import { actions, WorkflowStatus, WorkflowStatusLabels } from "../../contexts/EthContext/state";
import useEthContext from '../../hooks/useEthContext';
import { getRPCErrorMessage } from '../Common/error';
import SnackbarAlert from '../Common/SnackbarAlert';

const ManageWorkflow = () => {
    const { state: { contract, accounts, owner, currentWorkflowStatus }, dispatch } = useEthContext()
    const [workflowStatus, setWorkflowStatus] = useState(currentWorkflowStatus)
    
    const [open, setOpen] = useState(false)
    const [message, setMessage] = useState('')
    const [severity, setSeverity] = useState('success')

    useEffect(() => {
        setWorkflowStatus(currentWorkflowStatus)
    }, [setWorkflowStatus, currentWorkflowStatus])

    const resetVote = async () => {
        try {
            const resetResult = await contract.methods.resetVotingProcess().send({from: accounts[0]})
                .on("transactionHash", async (transactionHash) => {
                    setMessage('Reset voting session in progress')
                    setSeverity('success')
                    setOpen(true)
            
                    dispatch({
                        type: actions.tx,
                        data: { transactionHash }
                    })
                })

            const resetStatus = resetResult.events.VotingSessionReinitialized.returnValues.reset

            if (resetStatus) {
                setMessage('Vote session resetted');
                setSeverity('success');

                dispatch({
                    type: actions.changeWorkflowStatus,
                    data: { currentWorkflowStatus: WorkflowStatus.RegisteringVoters }
                })
            } else {
                setMessage('Error while resetting vote session');
                setSeverity('error');
            }
            dispatch({
                type: actions.tx,
                data: { transactionHash: '' }
            })
        }
        catch (err) {
            console.log(err)
            setSeverity('error')
            setMessage(getRPCErrorMessage(err))

            dispatch({
                type: actions.tx,
                data: { transactionHash: '' }
            })
        }
        setOpen(true);

    };

    const handleChangeWorkflowStatus = async () => {
        const newStatus = workflowStatus+1;

        const onTransactionHash = async (transactionHash) => {
            setMessage('Workflow status change in progress')
            setSeverity('success')
            setOpen(true)
    
            dispatch({
                type: actions.tx,
                data: { transactionHash }
            })
        }

        let changeWorkflowStatusCall
        try {
            switch (newStatus) {
                case WorkflowStatus.ProposalsRegistrationStarted:
                    changeWorkflowStatusCall = await contract.methods.startProposalsRegistering().send({from: accounts[0]}).on("transactionHash", onTransactionHash)
                    break;
                case WorkflowStatus.ProposalsRegistrationEnded:
                    changeWorkflowStatusCall = await contract.methods.endProposalsRegistering().send({from: accounts[0]}).on("transactionHash", onTransactionHash);
                    break;
                case WorkflowStatus.VotingSessionStarted:
                    changeWorkflowStatusCall = await contract.methods.startVotingSession().send({from: accounts[0]}).on("transactionHash", onTransactionHash);
                    break;
                case WorkflowStatus.VotingSessionEnded:
                    changeWorkflowStatusCall = await contract.methods.endVotingSession().send({from: accounts[0]}).on("transactionHash", onTransactionHash);
                    break;
                case WorkflowStatus.VotesTallied:
                    changeWorkflowStatusCall = await contract.methods.tallyVotes().send({from: accounts[0]}).on("transactionHash", onTransactionHash);
                    break;
                default:
                    console.log('Wrong status specified.')
                    break;
            }

            if (changeWorkflowStatusCall) {
                const newWorkflowStatus = changeWorkflowStatusCall.events.WorkflowStatusChange.returnValues.newStatus;
                setWorkflowStatus(newWorkflowStatus)
                dispatch({
                    type: actions.changeWorkflowStatus,
                    data: { currentWorkflowStatus: newWorkflowStatus }
                })
                
                setMessage('Workflow status changed')
                setSeverity('success')
            } else {
                setMessage('An error occured on workflow status change')
                setSeverity('error')
            }

            dispatch({
                type: actions.tx,
                data: { transactionHash: '' }
            })
        } catch (err) {
            console.log(err)
            setSeverity('error')
            setMessage(getRPCErrorMessage(err))

            dispatch({
                type: actions.tx,
                data: { transactionHash: '' }
            })
        }
        setOpen(true);
    }

    return (
        <Box sx={{ width: '100%' }}>
            {accounts[0] === owner && 
            <>
                <Stepper activeStep={workflowStatus} alternativeLabel>
                    {Object.keys(WorkflowStatusLabels).map((id) => (
                        <Step key={id}>
                            <StepLabel>{WorkflowStatusLabels[id]}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                <Box sx={{ marginTop: 2, textAlign: 'right', fontSize: '12px' }}>
                    <Button onClick={resetVote}>Reset Vote</Button>
                    <Button variant="contained" sx={{ textAlign: 'right' }} onClick={handleChangeWorkflowStatus}>Change to next workflow status</Button>
                </Box>
            </>
            }
            <SnackbarAlert open={open} setOpen={setOpen} message={message} severity={severity} />
        </Box>
    )
}

export default ManageWorkflow