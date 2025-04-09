import React from "react";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Login from "./components/login"
import Logout from "./components/logout"
import SignUp from "./components/signup"
import HomePage from "./components/home_page"
import MyPage from "./components/my_page"
import Ask from "./components/ask_question"
import Answer from "./components/answer_question"
import QuestionsPerDay from "./components/questionsPerDay"
import QuestionsPerKeyword from "./components/questionsPerKeyword"
import ContribUser from "./components/contribution_user"
import ContribUserDate from "./components/contributions_user_day"

function App() {
  return (<Router>
    <div className="App">
      <div>
          <Switch>
            <Route exact path='/' component={HomePage} />
            <Route path="/login" component={Login} />
            <Route path="/sign-up" component={SignUp} />
            <Route path="/homepage" component={HomePage} />
            <Route path="/mypage" component={MyPage} />
            <Route path="/ask" component={Ask} />
            <Route path="/answer" component={Answer} />
            <Route path="/logout" component={Logout} />
            <Route path="/questionsPerDay" component={QuestionsPerDay} />
            <Route path="/questionsPerKeyword" component={QuestionsPerKeyword} />
            <Route path="/userContrib" component={ContribUser} />
            <Route path="/userDay" component={ContribUserDate} />
          </Switch>
      </div>
    </div></Router>
  );
}

export default App;
