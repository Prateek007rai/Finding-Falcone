import React, { useState } from 'react';
import { BrowserRouter,  Routes , Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Home from './components/Home';
import Result from './components/Result';

function App() {

  const [message , setMessage] = useState('');
  const [totaltime , setTotalTime] = useState('0');
  const [pname , setPname] = useState('');
  const [show ,setShow] = useState(false);

  return (
    <div className="App">
      <Header />
      <BrowserRouter>    
        <Routes>  
          <Route path='/' element={<Home 
          message={message} setMessage={setMessage}
          pname ={pname} setPname={setPname}
          totaltime={totaltime} setTotalTime={setTotalTime} 
          setShow={setShow}
          />} />   


          <Route path='/result' element={<Result 
          message={message} setMessage={setMessage}
          pname ={pname} setPname={setPname}
          totaltime={totaltime} setTotalTime={setTotalTime}
          show={show}
           />} />
        </Routes>
      </BrowserRouter>
      
    </div>
  );
}

export default App;
