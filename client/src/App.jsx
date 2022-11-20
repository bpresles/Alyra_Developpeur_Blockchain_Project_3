import EthProvider from "./contexts/EthContext/EthProvider";
import "./App.css";
import { BrowserRouter as Router} from 'react-router-dom';

import Voting from "./components/Voting";
import Title from "./components/Common/Title";

const App = () => {
  return (
    <EthProvider>
      <Router>
        <div id="App" >
          <div className="container">
            <Title />
            <Voting />
          </div>
        </div>
      </Router>
    </EthProvider>
  );
}

export default App;
