import { useEffect, useState } from "react";
import useEthContext from "../../hooks/useEthContext";
import { getRPCErrorMessage } from "../Common/error";

const AddVoterForm = () => {

  const { state: { contract, accounts } } = useEthContext();
  const [voterAddress, setVoterAddress] = useState("");
  const [voterRegistered, setVoterRegistered] = useState(false);
  const [error, setError] = useState('')

  const handleVoterAddress = e => {
    if (/^[A-Fa-f0-9x]+$|^$/.test(e.target.value)) {
      setVoterAddress(e.target.value);
    }
  };

  const addVoter = async () => {
    setVoterRegistered(false);
    try {
      await contract.methods.addVoter(voterAddress).call({ from: accounts[0] })
      const addVoterCall = await contract.methods.addVoter(voterAddress).send({ from: accounts[0] })

      const voterAddressFromEvent = addVoterCall.events.VoterRegistered.returnValues.voterAddress
      setVoterRegistered(voterAddressFromEvent === voterAddress)
    }
    catch (err) {
        console.log(err)
        setError(getRPCErrorMessage(err))
    }
  };

  return (
    <div>
        <input type="text" value={voterAddress} onChange={handleVoterAddress} />
        <button onClick={addVoter}>Add a voter</button>&nbsp;<span>{voterRegistered ? 'Voter registered successfully' : error ? error : ''}</span>
    </div>
  );
}

export default AddVoterForm;