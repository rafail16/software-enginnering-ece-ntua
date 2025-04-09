import React, { Component } from "react";
import jwt from 'jwt-decode'
import axios from 'axios'
import { Link } from "react-router-dom";
import Select from "react-select";

export default class Ask extends Component {

    constructor() {
        super();
        this.state = {
            init_keywords: [
                {'id':1,"name": "Machine-Learning"},
                {'id':2,"name": "AI"},
                {'id':3,"name": "Python"},
                {'id':4,"name": "Java"},
                {'id':5,"name": "C++"},
                {'id':6,"name": "Javascript"},
                {'id':7,"name": "Algorithms"},
                {'id':8,"name": "Graph Theory"},
                {'id':9,"name": "Haskell"}
            ],
            question_name: '',
            question_text: '',
            keywords: [],
        }
        this.submitQuestion=this.submitQuestion.bind(this);
    }

    submitQuestion = () => {
        const userId = jwt(localStorage.getItem("token")).id;
        const date = new Date();
        axios({
          method: 'POST',
          url: `http://localhost:3001/proxy`,
          data: {
              user: userId,
              title: this.state.question_name,
              text: this.state.question_text,
              keyword: this.state.keywords,
              date_asked: [date.getFullYear(), ('0'+(date.getMonth()+1)).slice(-2), ('0'+(date.getDate())).slice(-2)].join('-'),
              method: "post",
              endpoint:'AddQuestion'
          },
          Headers:{
            "Authorization": "Bearer "+localStorage.getItem("token")
          }
        }).then(response => {
            console.log(response.data);
            alert("Questions Posted Successfully");
          this.props.history.push('/mypage');
        }).catch(error => {
          alert(error)
        })
    }

    updateTitle(evt){
        this.setState({
            question_name: evt.target.value
          });
    }

    updateText(evt){
        this.setState({
            question_text: evt.target.value
          });
    }

    updateKeywords(evt){
        //console.log(evt);
        let tempList=[];
        for (let i=0;i<evt.length;i++) {
            tempList.push({ id : evt[i].id});
        }
        this.setState({
            keywords: tempList
        })

    }
    
    render() {
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
                <div className="verical-orientation">
                    <div class="ask-me" style={{paddingLeft:5+"%", paddingBottom:10+"px"}}>Ask a question</div>
                    <div className="horizontal-orientation">
                        <label style={{width:20+'%', fontWeight:700}}>Question title:</label>
                        <input type="text" className="form-control" placeholder="The title of your question" onChange={evt => this.updateTitle(evt)}></input>
                    </div>

                    <div className="horizontal-orientation">
                        <label style={{width:20+'%', fontWeight:700}}>Question text:</label>
                        <textarea className="form-control" rows="5" placeholder="Elaborate your question" style={{resize:"none"}} onChange={evt => this.updateText(evt)}></textarea>
                    </div>
                    
                    <div style={{paddingLeft:5+"%", width:95+"%", marginBottom:50+"px"}}>
                        <label style={{width:20+'%', fontWeight:700, marginBottom:10+"px"}}>Select Keywords:</label>
                        <Select
                            class="form-control"
                            placeholder="Select Keyword"
                            isMulti
                            options={this.state.init_keywords}
                            getOptionLabel={(option)=>option.name}
                            getOptionValue={(option)=>option.id}
                            onChange={e => this.updateKeywords(e)}
                        />
                    </div>
                    <div style={{width:100+"%", display:"flex", justifyContent:"space-evenly", alignItems:"center"}}>
                        <button type="submit" className="btn btn-primary btn-block button-forms" onClick={() => this.submitQuestion()} style={{marginRight:1+"em", marginLeft:10+"px"}}>
                            <div style={{fontSize: 18+"px",fontWeight: 600}}>Submit</div>
                        </button>
                        <button type="submit" className="btn btn-primary btn-block button-forms" onClick={() => this.props.history.push("/homepage")} style={{marginLeft:1+"em", marginRight:10+"px"}}>
                        <div style={{fontSize: 18+"px",fontWeight: 600}}>Cancel</div>
                        </button>
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
