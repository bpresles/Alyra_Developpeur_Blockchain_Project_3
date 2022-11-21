
import React from 'react';
import { WorkflowStatus } from '../contexts/EthContext/state';
import useEthContext from '../hooks/useEthContext';
  
const Home = () => {
  const { state: { currentWorkflowStatus } } = useEthContext()

  return (
    <div>
      <h1>Welcome to your voting system</h1>
      { currentWorkflowStatus !== WorkflowStatus.VotingSessionStarted 
        && currentWorkflowStatus !== WorkflowStatus.ProposalsRegistrationStarted ?
        <p>The session is not opened</p> : <></>
      }
    </div>
  );
};
  
export default Home;