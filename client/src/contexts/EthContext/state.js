const actions = {
  init: "INIT",
  tx: "TRANSACTION",
  changeWorkflowStatus: "CHANGE_WORKFLOW_STATUS",
}

const WorkflowStatus = {
  RegisteringVoters: 0,
  ProposalsRegistrationStarted: 1,
  ProposalsRegistrationEnded: 2,
  VotingSessionStarted: 3,
  VotingSessionEnded: 4,
  VotesTallied: 5,
}

const WorkflowStatusLabels = {
  0: 'Registering voters',
  1: 'Registering proposals',
  2: 'Proposals registration ended',
  3: 'Voting session in progress',
  4: 'Voting session ended',
  5: 'Vote tallied',
}

const initialState = {
  artifact: null,
  web3: null,
  accounts: null,
  networkID: null,
  contract: null,
  owner: null,
  transactionHash: null,
  currentWorkflowStatus : WorkflowStatus.RegisteringVoters,
};

const reducer = (state, action) => {
  const { type, data } = action;
  switch (type) {
    case actions.init:
    case actions.tx:
    case actions.changeWorkflowStatus:
      return { ...state, ...data }
    default:
      throw new Error("Undefined reducer action type");
  }
};

export {
  actions,
  initialState,
  reducer,
  WorkflowStatus,
  WorkflowStatusLabels
};
