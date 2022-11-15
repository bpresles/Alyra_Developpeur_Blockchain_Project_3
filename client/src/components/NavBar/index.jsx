import React, { useState } from "react";
import { useEffect } from "react";
import { WorkflowStatus } from "../../contexts/EthContext/state";
import useEthContext from "../../hooks/useEthContext";
import { Nav, NavLink, NavMenu } 
    from "./NavbarElements";
  
const Navbar = () => {
    const { state: { accounts, contract, networkID, owner } } = useEthContext();
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
            <Nav>
                <NavMenu>
                    <NavLink to="/">
                        Home
                    </NavLink>
                    {accounts[0] === owner ? 
                        <NavLink to="/admin">
                            Administer votes
                        </NavLink> : <></>
                    }
                    {workflowStatus === WorkflowStatus.ProposalsRegistrationStarted ?
                        <NavLink to="/proposal">
                            Make proposal
                        </NavLink> : <></>
                    }
                    {workflowStatus === WorkflowStatus.VotingSessionStarted ?
                        <NavLink to="/vote">
                            Participate to voting session
                        </NavLink> : <></>
                    }  
                    {workflowStatus === WorkflowStatus.VotesTallied ?
                        <NavLink to="/winner">
                            Show winning proposal
                        </NavLink> : <></>
                    }                    
                </NavMenu>
            </Nav>
            <p>&nbsp;</p>
            <div>
            Connected User: {accounts[0]} on network: {networkID}
            </div>
        </div>
    );
};
  
export default Navbar;