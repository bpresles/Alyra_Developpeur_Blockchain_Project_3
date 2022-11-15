import useEthContext from "../../hooks/useEthContext"
import AddVoterForm from "./AddVoterForm"
import ChangeWorkflowStatus from "./ChangeWorkflow"
import ResetVotingSession from "./ResetVotingSession"

function VotingAdmin() {
    const { state: { accounts, owner } } = useEthContext();

    return (
        <div className="voting-admin">
        {
            accounts[0] === owner ? 
            <div>
                <ResetVotingSession /><br/>
                <AddVoterForm /><br/>
                <ChangeWorkflowStatus /><br/>
            </div> : <div></div>
        }
        </div>
    );
}

export default VotingAdmin;