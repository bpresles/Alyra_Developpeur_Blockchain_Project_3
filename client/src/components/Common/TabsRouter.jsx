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
import WorkflowAdmin from "../../pages/workflow";
import Vote from "../../pages/vote";
import Proposal from "../../pages/proposal";
import Winner from "../../pages/winner";
import Voter from "../../pages/voter";
import ManageVoters from "../Voting/ManageVoters";

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
  const routeMatch = useRouteMatch(['/', '/workflow', '/addvoters', '/proposal', '/vote', '/voter', '/winner']);
  const currentTab = routeMatch?.pattern?.path;

  const { state: { accounts, contract, networkID, owner, currentWorkflowStatus }, dispatch } = useEthContext();
  const [workflowStatus, setWorkflowStatus] = useState(currentWorkflowStatus)

  let connectedUser = useRef(accounts[0])
  let network = useRef(networkID)

  useEffect(() => {
      setWorkflowStatus(currentWorkflowStatus)

      connectedUser.current = accounts[0]
      network.current = networkID
  }, [accounts, connectedUser, contract, dispatch, currentWorkflowStatus, networkID])

  return (
    <Tabs value={currentTab}>  
      <Tab label="Home" value='/' to='/' component={Link} />
    {connectedUser.current === owner &&
      <Tab label="Workflow" value="/workflow" to='/workflow' component={Link} />
    }
    {connectedUser.current === owner &&
      <Tab label="Add voters" value="/addvoters" to='/addvoters' component={Link} />
    }
    {(workflowStatus === WorkflowStatus.ProposalsRegistrationStarted 
      || (workflowStatus > WorkflowStatus.ProposalsRegistrationStarted && connectedUser.current === owner)) &&
      <Tab label="Proposals" value="/proposal" to='/proposal' component={Link} />
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
        <Route path='/workflow' element={<WorkflowAdmin />} />
        <Route path='/addvoters' element={<ManageVoters />} />
        <Route path='/proposal' element={<Proposal />} />
        <Route path='/voter' element={<Voter />} />
        <Route path='/vote' element={<Vote />} />
        <Route path='/winner' element={<Winner />} />
      </Routes>
    </Box>
  );
}

export default TabsRouter
