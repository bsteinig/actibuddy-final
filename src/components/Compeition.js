
import React from "react";
import '../styles/post.css';
import {Link} from 'react-router-dom'
import moment from "moment";

function Competition({user, comp, postName, page}) {
	

	// make it so delete button only shows up if the post user is 
	return (

			<div className="bottom-group">
			<div className="name-bar">
				 <h1 className="name">{comp.Player1}</h1>
			</div>
			<div className="name-bar">
				 <h1 className="name">{comp.Player2}</h1>
			</div>
				<h2 className={`num ${page === 'pro' ? 'num-small' : ''}`}>{comp.num}</h2>
				<h4 className={`type ${page === 'pro' ? 'type-small' : ''}`}>{comp.num2}</h4>
				
			</div>
			
	)
}

export default Competition