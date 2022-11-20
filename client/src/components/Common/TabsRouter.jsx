import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { WorkflowStatus } from "../../contexts/EthContext/state";
import useEthContext from "../../hooks/useEthContext";
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import {
  Route,
  Routes,
  Link,
  matchPath,
  useLocation,
} from 'react-router-dom';
import Home from "../../pages";
import Admin from "../../pages/admin";
import Vote from "../../pages/vote";
import Proposal from "../../pages/proposal";
import Winner from "../../pages/winner";
import Voter from "../../pages/voter";

const useRouteMatch = (patterns) => {
  const { pathname } = useLocation();

  for (let i = 0; i < patterns.length; i += 1) {
    const pattern = patterns[i];
    const possibleMatch = matchPath(pattern, pathname);
    if (possibleMatch !== null) {
      return possibleMatch;
    }
  }

  return null;
}

const MyTabs = () => {
  const routeMatch = useRouteMatch(['/', '/admin', '/proposal', '/vote', '/winner']);
  const currentTab = routeMatch?.pattern?.path;

  const { state: { accounts, contract, networkID, owner } } = useEthContext();
  const [workflowStatus, setWorkflowStatus] = useState(WorkflowStatus.RegisteringVoters)

  let connectedUser = useRef(accounts[0])
  let network = useRef(networkID)

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
              .on('connected', str => console.log(str));

          connectedUser.current = accounts[0]
          network.current = networkID
      })()
  }, [accounts, connectedUser, contract, networkID])

  return (
    <Tabs value={currentTab}>  
      <Tab label="Home" value='/' to='/' component={Link} />
    {accounts[0] === owner &&
      <Tab label="Administer votes" value="/admin" to='/admin' component={Link} />
    }
    {(workflowStatus === WorkflowStatus.ProposalsRegistrationStarted 
      || (workflowStatus > WorkflowStatus.ProposalsRegistrationStarted && accounts[0] === owner)) &&
      <Tab label="Make proposals" value="/proposal" to='/proposal' component={Link} />
    }
    {workflowStatus > WorkflowStatus.RegisteringVoters &&
      <Tab label="Get voter" value="/voter" to='/voter' component={Link} />
    }  
    {workflowStatus === WorkflowStatus.VotingSessionStarted &&
      <Tab label="Vote" value="/vote" to='/vote' component={Link} />
    }  
    {workflowStatus === WorkflowStatus.VotesTallied &&
      <Tab label="Show winner" value="/winner" to='/winner' component={Link} />
    }  
    </Tabs>
  );
}

const TabsRouter = () => {
  return (
    <Box sx={{ width: '100%' }}>
      <MyTabs />
      <p>&nbsp;</p>
      <Routes>
        <Route exact path='/' element={<Home />} />
        <Route path='/admin' element={<Admin />} />
        <Route path='/proposal' element={<Proposal />} />
        <Route path='/voter' element={<Voter />} />
        <Route path='/vote' element={<Vote />} />
        <Route path='/winner' element={<Winner />} />
      </Routes>
    </Box>
  );
}

export default TabsRouter
