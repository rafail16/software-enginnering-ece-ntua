import React, { Component } from "react";
import { Link } from "react-router-dom";


export default class Login extends Component {

    render() {
        return (
            <div>
                <nav className="navbar navbar-expand-lg navbar-light fixed-top">
                    <div className="collapse navbar-collapse justify-content-end" style={{marginRight: 40+"px"}}>
                    
                        { localStorage.getItem("token") === null ? (
                        <ul className="navbar-nav ml-auto">
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

                <div class="ask-me"><h2>Welcome to AskMeAnything</h2></div>
                <div className="home-pages">  
                    <Link to="/questionsPerKeyword" >
                        <div className='home-box' style={{backgroundColor: "cornsilk" }}>Questions per keyword</div>
                    </Link>
                    <Link to = "/questionsPerDay" >
                        <div className='home-box' style={{backgroundColor: "lightcyan"}}> Questions per period</div>
                    </Link>
                    <Link to = "/ask" >
                        <div className='home-box' style={{backgroundColor: "palegreen"}}> Ask new question</div>
                    </Link>
                    <Link to = "/answer" >
                        <div className='home-box' style={{backgroundColor: "lavender"}}> Answer a question</div>
                    </Link>
                </div>
                <div className="footer">
                    <a href="https://docs.google.com/document/d/1g1SxYip_uSeVmqw1M-FMAOMvfxRus5vT/edit?usp=sharing&ouid=113980108797041909237&rtpof=true&sd=true">about</a>
                    <a href="mailto:el16155@mail.ntua.gr; el16049@mail.ntua.gr">contact us</a>
                    <a href="https://docs.google.com/document/d/1xNA4t2Ms4qwfw-UNrHDLNCagWRADmi4r/edit?usp=sharing&ouid=113980108797041909237&rtpof=true&sd=true">project documentation</a>
                    <a href="https://github.com/razkey23/saas-50">link on github</a>
                    <a href="https://courses.pclab.ece.ntua.gr/course/view.php?id=34">course materials</a>
                </div>
            </div>
        
        );
    }
}
