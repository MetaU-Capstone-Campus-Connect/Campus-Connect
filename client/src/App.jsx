import './App.css'
import { Routes, Route, BrowserRouter } from 'react-router';
import HomePage from './components/Home/HomePage';
import SignUp from './components/Home/SignUp';
import Login from './components/Home/Login';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <>
            <HomePage/>
            </>
          }/>
          <Route path="/signup" element={
            <>
            <SignUp/>
            </>
          }/>
          <Route path="/login" element={
            <>
            <Login/>
            </>
          }/>
          <Route path="/users/:ids" element={
            <>
            
            </>
          }/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
