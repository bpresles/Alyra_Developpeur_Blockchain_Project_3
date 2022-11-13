import { useEffect } from "react";
import { useState } from "react";
import useEthContext from "../../hooks/useEthContext";

const ChangeWorkflowStatus = () => {

    const WorkflowStatus = {
        RegisteringVoters: 0,
        ProposalsRegistrationStarted: 1,
        ProposalsRegistrationEnded: 2,
        VotingSessionStarted: 3,
        VotingSessionEnded: 4,
        VotesTallied: 5,
    }

    const WorkflowStatusLabels = {
        0: 'Registering voters',
        1: 'Registering proposals',
        2: 'Proposals registration ended',
        3: 'Voting session in progress',
        4: 'Voting session ended',
        5: 'Vote tallied',
    }

    const { state: { contract, accounts } } = useEthContext()
    const [workflowStatus, setWorkflowStatus] = useState(WorkflowStatus.RegisteringVoters)

    useEffect(() => {
        (async () => {
            const currentStatus = await contract.methods.workflowStatus().call({from: accounts[0]})
            if (currentStatus) {
                setWorkflowStatus(parseInt(currentStatus))
            }

            await contract.events.WorkflowStatusChange({fromBlock: 'earliest'})
            .on('data', event => {
              let eventVal = parseInt(event.returnValues.newStatus);
              setWorkflowStatus(eventVal);
              console.log(eventVal);
            })
            .on('changed', changed => console.log(changed))
            .on('error', error => console.log(error))
            .on('connected', str => console.log(str));
        })()
    }, [contract, accounts, setWorkflowStatus])

    const handleChangeWorkflowStatus = async () => {
        const newStatus = workflowStatus+1;

        console.log(newStatus);

        switch (newStatus) {
            case WorkflowStatus.ProposalsRegistrationStarted:
                await contract.methods.startProposalsRegistering().send({from: accounts[0]});
                break;
            case WorkflowStatus.ProposalsRegistrationEnded:
                await contract.methods.endProposalsRegistering().send({from: accounts[0]});
                break;
            case WorkflowStatus.VotingSessionStarted:
                await contract.methods.startVotingSession().send({from: accounts[0]});
                break;
            case WorkflowStatus.VotingSessionEnded:
                await contract.methods.endVotingSession().send({from: accounts[0]});
                break;
            case WorkflowStatus.VotesTallied:
                await contract.methods.tallyVotes().send({from: accounts[0]});
                break;
            default:
                console.log('Wrong status specified.');
                break;
        }
    }

    return (
        <>
            <p>Current workflow status: {WorkflowStatusLabels[workflowStatus]}</p>
            <button onClick={handleChangeWorkflowStatus}>Change to next workflow status</button>
        </>
    );
}

export default ChangeWorkflowStatus;