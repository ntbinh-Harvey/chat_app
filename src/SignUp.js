import { React, useState } from "react";
import {
  Button,
  CssBaseline,
  TextField,
  Paper,
  Grid,
  Typography,
  MenuItem,
  makeStyles,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import md5 from "md5";
import { auth, database } from "./firebase";

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
    margin: theme.spacing(3, 0, 2),
    background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
    color: "white",
  },
  submitFb: {
    margin: theme.spacing(3, 0, 2),
    background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
    color: "white",
  },
}));

const genders = [
  {
    value: "Male",
    label: "Male",
  },
  {
    value: "Female",
    label: "Female",
  },
  {
    value: "Others",
    label: "Others",
  },
];

export default function SignUp({ handleChangeAuthAndFilled }) {
  const classes = useStyles();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [nickname, setNickname] = useState();
  const [gender, setGender] = useState("Male");
  const [birthday, setBirthday] = useState();
  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
  };
  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  };
  const handleChangeNickname = (e) => {
    setNickname(e.target.value);
  };
  const handleChangeGender = (e) => {
    setGender(e.target.value);
  };
  const handleChangeBirthday = (e) => {
    setBirthday(e.target.value);
  };
  let photoURL;
  const handleSubmit = async (e) => {
    e.preventDefault();
    const userCredential = await auth.createUserWithEmailAndPassword(
      email,
      password
    );
    const uid = userCredential.user.uid;
    if (!userCredential.photoURL) {
      const hashEmail = md5(email);
      photoURL =
        "https://www.gravatar.com/avatar/" + hashEmail + "?d=identicon";
    }
    const userData = {
      uid: uid,
      nickname: nickname,
      email: email,
      gender: gender,
      birthday: birthday,
      photoURL: photoURL,
      inConversation: false,
      beingCalled: "no",
      status: "Online",
    };
    await database.ref("users/" + uid).set(userData);
    handleChangeAuthAndFilled(true);
  };
  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Typography variant="h4">Sign up</Typography>
          <form className={classes.form} noValidate onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              onChange={handleChangeEmail}
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              onChange={handleChangePassword}
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <TextField
              margin="normal"
              required
              onChange={handleChangeNickname}
              fullWidth
              name="nickname"
              label="Nickname"
              id="nickname"
              autoComplete="nickname"
            />
            <TextField
              margin="normal"
              select
              required
              onChange={handleChangeGender}
              fullWidth
              value={gender}
              name="gender"
              label="Gender"
              id="gender"
            >
              {genders.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              margin="normal"
              required
              onChange={handleChangeBirthday}
              id="birthday"
              label="Birthday"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign up
            </Button>
            <Link
              style={{ textDecoration: "none", color: "blue" }}
              to="/signIn"
            >
              Back to sign in page
            </Link>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}
