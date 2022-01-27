import React, { useState, useEffect } from "react";
import { updatePost, getAllPosts} from '../database/firebase'
import Post from '../components/Post';
import '../styles/styles.css';
import { getRandomSadEmoji } from "../components/randomEmoji";

function Feed({user}) {
    const [posts, setPosts] = useState({});
    const [pulled, setPulled] = useState(false);

    useEffect(() => {
        if (!pulled) {
            getAllPosts((retrivedData) => {
            if (retrivedData) {
                var allPosts = {};
                Object.keys(retrivedData).forEach(user => {
                    Object.keys(retrivedData[user]).forEach(postName => {
                        allPosts[postName] = retrivedData[user][postName];
                    })
                })
                console.log('all posts', allPosts)
                setPosts(allPosts);
                setPulled(true);
            }
          });
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
        <div className="insta background extramargin fullsize">
            {
                Object.keys(posts).length === 0 ?
                 <h1 className='large' style={{ marginTop: '2rem'}}>No posts found. {getRandomSadEmoji()}</h1>
                :
                Object.keys(posts).reverse().map(post => 
                    <Post user={user} key={post} post={posts[post]} postName={post} onPostLike={onLike} page={'feed'}/>
                )
            }
        </div>
    )
}

export default Feed
