import React, { useState } from "react";
import { useEffect } from "react";
import useEthContext from "../../hooks/useEthContext";
import { Nav, NavLink, NavMenu } 
    from "./NavbarElements";
  
const Navbar = () => {
    const { state: { accounts, networkID, owner } } = useEthContext();

    return (
        <div> 
            <Nav>
                <NavMenu>
                    <NavLink to="/">
                        Home
                    </NavLink>
                    {
                        accounts[0] === owner ? 
                        <NavLink to="/admin">
                            Administer votes
                        </NavLink> : <></>
                    }
                    <NavLink to="/proposal">
                        Make proposal
                    </NavLink>  
                    <NavLink to="/vote">
                        Participate to voting session
                    </NavLink>    
                    <NavLink to="/winner">
                        Show winning proposal
                    </NavLink>                    
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