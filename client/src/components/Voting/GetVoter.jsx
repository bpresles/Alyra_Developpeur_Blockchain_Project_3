import { useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import useEthContext from "../../hooks/useEthContext";

const GetVoter = () => {
    const { state: { contract, owner } } = useEthContext();

    const [voterAddress, setVoterAddress] = useState('');
    const [voter, setVoter] = useState('');

    const handleVoterAddress = e => {
        setVoterAddress(e.target.value);
    }

    const handleGetVoter = async () => {
        const voter = await contract.methods.getVoter(voterAddress).call({from: owner});
        console.log(voter.isRegistered);
        setVoter(voter);
    }

    return (
        <Box sx={{
            '& > :not(style)': { m: 1, width: '40ch' },
        }}>
            <TextField variant="standard" label="voter address" type="text" value={voterAddress} onChange={handleVoterAddress} />
            <Button variant="contained" onClick={handleGetVoter}>Get voter</Button>
            { voter ? <div><p>&nbsp;</p><div>Address: {voterAddress}</div><div>Has voted ? {voter.hasVoted ? 'yes' : 'no'}</div></div> : <></>}
            { voter && voter.hasVoted ? <div>Voted proposal id: {voter.votedProposalId}</div> : <></>}
        </Box>
    );
}

export default GetVoter;