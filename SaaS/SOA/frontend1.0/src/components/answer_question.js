import React, { Component } from "react";
import Select from "react-select";
import axios from 'axios'
import jwt from 'jwt-decode'
import { Link } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";


export default class Answer extends Component {

    constructor() {
        super();
        this.state = {
            questionAnswered: {},
            keywords: [],
            answers: [],
            questions: [],
            answer:'',
        }
        this.getAnswer=this.getAnswer.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount = () => {
        axios({
            method: 'POST',
            url: `http://localhost:3001/proxy`,
            data: {
                endpoint: "GetQuestions",
                method: "GET"
            },
        }).then(response =>{
            console.log(response.data);
            this.setState({
                questions: response.data.questions
            })
        }).catch(error => {
            alert(error)
        })
        // fetch questions from database get all questions
    }

    getAnswer = (e) => {
        axios({
            method: 'POST',
            url: `http://localhost:3001/proxy`,
            data: {
                endpoint: 'AnswersOfQuestion',
                question :{ id:e},
                method: 'GET'
            },
        }).then(response => {
            this.setState({
                answers: response.data.answers
            })
        }).catch(error => {
            alert(error)
        })
    }

    myAnswer = (e) => {
        console.log(e.data);
        this.setState({
            answer:e
        });
    }

    getQuestion = (e) =>{
        console.log(e);
        this.setState({
            keywords: e.keyword,
            questionAnswered: e,
        }, () => this.getAnswer(e.id))
    }

    submitAnswer =() =>{
        const userId = jwt(localStorage.getItem("token")).id;
        const date = new Date();
        console.log(this.state.answer);
        console.log(this.state.questionAnswered);
        axios({
            method: 'POST',
            url: `http://localhost:3001/proxy`,
            data: {
                endpoint: 'AddAnswer',
                user: userId,
                question: this.state.questionAnswered,
                text: this.state.answer,
                date_answered: [date.getFullYear(), ('0'+(date.getMonth()+1)).slice(-2), ('0'+(date.getDate())).slice(-2)].join('-'),
                method: 'POST'
            },
            Headers:{
              "Authorization": "Bearer "+localStorage.getItem("token")
            }
        }).then(response => {
            alert("Answer Posted Successfully")
            console.log(response);
            this.props.history.push('/mypage')
        }).catch(error => {
            alert(error)
        })       
    }

    handleChange=(event) => {
        this.setState({answer: event.target.value});
    }


    render() {

        var columns = [
            { dataField: 'id', text: 'Id', headerStyle: {backgroundColor: 'MidnightBlue', color:"white"} },
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
                <div className="verical-orientation text-align-right"  style={{width:90+"%",marginLeft:5+"%", paddingBottom:50+"px"}}>
                    <div class="ask-me" style={{paddingLeft:0, paddingBottom:2+"em"}}>Answer a question</div>
                    {/* make it be a select from all the questions */}
                    <Select
                        class="form-control"
                        placeholder="Question title"
                        options={this.state.questions}
                        getOptionLabel={(option)=>option.text}
                        getOptionValue={(option)=>option.id}
                        onChange={e => this.getQuestion(e)}
                    />
                    <div style={{height:1+"em"}}/>
                    <input readOnly type="text" className="form-control" placeholder="(keywords,read-only)" value={this.state.keywords}></input>
                    <div style={{height:1+"em"}}/>
                    <h2 style={{paddingTop:10+"px", paddingBottom:10+"px", fontSize:20+"px"}}>Available Answers:</h2>
                    <div className="form-group " style={{height:300+"px", overflowY:"scroll"}}>
                    
                        <div style={{marginTop:10+"px"}}>
                            <BootstrapTable
                                data={ this.state.answers }
                                columns={ columns }
                                rowStyle={rowStyle}
                                wrapperClasses="table-responsive"
                                rowClasses="text-wrap"
                                keyField='id'>
                            </BootstrapTable>
                        </div>
                    </div>

                    <div className="form-group">
                        <label style={{width:20+'%'}}>Your Answer:</label>
                        <textarea className="form-control" style={{resize:"none"}} rows="5" value={this.state.answer} onChange={this.handleChange}></textarea>
                    </div>

                    <div style={{width:100+"%", display:"flex", justifyContent:"space-evenly", alignItems:"center"}}>
                        <button type="submit" className="btn btn-primary btn-block button-forms" onClick={() => this.submitAnswer() } style={{marginRight:1+"em", marginLeft:10+"px"}}>
                            <div style={{fontSize: 18+"px",fontWeight: 600}}>Submit answer</div>
                        </button>
                        <button type="submit" className="btn btn-primary btn-block button-forms" onClick={() => this.props.history.push("/homepage")} style={{marginLeft:1+"em", marginRight:10+"px"}}>
                        <div style={{fontSize: 18+"px",fontWeight: 600}}>Never Mind</div>
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
