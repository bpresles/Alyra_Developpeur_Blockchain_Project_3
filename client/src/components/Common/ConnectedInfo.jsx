import { Chip } from "@mui/material";
import React, {  } from "react";
import useEthContext from "../../hooks/useEthContext";
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import HubIcon from '@mui/icons-material/Hub';
import TransactionDisplay from "./TransactionDisplay";
  
const ConnectedInfo = () => {
    const { state: { accounts, networkID } } = useEthContext();

    return (
        <div>
            <p>&nbsp;</p>
            <div style={{float: 'left'}}>
                <Chip icon={<AlternateEmailIcon />} variant="outlined" label={accounts[0]} />&nbsp;
                <Chip icon={<HubIcon />} variant="outlined" label={networkID} />
            </div>
            <div style={{float: 'right'}}>
                <TransactionDisplay />
            </div>
            <p>&nbsp;</p>
        </div>
    );
};
  
export default ConnectedInfo;