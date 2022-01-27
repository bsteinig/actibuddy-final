import React from 'react'
import '../styles/landing.css';

function Home({user}){
    return (
        <div className="background extrastuff">
            <div className="block">
                <h1 className="top-title white">Let's explore</h1>
            </div>
            <h1 className="top-title">together</h1>
            <p className="third">Join a motivating community of adventurers today.</p>
            {user ?
                <a className="loginbtn" href="/explore">start exploring</a>
            :
                <a className="loginbtn" href="/login">start exploring</a>
            }
        </div>
    )
}

export default Home