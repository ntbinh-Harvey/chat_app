import { useState, useEffect } from "react";
import { Redirect, Switch, Route } from "react-router-dom";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import ChatRoom from "./ChatRoom";
import MoreInformation from "./MoreInformation";
import LoadingComponent from "./LoadingComponent";
import useAsync from "./hooks/useAsync";
import { auth, database } from "./firebase";

const style = {
  height: "100vh",
  width: "100%",
};

export default function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [authenticatedAndFilled, setAuthenticatedAndFilled] = useState(false);
  const [userFirebaseData, setUserFirebaseData] = useState({});
  const { isLoading, run } = useAsync();

  const handleChangeAuthAndFilled = (value) => {
    setAuthenticatedAndFilled(value);
  };

  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        console.log("user log in");
        database.ref(".info/connected").on("value", (snap) => {
          if (snap.val() === true) {
            database.ref("/users/" + user.uid).update({ status: "Online" });
          }
        });
        await database
          .ref("users/" + user.uid)
          .onDisconnect()
          .update({
            status: "Offline",
            inConversation: false,
            beingCalled: "no",
          });
        run(
          database
            .ref("users/" + user.uid)
            .get()
            .then((snapshot) => {
              if (Object.keys(snapshot.val()).length <= 1) {
                setAuthenticated(true);
              } else {
                setAuthenticatedAndFilled(true);
              }
            })
        );
        setUserFirebaseData(user);
      } else {
        console.log("user log out");
        if (userFirebaseData.uid) {
          database.ref("users/" + userFirebaseData.uid).update({
            status: "Offline",
            inConversation: false,
            beingCalled: "no",
          });
        }
        setAuthenticated(false);
        setAuthenticatedAndFilled(false);
        //refactor this to avoid garbage data
        setUserFirebaseData({});
      }
    });
  }, [run, userFirebaseData.uid]);

  return (
    <div className="App" style={style}>
      <Switch>
        <Redirect exact from="/" to="/signin" />
        <Route
          path="/signin"
          render={() => {
            if (isLoading) return <LoadingComponent />;
            if (authenticated) {
              return <Redirect to="/moreInformation" />;
            } else if (authenticatedAndFilled) {
              return <Redirect to="/chatRoom" />;
            } else {
              return <SignIn />;
            }
          }}
        />
        <Route
          path="/signup"
          render={() => {
            if (isLoading) return <LoadingComponent />;
            if (authenticatedAndFilled) {
              return <Redirect to="/chatRoom" />;
            } else {
              return (
                <SignUp handleChangeAuthAndFilled={handleChangeAuthAndFilled} />
              );
            }
          }}
        />
        <Route
          path="/moreInformation"
          render={() => {
            if (isLoading) return <LoadingComponent />;
            if (authenticatedAndFilled) {
              return <Redirect to="/chatRoom" />;
            } else if (authenticated) {
              return (
                <MoreInformation
                  handleChangeAuthAndFilled={handleChangeAuthAndFilled}
                  user={userFirebaseData}
                />
              );
            } else {
              return <Redirect to="/" />;
            }
          }}
        />
        <Route
          path="/chatRoom"
          render={() => {
            if (isLoading) return <LoadingComponent />;
            if (authenticatedAndFilled) {
              return (
                <ChatRoom
                  handleChangeAuthAndFilled={handleChangeAuthAndFilled}
                  user={userFirebaseData}
                />
              );
            } else if (authenticated) {
              return <Redirect to="/moreInformation" />;
            } else {
              return <Redirect to="/" />;
            }
          }}
        />
      </Switch>
    </div>
  );
}
