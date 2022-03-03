import React from "react";
import './Login-Register.css';
import { withRouter } from 'react-router-dom';
import axios from 'axios';

class Register extends React.Component {

  constructor(props) {
    super(props);
    this.state = {registered: undefined, error: undefined};
    axios.defaults.headers.common["access-token"] = localStorage.getItem('access-token');
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
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
    var name = event.target.name.value;
    var username = event.target.username.value;
    var password = event.target.password.value;
    if (username.includes(' ')) {
      this.setState({error: "Username must not contain a space", registered: undefined});
      return;
    }
    if (password.length < 8) {
      this.setState({error: "Password must be at least 8 characters", registered: undefined});
      return;
    }
    axios.post("http://localhost:3001/api/auth/register", {
      name: name,
      username: username,
      password: password
    }).then(res => {
      if (res.status === 200) {
        this.setState({error: undefined, registered: 1});
      }
    }).catch(err => {
      if (err.response.status === 403) {
        this.setState({error: "This User Already Exists", registered: undefined});
      } else {
        this.setState({error: "An Unexpected Error Occured", registered: undefined});
      }
    });
    return;
  }

  handleLogin(event) {
    event.preventDefault();
    this.props.history.push("/login");
  }

  render() {
    return (
      <div className="main-register">
      <p className="title" align="center">Register</p>
      { 
        this.state.error &&
        <p className="error" align="center">{this.state.error}</p>
      }
      { 
        this.state.registered &&
        <p className="success" align="center">User Registered Successfully</p>
      }
      <form onSubmit={this.handleSubmit}>
        <input name="name" type="text" align="center" required placeholder="Name"/>
        <input name="username" type="text" align="center" required placeholder="Username"/>
        <input name="password" type="password" align="center" required placeholder="Password"/>
        <button className="submit" align="center">Submit</button>
        <p className="link" align="center"><a href="/login" onClick={this.handleLogin}>Already have an Account? Login</a></p>
      </form>        
      </div>
    );
  }
}

export default withRouter(Register);
