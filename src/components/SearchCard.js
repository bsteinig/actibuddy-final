import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getUser, sendRequestToUser } from '../database/firebase'
import '../styles/usercard.css'

function SearchCard({uid, type, sendRequest}) {

    const [user,setUser] = useState({})
    const [pulled, setPulled] = useState(false)

    useEffect(() => {
        if(!pulled){
            getUser(uid, (userData) => {
                setUser(userData)
                setPulled(true)
            })
        }
    }, [user, pulled])

    return (
        <div>
            {user == null ?
                <h3>Loading...</h3>
            :
            <div className='user-flex'>
                <Link to={`/profile/${uid}`}>
                <div className="left-group">
                    <img className='user-img' src={user.photoURL}/>
                    <p>{user.displayName}</p>
                </div>
                </Link>
                <div className="right-group">
                    {
                        type === 'request' ?
                        <button className="search-btn" onClick={() => sendRequest(uid)}>{type}</button>
                        :
                        <div className="search-btn">{type}</div>
                    }
                </div>
            </div>
            }
        </div>
    )
}

export default SearchCard
