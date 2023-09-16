import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Login } from './components/login';
import { Signup } from './components/signup';
import { Dashboard } from './components/dashboard';
import Protected from './services/Protected';
import { Properties } from './components/properties';
import { Rentals } from './components/rentals';
import React from 'react';
import { Modal } from 'antd';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <div>
        <Toaster />
      </div>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route
            path='/dashboard'
            element={
              // <Protected>
              <Dashboard />
              // </Protected>
            }
          />
          <Route
            path='/properties'
            element={
              <Protected>
                <Properties />
              </Protected>
            }
          />
          <Route
            path='/rentals'
            element={
              <Protected>
                <Rentals />
              </Protected>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
