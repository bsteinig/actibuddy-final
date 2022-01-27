
   
import React from "react";
import '../styles/post.css';
import {deletePost } from '../database/firebase'
import {Link} from 'react-router-dom'
import moment from "moment";

function Post({user, post, postName, onPostLike, page}) {

	console.log('post',post)

	var date = new Date(post.created_at)
	

	// make it so delete button only shows up if the post user is 
	return (
		<div className={`post ${page === 'pro' ? 'p-small' : ''}`}>
			{page === 'feed' ?
			<div className="name-bar">
				 <Link to={`/profile/${post.user}`}><h1 className="name">{post.username}</h1></Link>
			</div>
			:
			<></>
			}
			<img className={`postImage ${page === 'pro' ? 'pI-small' : ''}`} src={post.img}/>
			<div className="bottom-group">
				<h2 className={`capti ${page === 'pro' ? 'capti-small' : ''}`}>{post.caption}</h2>
				<h4 className={`type ${page === 'pro' ? 'type-small' : ''}`}>{post.type}</h4>
				<p>{moment(date).calendar()}</p>
				<div className="postlikes">
					<h3 className={`texty ${page === 'pro' ? 't-small' : ''}`}>{post.usersLiked ? post.usersLiked.length : 0}&nbsp;</h3>
					<i style={{cursor: "pointer"}} onClick={() => onPostLike(postName)} className={`${post.usersLiked && post.usersLiked.includes(user.uid) ? 'fas fa-heart pink' : 'far fa-heart pink'}`}></i>
				</div>
				{post.username === user.displayName &&
				<div className="deleteButton">
					<button onClick={() => deletePost(postName, post.user)}>Delete</button>
				</div>
				}
				
			</div>
			
		</div>
	)
}

export default Post