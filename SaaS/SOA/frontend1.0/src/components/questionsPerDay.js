import axios from "axios";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import DateRangePicker from 'react-bootstrap-daterangepicker';
import BootstrapTable from "react-bootstrap-table-next";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-daterangepicker/daterangepicker.css';


export default class QuestionsPerDay extends Component {

    constructor(){
        super()
        this.state={
            startDate:'',
            endDate:'',
            questions: []
        }
        this.handleApply = this.handleApply.bind(this)
    }

    handleApply(event, picker) {
        var d1 = new Date(picker.startDate), d2 = new Date(picker.endDate);
        this.setState({
            startDate: [d1.getFullYear(), ('0'+(d1.getMonth()+1)).slice(-2), ('0'+(d1.getDate())).slice(-2)].join('-'),
            endDate: [d2.getFullYear(), ('0'+(d2.getMonth()+1)).slice(-2), ('0'+(d2.getDate())).slice(-2)].join('-')
        });
        const metadata= {
            endpoint:'QuestionsPerDay',
            method:'GET',
            datefrom:this.state.startDate,
            dateto:this.state.endDate
        }
        axios({
            method:'post',
            url:'http://localhost:3001/proxy',
            data: metadata
        }).then(response => {
            this.setState({
            questions: response.data
        })
        }).catch(function(error) {
          alert(error)
        })
        
    }
    render() {
        //these to be changed to the fields we want to show
        var columns = [
            { dataField: 'id', text: 'Id', headerStyle: {backgroundColor: 'MidnightBlue', color:"white"} },
            { dataField: 'title', text: 'Title', headerStyle: {backgroundColor: 'MidnightBlue', color:"white"} },
            { dataField: 'text', text: 'Answer', headerStyle: {backgroundColor: 'MidnightBlue', color:"white"} },
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
                <DateRangePicker onApply={this.handleApply}>
                    <input style={{fontSize:20+"px",  fontWeight:500, backgroundColor:"LightCyan", color:"MidnightBlue"}}/>
                </DateRangePicker>
                </div>
                <h2 style={{marginTop:50+"px", marginLeft:50+"px",fontSize:30+"px",  fontWeight:700, color:"blue"}}>Questions in the selected date range</h2>
                <div style={{marginLeft: 50+"px", marginRight:50+"px", marginTop:30+"px", height:300+"px", overflowY:"scroll"}}>
                    <div>
                        <BootstrapTable
                            data={ this.state.questions }
                            columns={ columns }
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
