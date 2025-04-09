import axios from "axios";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import DateRangePicker from 'react-bootstrap-daterangepicker';
import BootstrapTable from "react-bootstrap-table-next";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-daterangepicker/daterangepicker.css';
import jwt from 'jwt-decode'


export default class ContribUserDate extends Component {

    constructor(){
        super()
        this.state={
            startDate:'',
            endDate:'',
            questions: [],
            answers: []
        }
        this.handleApply = this.handleApply.bind(this)
    }

    componentDidMount = () => {
        if (localStorage.getItem("token")===null) {
            alert("You need to login first");
            this.props.history.push('/login');
            return;
        }
    }


    handleApply = (event, picker) => {
        //console.log(event,picker);

        let d1 = picker.startDate.format('YYYY-MM-DD');
        let d2 = picker.endDate.format('YYYY-MM-DD');
       // let d1 = new Date(picker.startDate), d2 = new Date(picker.endDate);
        const userId = jwt(localStorage.getItem("token")).id;
        console.log(localStorage.getItem("token"));

        const metadata= {
            endpoint:'QuestionsUserPerDay',
            method:'GET',
            datefrom:d1,
            dateto:d2,
            user:userId
        }
        console.log(metadata);
        axios({
            method:'post',
            url:'http://localhost:3001/proxy',
            data: metadata,
            Headers:{
                "Authorization": "Bearer "+localStorage.getItem("token")
            }
        }).then(response => {
            console.log(response);
            this.setState({
            questions: response.data.questions
        })
        }).catch(function(error) {
          alert(error)
        })

        const metadata1= {
            endpoint:'AnswersUserPerDay',
            method:'GET',
            datefrom:d1,
            dateto:d2,
            user:userId
        }
        axios({
            method:'post',
            url:'http://localhost:3001/proxy',
            data: metadata1,
            Headers:{
                "Authorization": "Bearer "+localStorage.getItem("token")
            }
        }).then(response => {
            console.log(response);
            this.setState({
                answers: response.data.answers
            })
        }).catch(function(error) {
            alert(error)
        })


    }
    render() {
        var columnsQ = [
            { dataField: 'id', text: 'Id', headerStyle: {backgroundColor: 'MidnightBlue', color:"white"} },
            { dataField: 'title', text: 'Title', headerStyle: {backgroundColor: 'MidnightBlue', color:"white"} },
            { dataField: 'text', text: 'Description', headerStyle: {backgroundColor: 'MidnightBlue', color:"white"} },
          ]
          let columnsA = [
              { dataField: 'id', text: 'Id', headerStyle: {backgroundColor: 'MidnightBlue', color:"white"} },
              { dataField: 'text', text: 'Answer', headerStyle: {backgroundColor: 'MidnightBlue', color:"white"} },
              { dataField: 'questionTitle', text: 'Question', headerStyle: {backgroundColor: 'MidnightBlue', color:"white"} },

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
                <div style={{marginTop:70+"px", marginLeft:50+"px"}}>
                <h2 style={{fontSize:30+"px",  fontWeight:700, color:"blue"}}>Select Date</h2>
                <DateRangePicker onApply={(event,picker) => this.handleApply(event,picker) }>
                    <input style={{fontSize:20+"px",  fontWeight:500, backgroundColor:"LightCyan", color:"MidnightBlue"}}/>
                </DateRangePicker>
                </div>
                <h2 style={{marginTop:20+"px", marginLeft:50+"px",fontSize:30+"px",  fontWeight:700, color:"blue"}}> Your Questions in the selected date range</h2>
                <div style={{marginLeft: 50+"px", marginRight:50+"px", marginTop:30+"px", height:300+"px", overflowY:"scroll"}}>
                    <div>
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

                <h2 style={{marginTop:20+"px", marginLeft:50+"px",fontSize:30+"px",  fontWeight:700, color:"blue"}}> Your Answers in the selected date range</h2>
                <div style={{marginLeft: 50+"px", marginRight:50+"px", marginTop:30+"px", height:300+"px", overflowY:"scroll"}}>
                    <div>
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
                    <a href="/">cource materials</a>
                </div>
            </div>
        );
    }
}
