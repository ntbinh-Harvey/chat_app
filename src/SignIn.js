import { React, useState } from "react";
import {
  Button,
  CssBaseline,
  TextField,
  Paper,
  Grid,
  Typography,
  Icon,
  makeStyles,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import useAsync from "./hooks/useAsync";
import { firebase, auth } from "./firebase";
import LoadingComponent from "./LoadingComponent";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  image: {
    backgroundImage:
      "url(https://images.unsplash.com/photo-1638008084961-074c14787275?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTYzODkzMDIwNw&ixlib=rb-1.2.1&q=80&w=1080)",
    backgroundRepeat: "no-repeat",
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  or: {
    textAlign: "center",
  },
  submitGg: {
    margin: theme.spacing(2, 0, 2),
    background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
    color: "white",
  },
  submitFb: {
    margin: theme.spacing(2, 0, 2),
    background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
    color: "white",
  },
}));

export default function SignIn() {
  const classes = useStyles();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const { isLoading, run } = useAsync();
  const handleSubmit = async (e) => {
    e.preventDefault();
    run(auth.signInWithEmailAndPassword(email, password));
  };
  const handleSignInGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    run(auth.signInWithRedirect(provider));
  };
  const handleSignInFacebook = () => {
    const provider = new firebase.auth.FacebookAuthProvider();
    run(auth.signInWithRedirect(provider));
  };
  if (isLoading) return <LoadingComponent />;
  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Typography variant="h4">Sign in</Typography>
          <form className={classes.form} onSubmit={handleSubmit} noValidate>
            <TextField
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              color="primary"
              fullWidth
              variant="contained"
              className={classes.submit}
            >
              Sign In
            </Button>
            <Typography className={classes.or}>or</Typography>
            <Grid container>
              <Grid item xs={12} sm={6}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<Icon className="fab fa-google" />}
                  className={classes.submitGg}
                  onClick={handleSignInGoogle}
                >
                  Sign in with Google
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<Icon className="fab fa-facebook-f" />}
                  className={classes.submitFb}
                  onClick={handleSignInFacebook}
                >
                  Sign in with Facebook
                </Button>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item>
                <Link
                  style={{ textDecoration: "none", color: "blue" }}
                  to="/signUp"
                >
                  Don't have an account? Sign Up
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}
