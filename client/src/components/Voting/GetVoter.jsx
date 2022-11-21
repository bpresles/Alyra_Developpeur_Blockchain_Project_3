import { useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import useEthContext from "../../hooks/useEthContext";

const GetVoter = () => {
    const { state: { contract, accounts } } = useEthContext();

    const [voterAddress, setVoterAddress] = useState('');
    const [voter, setVoter] = useState(null);

    const handleVoterAddress = e => {
        setVoterAddress(e.target.value);
    }

    const handleGetVoter = async () => {
        const voter = await contract.methods.getVoter(voterAddress).call({ from: accounts[0] });
        setVoter(voter);
    }

    return (
        <Box sx={{
            '& > :not(style)': { m: 1, width: '40ch' },
        }}>
            <TextField variant="standard" label="voter address" type="text" value={voterAddress} onChange={handleVoterAddress} />
            <Button variant="contained" onClick={handleGetVoter}>Get voter</Button>
            <Box sx={{fontSize: '14px'}}>
            { voter && <div>Is Registered ? {voter.isRegistered ? 'yes' : 'no'}</div>}
            { voter && voter.isRegistered ? <div>Has voted ? {voter.hasVoted ? 'yes' : 'no'}</div> : <></>}
            </Box>
        </Box>
    );
}

export default GetVoter;