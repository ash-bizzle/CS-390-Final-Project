import React from "react";
import './Login-Register.css';
import { withRouter } from 'react-router-dom';
import axios from 'axios';

class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {error: undefined};
    axios.defaults.headers.common["access-token"] = localStorage.getItem('access-token');
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
  }

  checkLoginStatus() {
    axios.get("http://localhost:3001/api/auth/verifyToken")
    .then(res => {
      this.props.history.push("/");
    })
    .catch(err => {
      
    });
  }

  componentWillMount() {
    this.checkLoginStatus();
  }

  handleSubmit(event) {
    event.preventDefault();
    var username = event.target.username.value;
    var password = event.target.password.value;
    axios.post("http://localhost:3001/api/auth/login", {
      username: username,
      password: password
    }).then(res => {
      if (res.status === 200) {
        localStorage.setItem("access-token", res.data.token);
        this.props.history.push("/");
      }
    }).catch(err => {
      if (err.response.status === 404) {
        this.setState({error: "User Does not Exist"});
      } else if (err.response.status === 401) {
        this.setState({error: "Incorrect Password"});
      } else {
        this.setState({error: "An Unexpected Error Occured"});
      }
    });
    return;
  }

  handleRegister(event) {
    event.preventDefault();
    this.props.history.push("/register");
  }

  render() {
    return (
      <div className="main-login">
      <p className="title" align="center">Log In</p>
      { 
        this.state.error &&
        <p className="error" align="center">{this.state.error}</p>
      }
      <form onSubmit={this.handleSubmit}>
        <input name="username" type="text" required align="center" placeholder="Username"/>
        <input name="password" type="password" required align="center" placeholder="Password"/>
        <button className="submit" align="center">Submit</button>
        <p className="link" align="center"><a href="/register" onClick={this.handleRegister}>Don't have an Account? Register</a></p>
      </form>        
      </div>
    );
  }
}

export default withRouter(Login);
