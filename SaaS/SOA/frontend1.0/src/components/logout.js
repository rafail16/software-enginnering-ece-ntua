import React, { Component } from "react";
import { Link } from "react-router-dom";


export default class Logout extends Component {
  
  logout(){
    localStorage.removeItem("token");
    this.props.history.push('/homepage')
  }

  
  render() {
    return (
      <div>
        <nav className="navbar navbar-expand-lg navbar-light fixed-top">
          <div className="collapse navbar-collapse justify-content-end" style={{marginRight: 40+"px"}}>
            
              { localStorage["token"] === null ? (
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                <Link className="nav-link" to={"/homepage"}>Home Page</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to={"/login"}>Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to={"/sign-up"}>Sign Up</Link>
                </li>
              </ul>
              ) : (
                <ul className="navbar-nav ml-auto">
                  <li className="nav-item">
                <Link className="nav-link" to={"/homepage"}>Home Page</Link>
                </li>
                  <li className="nav-item">
                    <Link className="nav-link" to={"/mypage"}>My Page</Link>
                  </li>
                </ul>
                  
                )
              }
              
          </div>
        </nav>

        <div className="auth-wrapper">
          <div className="auth-inner">
              <form>
              <h2>Are you sure you want to logout?</h2>

            <button type="submit" onClick={() => this.logout()} className="btn btn-primary btn-block">Logout</button>
            </form>
          </div>
        </div>
        <div className="footer">
          <a href="/">about</a>
          <a href="/">contact us</a>
          <a href="/">project documentation</a>
          <a href="/">link on github</a>
          <a href="/">cource materials</a>
        </div>
      </div>
    );
  }
}