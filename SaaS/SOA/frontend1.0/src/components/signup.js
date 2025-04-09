import React, { Component } from "react";
import axios from 'axios'
import { Link } from "react-router-dom";

export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state={
      username:'',
      password:'',
      password_again:''
    }
  }

  updateUsername(evt){
    this.setState({
      username: evt.target.value
    });
    console.log(this.state)
  }

  updatePassword(evt){
    this.setState({
      password: evt.target.value
    });
    console.log(this.state)
  }

  updatePasswordAgain(evt) {
    this.setState({
      password_again: evt.target.value
    });
    console.log(this.state)
  }

  register() {
    if(this.state.password === this.state.password_again){
      axios({
        method: 'POST',
        url: `http://localhost:3001/proxy`,
        body: {
          "endpoint": "register",
          "username": this.state.username,
          "password": this.state.password,
          "method": "POST"
        },
      }).then(function(response) {
        this.props.history.push('/login');
      }).catch(function(error) {
        alert(error)
      })
    }
    else {
      alert('No matching passwords')
    }
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-expand-lg navbar-light fixed-top">
          <div className="collapse navbar-collapse justify-content-end" style={{marginRight: 40+"px"}}>
            
              { localStorage["token"] ? (
                <ul className="navbar-nav ml-auto">
                  <li className="nav-item">
                    <Link className="nav-link" to={"/mypage"}>Home Page</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to={"/logout"}>Logout</Link>
                  </li>
                </ul>
              ) : (
                  <ul className="navbar-nav ml-auto">
                  <li className="nav-item">
                  <Link className="nav-link" to={"/homepage"}>Home Page</Link>
                  </li>
                  <li className="nav-item">
                  <Link className="nav-link" to={"/login"}>Login</Link>
                  </li>
                </ul>
                )
              }
              
          </div>
        </nav>
        <div className="auth-wrapper">
          <div className="auth-inner">
            <form>
              <h2 className="headers">Sign Up</h2>

              <div className="form-group"  style={{marginTop:1+'em'}}>
                <label className="labels">Email (user name):</label>
                <input type="text" className="form-control" placeholder="Enter e-mail or username" onChange={evt => this.updateUsername(evt)}></input>
              </div>

              <div className="form-group"  style={{marginTop:1+'em'}}>
                <label className="labels">Password:</label>
                <input type="password" className="form-control" placeholder="Enter password" onChange={evt => this.updatePassword(evt)}></input>
              </div>

              <div className="form-group"  style={{marginTop:1+'em'}}>
                <label className="labels">Re-enter password:</label>
                <input type="password" className="form-control" placeholder="Re-enter password" onChange={evt => this.updatePasswordAgain(evt)}></input>
              </div>
              <div style={{width:100+"%", display:"flex", justifyContent:"space-evenly", alignItems:"center"}}>
                <button type="submit" className="btn btn-primary btn-block button-forms" onClick={() => this.register} style={{marginRight:1+"em", marginLeft:10+"px"}}>
                  <div className="button-text">Register</div>
                </button>
                <button type="submit" className="btn btn-primary btn-block button-forms" onClick={() => this.props.history.push('/')} style={{marginLeft:1+"em", marginRight:10+"px"}}>
                  <div className="button-text">Cancel</div>
                </button>
              </div>
              <div style={{display:"flex", justifyContent:"center", alignItems:"center", flexDirection:"column"}}>
                <div style={{fontSize: 20+"px", paddingTop: 20+"px", fontWeight: 700}}>Already have an account?</div>
                <Link className="nav-link" to={"/login"} style={{fontSize:18+"px", fontWeight:600}}>Login</Link>
              </div>


            </form>
          </div>
        </div>
        <div className="footer">
          <a href="/">about</a>
          <a href="/">contact us</a>
          <a href="/">project documentation</a>
          <a href="https://github.com/razkey23/saas-50">link on github</a>
          <a href="/">cource materials</a>
        </div>
      </div>
      
    );
  }
}