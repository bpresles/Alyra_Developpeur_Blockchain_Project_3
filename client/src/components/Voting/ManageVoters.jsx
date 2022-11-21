import { useEffect, useState } from "react";
import { WorkflowStatus } from "../../contexts/EthContext/state";
import useEthContext from "../../hooks/useEthContext";
import AddVoterForm from "./AddVoterForm";
import VotersList from "./VotersList";

function ManageVoters() {
    const { state: { accounts, owner, currentWorkflowStatus } } = useEthContext()
    const [workflowStatus, setWorkflowStatus] = useState(currentWorkflowStatus)

    useEffect(() => {
        (async () => {
            setWorkflowStatus(currentWorkflowStatus)
        })()
    }, [setWorkflowStatus, currentWorkflowStatus])

    return (
        <div>
        {
            accounts[0] === owner ? 
            <div>
                { workflowStatus === WorkflowStatus.RegisteringVoters &&
                    <AddVoterForm />
                }
                <VotersList />
            </div> : <div></div>
        }
        </div>
    );
}

export default ManageVoters;