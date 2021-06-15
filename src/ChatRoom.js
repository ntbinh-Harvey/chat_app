import { useState, useEffect, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Avatar,
  Typography,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Container,
  Modal,
  TextField,
} from "@material-ui/core";
import { firebase, auth, database } from "./firebase";

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: "center",
  },
  userInfo: {
    width: "100%",
    maxWidth: 300,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  content: {
    marginTop: 50,
  },
  online: {
    color: "green",
    fontSize: 13,
  },
  offline: {
    color: "red",
    fontSize: 13,
  },
  conversation: {
    color: "#F40",
    fontSize: 13,
  },
  paper: {
    position: "fixed",
    top: 100,
    left: 550,
    width: 700,
    backgroundColor: theme.palette.background.paper,
    border: "1px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  receivedUserMessage: {
    background: "#E4E6EB",
    borderRadius: 20,
    padding: 10,
  },
  sentUserMessage: {
    background: "#0099FF",
    color: "white",
    borderRadius: 20,
    padding: 10,
  },
  list: {
    overflow: "auto",
    height: 500,
    marginBottom: 20,
    border: "1px solid gray",
  },
  btnSend: {
    background: "#0099FF",
    color: "white",
    marginTop: 10,
  },
}));

export default function ChatRoom({ user }) {
  const sentUid = user.uid;
  const classes = useStyles();
  const [photoURL, setPhotoURL] = useState("");
  const [email, setEmail] = useState("");
  const [listUser, setListUser] = useState([]);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [listMessage, setListMessage] = useState([]);
  const [receivedUid, setReceivedUid] = useState("");
  console.log("receivedUid", receivedUid);
  console.log("sentUser", sentUid);

  const handleInConversationSentUser = useCallback(() => {
    database
      .ref("messages/")
      .orderByChild("timestamp")
      .on("value", (snapshot) => {
        const listMessageFromDB = Object.keys(snapshot.val()).map(
          (messageId) => snapshot.val()[messageId]
        );
        const messageArray = [];
        listMessageFromDB.forEach((message) => {
          if (
            (message.receivedUser === receivedUid &&
              message.sentUser === sentUid) ||
            (message.receivedUser === sentUid &&
              message.sentUser === receivedUid)
          ) {
            messageArray.push(message);
          }
        });
        setListMessage(messageArray);
      });
  }, [receivedUid, sentUid]);

  const handleCloseModal = async () => {
    await database.ref("users/" + sentUid).update({ inConversation: false });
    await database
      .ref("users/" + receivedUid)
      .update({ inConversation: false });
    setOpen(false);
  };

  const handleStatus = (user) => {
    if (user.status === "Online" && user.inConversation === true) {
      return (
        <Typography className={classes.conversation}>
          In conversation
        </Typography>
      );
    } else if (user.status === "Online" && user.inConversation === false) {
      return <Typography className={classes.online}>Online</Typography>;
    } else {
      return <Typography className={classes.offline}>Offline</Typography>;
    }
  };

  // pass
  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        alert("Sign out successfully");
      })
      .catch((error) => {
        alert(
          `There is something wrong when signing out: ${error}, please try again`
        );
      });
  };

  //pass
  const handleSendMessageToDatabase = async () => {
    await database.ref("messages/").push({
      sentUser: sentUid,
      receivedUser: receivedUid,
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      message: message,
    });
    setMessage("");
  };

  const handleListItemClick = async (receivedUid) => {
    await database.ref("users/" + sentUid).update({ inConversation: true });
    await database.ref("users/" + receivedUid).update({ inConversation: true });
    setReceivedUid(receivedUid);
  };

  const handleKeyUp = (e) => {
    if (e.keyCode === 13) {
      handleSendMessageToDatabase();
    }
  };

  useEffect(() => {
    database.ref("users/" + sentUid).on("value", async (snapshot) => {
      if (snapshot.val().inConversation) {
        if (receivedUid) {
          await database
            .ref("users/" + receivedUid)
            .update({ beingCalledByUid: sentUid });
        } else {
          setReceivedUid(snapshot.val().beingCalledByUid);
        }
        setOpen(true);
        handleInConversationSentUser();
      } else {
        setOpen(false);
        await database.ref("users/" + sentUid).update({ beingCalledByUid: "" });
      }
    });
    database
      .ref("users/" + sentUid)
      .child("beingCalledByUid")
      .on("value", (snapshot) => {
        if (!snapshot.val()) {
          setReceivedUid("");
        }
      });
  }, [handleInConversationSentUser, receivedUid, sentUid]);

  // load initial list user
  useEffect(() => {
    database.ref("users/" + sentUid).on("value", (snapshot) => {
      if (snapshot.exists()) {
        setPhotoURL(snapshot.val().photoURL);
        setEmail(snapshot.val().email);
      } else {
        alert("Chat room err: Get Data Current User: No data available");
      }
    });
    database.ref("users").on("value", (snapshot) => {
      const userArray = [];
      snapshot.forEach((user) => {
        userArray.push(user.val());
      });
      setListUser(userArray);
    });
  }, [sentUid]);

  const modalBody = (
    <div className={classes.paper}>
      <List className={classes.list}>
        {listMessage.map((messageData) => {
          if (messageData.sentUser === receivedUid) {
            return (
              <ListItem key={messageData.timestamp}>
                <ListItemAvatar>
                  <Avatar alt="Avatar User" src="" />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography
                      component="span"
                      className={classes.receivedUserMessage}
                    >
                      {messageData.message}
                    </Typography>
                  }
                />
              </ListItem>
            );
          } else {
            return (
              <ListItem
                key={messageData.timestamp}
                style={{ textAlign: "right" }}
              >
                <ListItemText
                  primary={
                    <Typography
                      component="span"
                      className={classes.sentUserMessage}
                    >
                      {messageData.message}
                    </Typography>
                  }
                />
              </ListItem>
            );
          }
        })}
      </List>
      <TextField
        fullWidth
        variant="outlined"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyUp={(e) => handleKeyUp(e)}
      />
      <Button onClick={handleSendMessageToDatabase} className={classes.btnSend}>
        Send
      </Button>
    </div>
  );
  return (
    <div className={classes.root}>
      <Container className={classes.header}>
        <ListItem className={classes.userInfo}>
          <ListItemAvatar>
            <Avatar src={photoURL}></Avatar>
          </ListItemAvatar>
          <ListItemText primary={email} />
        </ListItem>
        <Button
          pr={3}
          onClick={() => handleSignOut()}
          variant="contained"
          color="primary"
        >
          Sign out
        </Button>
      </Container>
      <Divider />
      <Container className={classes.content}>
        <List>
          <Typography variant="h4">List User</Typography>
          {
            // eslint-disable-next-line
            listUser.map((user) => {
              if (user.uid !== sentUid)
                return (
                  <ListItem
                    disabled={
                      user.status === "Offline" || user.inConversation === true
                    }
                    button
                    onClick={() => handleListItemClick(user.uid)}
                    key={user.uid}
                    divider
                  >
                    <ListItemAvatar>
                      <Avatar alt="Avatar User" src={user.photoURL} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={user.email}
                      secondary={handleStatus(user)}
                    />
                  </ListItem>
                );
            })
          }
        </List>
      </Container>
      <Modal open={open} onClose={handleCloseModal}>
        {modalBody}
      </Modal>
    </div>
  );
}
