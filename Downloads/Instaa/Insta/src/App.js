import logo from './logo.svg';
import './App.css';
import {BrowserRouter,Route,Routes} from "react-router-dom";
import {Register}from './Components/Auth/Register';
import { Login } from './Components/Auth/Login';
import InstagramDashboard from './Components/InstaHomePage/InstaDashboard';
import InstagramProfile from './Components/Profile/Profile';
import { EditProfile } from './Components/Profile/EditProfile';
import InstagramLoginPage from './Components/HomePage/Homepage';

function App() {
  return (
    <div >

      <BrowserRouter>
            
            <Routes>
              
              <Route path='/register' element={<Register/>}/>
              <Route path='/login' element={<Login/>}/>
              <Route path='/instagramD' element={<InstagramDashboard/>}/>
              <Route path='/profile/:id' element={<InstagramProfile/>}/>
              <Route path='/editProfile/:id' element={<EditProfile/>}/>
              <Route path='/' element={<InstagramLoginPage/>}/>

            </Routes>
      
      
      </BrowserRouter>
         

    </div>
  );
}

export default App;
