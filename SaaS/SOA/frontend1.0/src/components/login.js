import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default class Login extends Component {
  constructor(props){
    super(props);
    this.state = {
      username: '',
      password: '',
      test:''
    }
    this.login = this.login.bind(this)
  }

  updateUsername= (evt) => {
    this.setState({
      username: evt.target.value
    });
    console.log(this.state)
  }

  updatePassword = (evt) => {
    this.setState({
      password: evt.target.value
    });
    console.log(this.state)
  };

  loginAux = () => {
    return fetch(`http://localhost:3001/proxy`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "method":"POST",
        "endpoint": "signin",
        "username": this.state.username,
        "password": this.state.password
      })
    })
        .then(response => {
          return response.json();
        })
        .catch(err => console.log(err));
  };


  login = () => {
    console.log("GOT IN HERE")
    this.setState({
      test: "YES"
    });

    this.loginAux().then(data => {
      if (data.token) {
        localStorage.setItem('token',data.token);
        alert("You have successfuly Logged In");
        this.props.history.push('/mypage');
      }
      console.log('this is the response', data);
    })

    /*console.log(this.state);


    const metadata= {
      endpoint:'signin',
      method:'POST',
      username:this.state.username,
      password:this.state.password
    }*/
   /* await fetch('http://localhost:8000/signin',
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          mode: 'cors',
          method:'post',
          body:JSON.stringify({
            "endpoint":"signin",
            "method":"POST",
            "username":this.state.username,
            "password":this.state.password
          })
        }).then(response => {
          alert(response)
          //localStorage.setItem('token',response.data.token);
          console.log(response.data);
        }).catch(err => {
          console.log(err)
          alert(err)
        });
    */
   /* axios({
      method:'post',
      url:'http://localhost:3001/proxy',
      data: metadata,
    }).then(response => {
      console.log(response);
      console.log("IN HERE")
      if (response.data.status !== "NOT VALIDATED"){
        localStorage.setItem('token',response.data.token);
      }

      //localStorage.setItem('token',response.data.token);
      //console.log(response.data.token);
      //this.props.history.push('/my_page');
    }).catch(error => {
      alert(error)
      //localStorage.setItem('token','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3R1c2VyIiwiaWQiOjE2LCJpYXQiOjE2Mjc3NDA1NjgsImV4cCI6MTYyNzc0NDE2OH0.l9yK3TfdeAGybgVm-HsDcHx0W_GARsQSxqXqNLDgjXs');
      alert(error)
    }); */

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
                    <Link className="nav-link" to={"/sign-up"}>Sign Up</Link>
                  </li>
                </ul>
            )
            }

          </div>
        </nav>

        <div className="auth-wrapper">
          <div className="auth-inner">
              <form>
              <h2 className="headers">Login</h2>

              <div className="form-group">
                <label className="labels">Username:</label>
                <input type="text" className="form-control" placeholder="Enter username" onChange={ evt => this.updateUsername(evt)}></input>
              </div>

              <div className="form-group">
                <label className="labels">Password:</label>
                <input type="password" className="form-control" placeholder="Enter password" onChange={evt => this.updatePassword(evt)}></input>
              </div>
              <div style={{width:100+"%", display:"flex", justifyContent:"center", alignItems:"center"}}>
                <button type="button" onClick={ () => this.login() } className="btn btn-primary btn-block button-forms">
                  <div className="button-text">Login</div>
                </button>
              </div>
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
