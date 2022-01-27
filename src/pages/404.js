import React from 'react'
import { getRandomSadEmoji } from '../components/randomEmoji'
import '../styles/404.css'

function NotFoundPage() {
    return (
        <div className="insta background extramargin fullsize">
            <div className="error-box">
                <h1 className="emoji">{ getRandomSadEmoji() }</h1>
                <h1 className="large"> You've wandered into an unknown region </h1>
                <a className="loginbtn" href="/">back home</a>
            </div>
           
        </div>
    )
}

export default NotFoundPage