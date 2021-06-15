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
import md5 from "md5";
import { database } from "./firebase";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  image: {
    backgroundImage: "url(https://source.unsplash.com/random)",
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
export default function MoreInformation({ handleChangeAuthAndFilled, user }) {
  const classes = useStyles();
  const [nickname, setNickname] = useState();
  const [gender, setGender] = useState("Male");
  const [birthday, setBirthday] = useState();
  const handleChangeNickname = (e) => {
    setNickname(e.target.value);
  };
  const handleChangeGender = (e) => {
    setGender(e.target.value);
  };
  const handleChangeBirthday = (e) => {
    setBirthday(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const uid = user.uid;
      const email = user.email;
      let photoURL = user.photoURL;
      if (!photoURL) {
        const hashEmail = md5(email);
        photoURL =
          "https://www.gravatar.com/avatar/" + hashEmail + "?d=identicon";
      }
      const userData = {
        uid: uid,
        email: email,
        nickname: nickname,
        gender: gender,
        birthday: birthday,
        photoURL: photoURL,
        inConversation: false,
        beingCalled: "no",
      };
      await database.ref("users/" + uid).update(userData);
      handleChangeAuthAndFilled(true);
    } catch (error) {
      alert("Sign in err: " + error.code + " " + error.message);
    }
  };
  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            Please fill in more information
          </Typography>
          <form className={classes.form} noValidate onSubmit={handleSubmit}>
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
              Submit
            </Button>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}
