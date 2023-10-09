import './App.css';
import Main from './component/Main';
import { BrowserRouter} from 'react-router-dom';

function App() {
  return (
    <>
      <BrowserRouter>
          <Main />
      </BrowserRouter>
    </>
  )
}

export default App;