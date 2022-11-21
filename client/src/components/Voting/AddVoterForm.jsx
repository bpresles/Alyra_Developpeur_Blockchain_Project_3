import { Box, Button, TextField } from "@mui/material";
import { useState } from "react";
import { actions } from "../../contexts/EthContext/state";
import useEthContext from "../../hooks/useEthContext";
import { getRPCErrorMessage } from "../Common/error";
import SnackbarAlert from "../Common/SnackbarAlert";
// import TransactionLink from "../Common/TransactionLink";

const AddVoterForm = () => {
  const { state: { contract, accounts }, dispatch } = useEthContext();
  const [voterAddress, setVoterAddress] = useState("");

  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [severity, setSeverity] = useState('success')

  const handleVoterAddress = e => {
    if (/^[A-Fa-f0-9x]+$|^$/.test(e.target.value)) {
      setVoterAddress(e.target.value);
    } else {
      setMessage('Invalid address')
      setSeverity('error')
      setOpen(true)
    }
  };

  const addVoter = async () => {
    try {
      await contract.methods.addVoter(voterAddress).call({ from: accounts[0] })
      const addVoterCall = await contract.methods.addVoter(voterAddress).send({ from: accounts[0] })
        .on("transactionHash", async (transactionHash) => {
        setMessage('Voter registration in progress')
        setSeverity('success')
        setOpen(true)
        
        setVoterAddress('')

        dispatch({
          type: actions.tx,
          data: { transactionHash }
        })
      })

      const voterAddressFromEvent = addVoterCall.events.VoterRegistered.returnValues.voterAddress
      const voterRegistrationSuccess = voterAddressFromEvent === voterAddress

      if (voterRegistrationSuccess) {
        setMessage('Voter registered successfully')
        setSeverity('success')
      } else {
        setMessage('Voter registration failed')
        setSeverity('error')
      }
      dispatch({
        type: actions.tx,
        data: { transactionHash: '' }
      })
    }
    catch (err) {
      console.log(err)
      setSeverity('error')
      setMessage(getRPCErrorMessage(err))
      
      dispatch({
          type: actions.tx,
          data: { transactionHash: '' }
      })
    }
    setOpen(true)
  };

  return (
    <Box
      component="form"
      sx={{
        '& > :not(style)': { m: 1, width: '40ch' },
      }}
      noValidate
      autoComplete="off"
    >
      <TextField label="Voter address" value={voterAddress} onChange={handleVoterAddress} variant="standard" />
      <Button onClick={addVoter} variant="contained">Add a voter</Button>
      <SnackbarAlert open={open} setOpen={setOpen} message={message} severity={severity} />
    </Box>
  );
}

export default AddVoterForm;