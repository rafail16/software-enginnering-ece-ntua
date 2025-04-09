import axios from "axios";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import BootstrapTable from "react-bootstrap-table-next";

export default class QuestionsPerKeyword extends Component {

    constructor(){
        super()
        this.state={
            //keywords :[],
            keywords: [
                {'id':1,"name": "Machine Learning"},
                {'id':2,"name": "AI"},
                {'id':3,"name": "Python"},
                {'id':4,"name": "Java"},
                {'id':5,"name": "C++"},
                {'id':6,"name": "Javascript"},
                {'id':7,"name": "Algorithms"},
                {'id':8,"name": "Graph Theory"},
                {'id':9,"name": "Haskell"}
            ],
            keyword:'',
            questions: []
        }
        //this.getQuestion.bind(this);
    }



     getQuestion = (e) => {
        let x = localStorage.getItem("token");
        console.log(x);
        console.log(e)
        const metadata = {
            endpoint : "QuestionsPerKW",
            method : "get",
            keyword: e.name
        }
        axios({
            method: "post",
            url: 'http://localhost:3001/proxy',
            data: metadata,
            Headers:{
              "Authorization": "Bearer "+localStorage.getItem("token")
            }
        }).then(response => {
            this.setState({ questions: response.data} );
            console.log(response.data)
        }).catch(function(error) {
            alert(error)
        });
    };

    render() {
        let columns = [
            { 
                dataField: 'id', 
                text: 'Id',
                headerStyle: {backgroundColor: 'MidnightBlue', color:"white"}
            },
            { 
                dataField: 'title', 
                text: 'Title',
                headerStyle: {backgroundColor: 'MidnightBlue', color:"white"}
            },
            { 
                dataField: 'text', 
                text: 'Description',
                headerStyle: {backgroundColor: 'MidnightBlue', color:"white"}
            },
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
                <div class="ask-me" style={{paddingBottom:50+"px"}}>Questions Per Keyword</div>
                <h2 style={{paddingLeft:5+"%", paddingBottom:15+"px", color:"MidnightBlue"}}>Select Keyword</h2>
                <div style={{marginLeft:5+"%", width:90+"%"}}>
                    <Select
                        class="form-control"
                        placeholder="Select Keyword"
                        onClick={() => this.getKeywords()}
                        options={this.state.keywords}
                        getOptionLabel={(option)=>option.name}
                        getOptionValue={(option)=>option.id}
                        onChange={ e => this.getQuestion(e)}
                        //onChange={ e => this.getQuestion(e)}
                    />
                    <div style={{marginTop:40+"px", height:400+"px", overflowY:"scroll"}}>
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
