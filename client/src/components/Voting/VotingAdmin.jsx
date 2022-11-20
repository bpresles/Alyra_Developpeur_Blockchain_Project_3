import { useEffect, useState } from "react";
import { WorkflowStatus } from "../../contexts/EthContext/state";
import useEthContext from "../../hooks/useEthContext";
import AddVoterForm from "./AddVoterForm";
import VotingState from "./VotingState";
import VotersList from "./VotersList";

function VotingAdmin() {
    const { state: { contract, accounts, owner } } = useEthContext()
    const [workflowStatus, setWorkflowStatus] = useState(-1)

    useEffect(() => {
        (async () => {
            const currentStatus = await contract.methods.workflowStatus().call({from: accounts[0]})
            if (currentStatus) {
                setWorkflowStatus(parseInt(currentStatus))
            }

            await contract.events.WorkflowStatusChange({fromBlock: 'earliest'})
                .on('data', event => {
                    let newWorkflowStatus = parseInt(event.returnValues.newStatus);
                    setWorkflowStatus(newWorkflowStatus);
                    console.log(newWorkflowStatus);
                })
                .on('changed', changed => console.log(changed))
                .on('error', error => console.log(error))
                .on('connected', str => console.log(str))
        })()
    }, [contract, accounts, setWorkflowStatus])

    return (
        <div className="voting-admin">
        {
            accounts[0] === owner ? 
            <div>
                <VotingState /><br/>
                { workflowStatus === WorkflowStatus.RegisteringVoters &&
                    <AddVoterForm />
                }
                <VotersList />
            </div> : <div></div>
        }
        </div>
    );
}

export default VotingAdmin;