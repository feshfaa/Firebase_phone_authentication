import { Container} from "react-bootstrap";
import Login from "./components/Login";
import "bootstrap/dist/css/bootstrap.min.css"
import Signup from "./components/Signup";
import {Routes, Route} from "react-router-dom"
import Dashboard from "./components/Dashboard";
import { UserAuthContextProvider } from "./contexts/AuthContex";

function App() {
  return (
    <Container className='d-flex align-items-center justify-content-center'>
      <UserAuthContextProvider>
        <Routes>
          <Route exact path='/' element={<Login/>}/>
          <Route path='/signup' element={<Signup/>}/>
          <Route path='/dashboard' element={<Dashboard/>}/>
        </Routes>
      </UserAuthContextProvider>
    </Container>
  );
}
export default App;

