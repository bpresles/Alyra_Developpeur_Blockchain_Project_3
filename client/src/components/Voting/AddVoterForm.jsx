import { useEffect, useState } from "react";
import useEthContext from "../../hooks/useEthContext";

const AddVoterForm = () => {

  const { state: { contract, accounts } } = useEthContext();
  const [voterAddress, setVoterAddress] = useState("");
  const [voterRegistered, setVoterRegistered] = useState(false);

  useEffect(() => {

    (async () => {
        await contract.events.VoterRegistered({fromBlock: 'earliest'})
        .on('data', event => {
          let eventVal = event.returnValues.voterAddress;
          setVoterRegistered(eventVal === voterAddress);
        })
        .on('changed', changed => console.log(changed))
        .on('error', error => console.log(error))
        .on('connected', str => console.log(str));
    })();

}, [contract, voterAddress]);

  const handleVoterAddress = e => {
    if (/^[A-Fa-f0-9x]+$|^$/.test(e.target.value)) {
      setVoterAddress(e.target.value);
    }
  };

  const addVoter = async () => {
    setVoterRegistered(false);
    await contract.methods.addVoter(voterAddress).send({ from: accounts[0] });
  };

  return (
    <div>
        <input type="text" value={voterAddress} onChange={handleVoterAddress} />
        <button onClick={addVoter}>Add a voter</button>&nbsp;<span>{voterRegistered ? 'Voter registered successfully' : ''}</span>
    </div>
  );
}

export default AddVoterForm;