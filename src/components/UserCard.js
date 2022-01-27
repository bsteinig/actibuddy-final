import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getUser } from '../database/firebase'
import '../styles/usercard.css'

 const UserCard = ({uid, handleRemove, handleAccept, request}) => {

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
        <div className='user-card'>
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
                    {request ?
                    <div>
                        <button onClick={() => handleAccept(uid)}><i className="far fa-check-circle"></i></button>
                        <button onClick={() => handleRemove(uid)}><i className="far fa-times-circle"></i></button>
                    </div>
                    :
                    <button onClick={() => handleRemove(uid)}><i className="far fa-times-circle"></i></button>
                    }
                </div>
            </div>
            
            }  
        </div>
    )
}

export default UserCard
