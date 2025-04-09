import axios from "axios";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-daterangepicker/daterangepicker.css';
import jwt from 'jwt-decode'


export default class ContribUser extends Component {

    constructor(){
        super()
        this.state={
            questions: [],
            answers: []
        }

    }

    componentDidMount= () => {
        if (localStorage.getItem("token")===null) {
            alert("You need to login first");
            this.props.history.push('/login');
            return;
        }
        const userId = jwt(localStorage.getItem("token")).id;
        axios({
          method: 'POST',
          url: 'http://localhost:3001/proxy',
          data: {
              endpoint: "QuestionsPerUser",
              user: userId,
              method: "GET",

          },
          Headers:{
            "Authorization": "Bearer "+localStorage.getItem("token")
          }
        }).then(response => {
            console.log(response.data.questions);
            this.setState({
                questions: response.data.questions
            })
        }).catch(function(error) {
          alert(error)
        })

        // TODO: this need to be created
        axios({
            method: 'POST',
            url: 'http://localhost:3001/proxy',
            data: {
              endpoint: "AnswersOfUser",
              user: userId,
              method: "GET"
            },
            Headers:{
              "Authorization": "Bearer "+localStorage.getItem("token")
            }
          }).then(response => {
              console.log(response.data.answers);
              this.setState({
                  answers: response.data.answers
              })
          }).catch(error => {
            alert(error)
          })  
    }
    render() {

        //these to be changed to the fields we want to show
        var columnsQ = [
            { dataField: 'id', text: 'Id', headerStyle: {backgroundColor: 'MidnightBlue', color:"white"}},
            { dataField: 'title', text: 'Title', headerStyle: {backgroundColor: 'MidnightBlue', color:"white"} },
            { dataField: 'text', text: 'Text', headerStyle: {backgroundColor: 'MidnightBlue', color:"white"} },
          ]
        var columnsA = [
            { dataField: 'id', text: 'Id', headerStyle: {backgroundColor: 'MidnightBlue', color:"white"} },
            { dataField: 'text', text: 'text', headerStyle: {backgroundColor: 'MidnightBlue', color:"white"} },
        ]
        const rowStyle = (row, rowIndex) => {
            const style = {};
            if (rowIndex%2) style.backgroundColor="LightCyan"
            else style.backgroundColor="beige"
            return style;
        };
        return (
            <div>
                <nav className="navbar navbar-expand-lg navbar-light fixed-top">
                    <div className="collapse navbar-collapse justify-content-end" style={{marginRight: 40+"px"}}>
                        { localStorage.getItem("token") === null ? (
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
                            <li className="nav-item">
                            <Link className="nav-link" to={"/logout"}>Logout</Link>
                            </li>
                        </ul>
                        )
                        }
                        
                    </div>
                </nav>
                <h2 style={{paddingTop:70+"px", marginLeft:50+"px", fontSize:30+"px",  fontWeight:700, color:"blue"}}>Your questions:</h2>
                <div style={{marginTop:30+"px", height:300+"px", overflowY:"scroll"}}>
                    <div style={{marginLeft:50+"px", marginRight:50+"px"}}>
                        <BootstrapTable
                            data={ this.state.questions }
                            columns={ columnsQ }
                            rowStyle={rowStyle}
                            wrapperClasses="table-responsive"
                            rowClasses="text-wrap"
                            keyField='id'>
                        </BootstrapTable>
                    </div>
                </div>
                <h2 style={{paddingTop:60+"px", marginLeft:50+"px", fontSize:30+"px", fontWeight:700, color:"blue"}}>Your answers:</h2>
                <div style={{marginTop:30+"px", height:300+"px", overflowY:"scroll"}}>
                    <div style={{ marginLeft:50+"px", marginRight:50+"px"}}>
                        <BootstrapTable
                            data={ this.state.answers }
                            columns={ columnsA }
                            rowStyle={rowStyle}
                            wrapperClasses="table-responsive"
                            rowClasses="text-wrap"
                            keyField='id'>
                        </BootstrapTable>
                    </div>
                </div>
                
                <div className="footer">
                    <a href="/">about</a>
                    <a href="/">contact us</a>
                    <a href="/">project documentation</a>
                    <a href="/">link on github</a>
                    <a href="/">course materials</a>
                </div>
            </div>
        );
    }
}
