import React, { Component } from "react";
// import { Button, FormGroup, FormControl } from "react-bootstrap";
import { login } from "./auth.js";
import "./login.css";
import swal from 'sweetalert';


import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

export default class Login extends Component {

  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: ""
    };
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  useStyles = makeStyles(theme => ({
    '@global': {
      body: {
        backgroundColor: theme.palette.common.white,
      },
    },
    paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  }));

  validateForm() {
    return this.state.username.length > 0 && this.state.password.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = event => {
    event.preventDefault();
    const { username, password } = this.state;
    //event.preventDefault()
    if (username === '' || password === '') {
      swal({
        title: "Error",
        text: "Please fill out all fields.",
        icon: "error",
        button: "OK",
      });
    } else {
      login(username, password).then((res) => {
        if (res.status === false) {
          swal({
            title: "Error",
            text: res.message,
            icon: "error",
            button: "OK",
          });
        } else {
          window.location.href = "/index";
          // this.props.history.push(`/index`)
        }
      })
    }
  }

  render() {
    // const classes = this.useStyles();
    return (
      <Container component="main" maxWidth="xs" className="mt-60">
        <CssBaseline />
        <div>
          <Avatar className="avatar-center">
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" className="text-center">
            Log In
          </Typography>
          <form noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              type="text"
              required
              fullWidth
              id="username"
              label="Enter Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={this.state.username}
              onChange={this.handleChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Enter Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={this.state.password}
              onChange={this.handleChange}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              onClick={this.handleSubmit}
            >
              Log In
            </Button>
          </form>
        </div>
      </Container>
    );

    /*return (
      <div className="Login">
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="username" bsSize="large">
            <label>Username</label>
            <FormControl
              autoFocus
              type="text"
              value={this.state.username}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="password" bsSize="large">
            <label>Password</label>
            <FormControl
              value={this.state.password}
              onChange={this.handleChange}
              type="password"
            />
          </FormGroup>
          <Button
            block
            bsSize="large"
            //disabled={!this.validateForm()}
            type="submit"
            onClick={this.handleSubmit}
          >
            Login
          </Button>
        </form>
      </div>
    );*/
  }
}


