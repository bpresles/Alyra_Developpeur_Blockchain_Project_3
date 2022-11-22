import { useEffect, useState } from "react";
import { actions, WorkflowStatus } from "../../contexts/EthContext/state";
import useEthContext from "../../hooks/useEthContext";

const WorkflowStatusProvider = ({children}) => {
    const { state: { accounts, contract }, dispatch } = useEthContext();
    const [workflowStatus, setWorkflowStatus] = useState(WorkflowStatus.RegisteringVoters);

    useEffect(() => {
        (async () => {
            await contract.events.WorkflowStatusChange({fromBlock: 'earliest'})
                .on('data', event => {
                    let newWorkflowStatus = parseInt(event.returnValues.newStatus);
                    setWorkflowStatus(newWorkflowStatus)
                    dispatch({
                        type: actions.changeWorkflowStatus,
                        data: { currentWorkflowStatus: newWorkflowStatus }
                    })
                })
                .on('changed', changed => console.log(changed))
                .on('error', error => console.log(error))
                .on('connected', str => console.log(str))

            const currentStatus = await contract.methods.workflowStatus().call({from: accounts[0]})
            if (currentStatus) {
                setWorkflowStatus(currentStatus)
                dispatch({
                    type: actions.changeWorkflowStatus,
                    data: { currentWorkflowStatus: parseInt(currentStatus) }
                })
            }
        })()
    }, [accounts, contract, dispatch, workflowStatus, setWorkflowStatus])

    return (
        <>
            {children}
        </>
    )
}

export default WorkflowStatusProvider