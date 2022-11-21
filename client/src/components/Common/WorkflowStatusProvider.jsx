import { useEffect } from "react";
import { actions } from "../../contexts/EthContext/state";
import useEthContext from "../../hooks/useEthContext";

const WorkflowStatusProvider = ({children}) => {
    const { state: { accounts, contract }, dispatch } = useEthContext();

    useEffect(() => {
        (async () => {
            const currentStatus = await contract.methods.workflowStatus().call({from: accounts[0]})
            if (currentStatus) {
                dispatch({
                    type: actions.changeWorkflowStatus,
                    data: { currentWorkflowStatus: parseInt(currentStatus) }
                })
            }
  
            (async () => {
                await contract.events.WorkflowStatusChange({fromBlock: 'earliest'})
                    .on('data', event => {
                        let newWorkflowStatus = parseInt(event.returnValues.newStatus);
                        dispatch({
                            type: actions.changeWorkflowStatus,
                            data: { currentWorkflowStatus: newWorkflowStatus }
                        })
                    })
                    .on('changed', changed => console.log(changed))
                    .on('error', error => console.log(error))
                    .on('connected', str => console.log(str))
            })()
        })()
    }, [accounts, contract, dispatch])

    return (
        <>
            {children}
        </>
    )
}

export default WorkflowStatusProvider