import React from "react";
import useEthContext from "../../hooks/useEthContext";
import NoticeNoArtifact from "../Common/NoticeNoArtifact";
import NoticeWrongNetwork from "../Common/NoticeWrongNetwork";
import Navbar from "../NavBar";
import { Routes, Route}
    from 'react-router-dom';
import Home from "../../pages";
import Admin from "../../pages/admin";
import Vote from "../../pages/vote";
import Proposal from "../../pages/proposal";
import Winner from "../../pages/winner";
  
const Voting = () => {
    const { state } = useEthContext();

    return (
        <div>
            {
                !state.artifact ? <NoticeNoArtifact /> :
                !state.contract ? <NoticeWrongNetwork /> :
                <>
                    <Navbar />
                    <Routes>
                        <Route exact path='/' element={<Home />} />
                        <Route path='/admin' element={<Admin />} />
                        <Route path='/proposal' element={<Proposal />} />
                        <Route path='/vote' element={<Vote />} />
                        <Route path='/winner' element={<Winner />} />
                    </Routes>
                </>
            }
        </div>
    );
};
  
export default Voting;