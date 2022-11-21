import React from "react";
import useEthContext from "../../hooks/useEthContext";
import NoticeNoArtifact from "../Common/NoticeNoArtifact";
import NoticeWrongNetwork from "../Common/NoticeWrongNetwork";
import ConnectedInfo from "../Common/ConnectedInfo";
import TabsRouter from "../Common/TabsRouter";
import WorkflowStatusProvider from "../Common/WorkflowStatusProvider";
import { Box } from "@mui/material";
  
const Voting = () => {
    const { state } = useEthContext()

    return (
        <div>
            {
                !state.artifact ? <NoticeNoArtifact /> :
                    !state.contract ? <NoticeWrongNetwork /> :
                        <Box>
                            <WorkflowStatusProvider>
                                <ConnectedInfo />
                                <TabsRouter />
                            </WorkflowStatusProvider>
                        </Box>
            }
        </div>
    );
};
  
export default Voting