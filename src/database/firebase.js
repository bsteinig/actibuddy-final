import firebase from "firebase";
import "firebase/auth";
import "firebase/database";
import "firebase/app";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBIDkKdkHzCfTH9Ev8TRCJVv_Jtfx1dUdw",
  authDomain: "actibuddy.firebaseapp.com",
  databaseURL: "https://actibuddy-default-rtdb.firebaseio.com",
  projectId: "actibuddy",
  storageBucket: "actibuddy.appspot.com",
  messagingSenderId: "435796026670",
  appId: "1:435796026670:web:c7d2e4f627f337428ac6bf",
  measurementId: "G-EFHR4DYPVF",
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();

export const auth = firebase.auth();
export const storage = firebase.storage();
const googleProvider = new firebase.auth.GoogleAuthProvider();

export const signInWithGoogle = (setUser) => {
  auth
    .signInWithPopup(googleProvider)
    .then((res) => {
      const { displayName, email, uid, photoURL, metadata } = res.user;
      let user = {
        displayName,
        email,
        uid,
        photoURL,
        metadata,
      };
      console.log(user);
      if (res.user.metadata.creationTime === res.user.metadata.lastSignInTime) {
        console.log("new account");
        createUserData(user);
      }
      localStorage.setItem("user", JSON.stringify(user));
      setUser("logged in");
    })
    .catch((error) => {
      console.log(error.message);
    });
};

export const logOut = (setuser) => {
  auth
    .signOut()
    .then(() => {
      localStorage.setItem("user", null);
      setuser("not logged in");
    })
    .catch((error) => {
      console.log(error.message);
    });
};

export const writePost = (data) => {
  var defaultDatabase = firebase.database();
  let ref = defaultDatabase.ref("/");
  ref.child(`posts/${data.user}`).push(data);
  console.log(data);
};

export const deletePost = (postId, uid) => {
  var defaultDatabase = firebase.database();
  let ref = defaultDatabase.ref("/");
  ref.child(`posts/${uid}/${postId}`).remove();
  console.log("deleted", postId);
};

export const updatePost = (postName, data) => {
  var defaultDatabase = firebase.database();
  let ref = defaultDatabase.ref("/");
  let newPost = ref.child(`posts/${data.user}/${postName}`);
  newPost.set(data);
  console.log(data);
};

export const getUserPosts = (uid, callback) => {
  var defaultDatabase = firebase.database();
  let ref = defaultDatabase.ref("/");
  let posts = ref.child(`posts/${uid}`);
  posts.on("value", (snapshot) => {
    callback(snapshot.val());
  });
};

export const getAllPosts = (callback) => {
  var defaultDatabase = firebase.database();
  let ref = defaultDatabase.ref("/");
  let posts = ref.child(`posts`);
  posts.on("value", (snapshot) => {
    callback(snapshot.val());
  });
};

export const newImage = (user, imgLink) => {
  var defaultDatabase = firebase.database();
  let ref = defaultDatabase.ref("/");
  let newImage = ref.child(`images/${user.uid}`).push();
  newImage.set({ link: imgLink });
};

export const getImages = (user, callback) => {
  var defaultDatabase = firebase.database();
  let ref = defaultDatabase.ref("/");
  let images = ref.child(`images/${user.uid}`);
  images.on("value", (snapshot) => {
    callback(snapshot.val());
  });
};

// Friending Functions //
/*
    Database Overview:

    firebase{
        users{
            <generatedUserId>{
                requests{
                    otherUser: "id"
                }
                friends{
                    otherUser: "id"
                }
            }
        }
    }
*/

const createUserData = (data) => {
  var defaultDatabase = firebase.database();
  let ref = defaultDatabase.ref("/");
  ref.child(`users/${data.uid}`).set(data);
  console.log(data);
};

export const getCurrentUser = () => {
  auth.onAuthStateChanged(async (userData) => {
    const { displayName, email, uid, photoURL } = userData;
    let user = {
      displayName,
      email,
      uid,
      photoURL,
    };
    console.log(user);
    return user;
  });
};

export const getUser = (uid, callback) => {
  var defaultDatabase = firebase.database();
  let ref = defaultDatabase.ref("/");
  let user = ref.child(`users/${uid}`);
  user.on("value", (snapshot) => {
    callback(snapshot.val());
  });
};

export const sendRequestToUser = (uid) => {
  let currentUser = auth.currentUser;
  var defaultDatabase = firebase.database();
  let ref = defaultDatabase.ref("/");
  let requests = ref.child(`users/${uid}/requests`);
  requests.update({ [`${currentUser.uid}`]: `${currentUser.uid}` });
  let sent = ref.child(`users/${currentUser.uid}/sent`);
  sent.update({ [`${uid}`]: `${uid}` });
  console.log("Request Sent");
};

export const acceptFriendRequest = (uid, callback) => {
  let currentUser = auth.currentUser;
  var defaultDatabase = firebase.database();
  let ref = defaultDatabase.ref("/");
  let requests = ref.child(`users/${currentUser.uid}/requests/${uid}`);
  let sent = ref.child(`users/${uid}/sent/${currentUser.uid}`);
  let friend = ref.child(`users/${currentUser.uid}/friends/`);
  let friend2 = ref.child(`users/${uid}/friends/`);
  requests
    .get()
    .then((snapshot) => {
      console.log(snapshot.val()); // null if doesn't exist
      if (snapshot.val() != null) {
        requests.remove();
        sent.remove();
        friend.update({ [`${uid}`]: `${uid}` });
        friend2.update({ [`${currentUser.uid}`]: `${currentUser.uid}` });
        console.log("Friend Request Accepted");
      }
    })
    .then(() => {
      callback(true);
    });
};

export const removeRequest = (uid, callback) => {
  let currentUser = auth.currentUser;
  var defaultDatabase = firebase.database();
  let ref = defaultDatabase.ref("/");
  let exFriend = ref.child(`users/${currentUser.uid}/requests/${uid}`);
  let sent = ref.child(`users/${uid}/sent/${currentUser.uid}`);
  exFriend.remove().then(() => {
    sent.remove();
    callback(true);
  });
  console.log("Request Removed");
};

export const removeFriend = (uid, callback) => {
  let currentUser = auth.currentUser;
  var defaultDatabase = firebase.database();
  let ref = defaultDatabase.ref("/");
  let exFriend = ref.child(`users/${currentUser.uid}/friends/${uid}`);
  let exFriend2 = ref.child(`users/${uid}/friends/${currentUser.uid}`);
  exFriend.remove().then(() => {
    exFriend2.remove();
    callback(true);
  });
  console.log("Friend Removed");
};

export const friendList = (uid, callback) => {
  var defaultDatabase = firebase.database();
  let ref = defaultDatabase.ref("/");
  let friends = ref.child(`users/${uid}/friends/`);
  friends.on("value", (snapshot) => {
    //console.log(snapshot.val()) // null if doesn't exist
    callback(snapshot.val());
  });
};

export const requestList = (uid, callback) => {
  var defaultDatabase = firebase.database();
  let ref = defaultDatabase.ref("/");
  let requests = ref.child(`users/${uid}/requests/`);
  requests.on("value", (snapshot) => {
    //console.log(snapshot.val()) // null if doesn't exist
    callback(snapshot.val());
  });
};

export const sentList = (uid, callback) => {
  var defaultDatabase = firebase.database();
  let ref = defaultDatabase.ref("/");
  let sent = ref.child(`users/${uid}/sent/`);
  sent.get().then((snapshot) => {
    //console.log(snapshot.val()) // null if doesn't exist
    callback(snapshot.val());
  });
};

export const allUsers = (callback) => {
  var defaultDatabase = firebase.database();
  let ref = defaultDatabase.ref("/");
  let users = ref.child(`users/`);
  users.get().then((snapshot) => {
    //console.log(snapshot.val()) // null if doesn't exist
    callback(snapshot.val());
  });
};
