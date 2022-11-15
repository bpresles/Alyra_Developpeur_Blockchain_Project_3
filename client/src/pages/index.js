
import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { WorkflowStatus } from '../contexts/EthContext/state';
import useEthContext from '../hooks/useEthContext';
  
const Home = () => {
  const { state: { contract, accounts } } = useEthContext()
  const [workflowStatus, setWorkflowStatus] = useState(WorkflowStatus.RegisteringVoters)

  useEffect(() => {
      (async () => {
          const currentStatus = await contract.methods.workflowStatus().call({from: accounts[0]})
          if (currentStatus) {
              setWorkflowStatus(parseInt(currentStatus))
          }
      })()
  })

  return (
    <div>
      <h1>Welcome to your voting system</h1>
      { workflowStatus !== WorkflowStatus.ProposalsRegistrationStarted 
        && workflowStatus !== WorkflowStatus.VotingSessionStarted ?
        <p>The session is not opened yet</p> : <></>
      }
    </div>
  );
};
  
export default Home;