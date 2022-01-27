import React, { useState, useEffect } from 'react'
import { getUser, getUserPosts } from '../database/firebase'
import { updatePost } from '../database/firebase';
import Post from '../components/Post';

import '../styles/profile.css'
import { useParams } from 'react-router';

function ProfileView({user}) {

    const params = useParams()
    const {profileId} = params;
    //console.log( params)

    const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
    const [posts, setPosts] = useState({});
    const [pulled, setPulled] = useState(false);
    const [userData, setUser] = useState({})
    const [dateObj, setDateObj] = useState(new Date())

    useEffect(() => {
        if (!pulled) {
            //console.log('uid', user.uid)
            getUserPosts(profileId, (retrivedData) => {
            if (retrivedData) {
                setPosts(retrivedData);
                setPulled(true);
            }
            });
            getUser(profileId, (data) => {
                if(data) {
                    console.log(data)
                    setUser(data)
                    setDateObj(new Date(data.metadata.creationTime));
                }
            })
        }
    }, [pulled, user]);

    const onLike = (postName) => {
        const newPost = {...posts[postName]}
        const newPosts = {...posts};

        if(newPost.usersLiked && newPost.usersLiked.includes(user.uid)){
            const index = newPost.usersLiked.indexOf(user.uid);
            if (index > -1) {
                newPost.usersLiked.splice(index, 1);
            }
        }else{
            if(!newPost.usersLiked){
                newPost.usersLiked = [];
            }
            newPost.usersLiked.push(user.uid)
        }

        newPosts[postName] = newPost;

        updatePost(postName, newPost);

        setPosts(newPosts);
    }

    return (
        <div className="background fullsize">
            <div className="profile-bar">
                <div className="propic-pro">
                    <img className="proimg" src={userData.photoURL} alt="propic"/>
                </div>
                <div className="text-box">
                    <h1 className="name">{userData.displayName}</h1>
                    <p className="sub-head">joined <span className="date">{monthNames[dateObj.getMonth()]}&nbsp;{dateObj.getFullYear()}</span></p>
                </div>
            </div>
            <div className="grid">
            {
                Object.keys(posts).reverse().map(post => 
                    <Post user={user} key={post} post={posts[post]} postName={post} onPostLike={onLike} page={'pro'}/>
                )
            }
            </div>
            
        </div>
    )
}

export default ProfileView
