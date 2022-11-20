import React from "react";
import useEthContext from "../../hooks/useEthContext";
import NoticeNoArtifact from "../Common/NoticeNoArtifact";
import NoticeWrongNetwork from "../Common/NoticeWrongNetwork";
import ConnectedInfo from "../Common/ConnectedInfo";
import TabsRouter from "../Common/TabsRouter";
  
const Voting = () => {
    const { state } = useEthContext()

    return (
        <div>
            {
                !state.artifact ? <NoticeNoArtifact /> :
                    !state.contract ? <NoticeWrongNetwork /> :
                        <>
                            <ConnectedInfo />
                            <TabsRouter />
                        </>
            }
        </div>
    );
};
  
export default Voting