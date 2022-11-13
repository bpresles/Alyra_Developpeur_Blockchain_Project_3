import useEthContext from "../../hooks/useEthContext"
import AddVoterForm from "./AddVoterForm"
import ChangeWorkflowStatus from "./ChangeWorkflow"
import ResetVotingSession from "./ResetVotingSession"

function VotingAdmin() {
    const { state: { contract, accounts, owner } } = useEthContext();

    return (
        <div className="voting-admin">
        {
            accounts[0] === owner ? 
            <>
            <ResetVotingSession />
            <AddVoterForm />
            <ChangeWorkflowStatus />
            </> : <></>
        }
        </div>
    );
}

export default VotingAdmin;