import React, { useState } from 'react'
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import HomePage from './HomePage'
import AllAPI from './AllAPI'
import AllTables from './AllTables'
import AllPrefix from './AllPrefix'
import Icon from "../logoAPIHUB.png"
import axios from "axios";
import preloader from "../loading.gif"

const MainPage = () => {
  const navigate = useNavigate()

  const [handleInput, setHandleInput] = useState({
    username: "",
    password: ""
  });
  const [disabled, setDisabled] = useState(false);
  const [state, setstate] = useState(false);

  const handleField = (e) => {
    setHandleInput({ ...handleInput, [e.target.name]: e.target.value })
  }

  const submit = async (e) => {
    setDisabled(true)
    setstate(true)
    e.preventDefault();
    const username = handleInput.username;
    const password = handleInput.password;

    if (!username || !password) {
      alert("Please fill the both fields before LogIn.");
      setDisabled(false);
      setstate(false);
      return;
    }

    try {
      const response = await axios.post('https://login-api.web2rise.in/api/login', { username, password });
      const token = response.data.token;
      if (token) {
        setHandleInput({ username: "", password: "" })
        localStorage.setItem('token', token)
        setstate(false)
      }
    } catch (error) {
      console.error(error);
      alert("Invalid Credentials")
      setDisabled(false)
      setstate(false)
    }
  }


  const logOut = async (e) => {
    setDisabled(false)
    setstate(true)
    e.preventDefault();
    const token = localStorage.getItem('token')
    try {
      const response = await axios.post('https://login-api.web2rise.in/api/logout', {}, {
        headers: {
          Authorization: token,
          'Content-Type': "application/json"
        }
      });
      if (response.data.message === 'Logout successful') {
        localStorage.removeItem('token')
        navigate('/')
        setstate(false)
      }
    } catch (error) {
      if (error.response.status === 500 && error.response.message === "An error occurred") {
        localStorage.removeItem('token');
        navigate('/');
        setstate(false);
      } else {
        console.error(error);
      }
    }
  }

  return (
    <>

      {state ?
        <div className="preloader">
          <img src={preloader} alt="preloader" />
        </div>
        : ''
      }

      {localStorage.getItem('token') ?
        <section className="mainpage_sec">
          <div className="container-fluid">
            <div className="row mainpage">
              <div className="col-lg-12 p-0">
                <div className="topbar_mainpage">
                  <NavLink exact="true" to="/">
                    <h4><img src={Icon} alt="" />Admin Login</h4>
                  </NavLink>
                  <input type="button" defaultValue="LogOut" className="logout_btn" onClick={logOut} />
                </div>
              </div>
              <div className="col-lg-2 p-0">
                <div className="sidebar_mainpage">
                  <ul>
                    <li><NavLink exact="true" to="/allprefix"> All Prefix</NavLink></li>
                    <li><NavLink exact="true" to="/alltables"> All Tables</NavLink></li>
                    <li><NavLink exact="true" to="/allapi"> All API</NavLink></li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-10 p-0">
                <div className="content_mainpage">
                  <Routes>
                    <Route exact="true" path='/' element={<HomePage />} />
                    <Route exact="true" path='/allprefix' element={<AllPrefix />} />
                    <Route exact="true" path='/alltables' element={<AllTables />} />
                    <Route exact="true" path='/allapi' element={<AllAPI />} />
                  </Routes>
                </div>
              </div>
            </div>
          </div>
        </section> :
        <section className="formsubmission">
          <div className="box_div login">
            <div className="form">
              <h2>Admin LogIn</h2>
              <form>
                <div className="inputBox">
                  <input type="text" name="username" value={handleInput.username} onChange={handleField} required />
                  <span>User Name</span>
                  <i></i>
                </div>
                <div className="inputBox">
                  <input type="password" name="password" value={handleInput.password} onChange={handleField} required />
                  <span>Password</span>
                  <i></i>
                </div>
                {!disabled ? <input type="SUBMIT" defaultValue="LOGIN" onClick={submit} /> : <input type="SUBMIT" defaultValue="LOGIN" disabled />}

              </form>
              <div className="credentials">
                <h6>Username:- <span>brijesh</span></h6>
                <h6>Password:- <span>brijes08</span></h6>
              </div>
            </div>
          </div>
        </section>
      }
    </>
  )
}

export default MainPage
