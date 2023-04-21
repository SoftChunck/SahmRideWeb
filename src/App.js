import logo from './logo.svg';
import './App.css';
import Navbar from './Components/Navbar';

// Import Swiper styles
import 'swiper/css';
import "swiper/css/pagination";
import Homepage from './Pages/Homepage';
import Footer from './Components/Footer';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import {User} from './Objects/User'
import { useEffect, useState } from 'react';
import FindRide from './Pages/FindRide';
import 'mapbox-gl/dist/mapbox-gl.css';
import ServicesPage from './Pages/ServicesPage';

function App() {
  const [selected,setSelected] = useState(0)
  const [user,setUser] = useState({
    uid:'',
    firstName:'Usama',
    lastName:'',
    gender:'',
    isDriver:false,
    profileImageUrl:'',
    loggedIn:false,
  })
  useEffect(()=>{
    var users = localStorage.getItem('user')
    if(users){
      setUser(JSON.parse(users))
    }
  },[])
  return (
    <div className="App">
      <BrowserRouter>
      <User.Provider value={[user,setUser,selected,setSelected]}>
        <Navbar />      
            <Routes>
                <Route path='/' element={<Homepage />} />
                <Route path='/findride' element={<FindRide />} />
                <Route path='/services' element={<ServicesPage />} />
            </Routes>
        <Footer />
      </User.Provider>
      </BrowserRouter>
    </div>
  );
}

export default App;
