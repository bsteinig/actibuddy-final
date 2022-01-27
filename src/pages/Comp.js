import React, { useState, useEffect, useRef} from 'react'
import { getRandomSadEmoji } from "../components/randomEmoji";
import '../styles/comps.css';
import image1 from '../images/20hikes.jpg'
import image2 from '../images/friendhike.jpg'
import Loader from 'react-spinner-loader'
import { acceptFriendRequest, friendList, sentList, removeFriend, removeRequest, requestList, allUsers, sendRequestToUser } from '../database/firebase';
import '../styles/sidebar.css'
import { storage, newImage, writePost, getUserPosts, updatePost } from '../database/firebase'
import UserCard from '../components/UserCard';
import SearchCard from '../components/SearchCard';
import InfoCard from '../components/InfoCard';
import image3 from '../images/newplace.jpg'
import Competition from '../components/Compeition';




function Comp({user}) {

  const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
    ];

    var dateObj = new Date(user.metadata.creationTime);
    var month = dateObj.getMonth();
    var year = dateObj.getFullYear();
    const [friends, setFriends] = useState({});
    const [requests, setRequests] = useState({});
    const [sent, setSent] = useState({});
    const [all, setAll] = useState({});
    const [query, setQuery] = useState('')
    const [results, setResults] = useState({})
    const [pulled, setPulled] = useState(false);
    const [num, setNum] = useState(0);
    const [num2, setNum2] = useState(0);
    const [Player1, setPlayer1] = useState("");
    const [PLayer2, setPlayer2] = useState("");
    const [create, setCreate] = useState(false)
    const [spinner, setSpinner] = useState(false);


    function newComp(url){
      var date = new Date();
      let data = {
          num: 0,
          num2:0, 
          Player1: 0, 
          Player2: 0,
            };
            writePost(data);
          }


      const handleFormSubmit = () => {
            setSpinner(true);
            setCreate(false)
        }



    return (
      <div className='competitions'>
        <div className="box">
          <h1 className="writing"> Your Daily Competition </h1>
          <div className="box2">
          {create ?
                <div className="post-creation">
                    {  spinner ?
                        <div className="spinner">
                            <Loader
                                type="Rings"
                                color="#0f9bd1"
                                height={150}
                                width={150}
                                marginTop={15}
                                visible={true}
                                style={{display:'flex', justifyContent:'center', marginTop:'1rem' }}
                            />  
                        </div>  
                    :
                    <div className="flex">
                        <button onClick={() => {setCreate(!create)}} className="btn btn-x"><i className="fas fa-times-circle"></i></button>
                        <h1 className="title-bar">Add a new Competition</h1>
                        <div className="text-in">
                            <span className="prompt">Person1: </span> 
                            <input type="text" className="input-text"
                            value={Player1} onChange={(e) => setPlayer1(e.target.value)}/>
                        </div>
                        <div className="text-in">
                            <span className="prompt">Person2: </span> 
                            <input type="text" className="input-text"
                            value={PLayer2} onChange={(e) => setPlayer2(e.target.value)}/>
                        </div>
              
                        
                        <button className="pro-import submit-btn" onClick={handleFormSubmit}>
                        Upload
                        </button>
                    </div>
                    }
                </div>
            :
                <div className='spacer-new'>
                    <button onClick={() => {setCreate(!create)}} className="btn btn-plus"><i className="fas fa-plus-circle"></i></button>
                </div>
            }</div></div>

        </div> 
     
    );
    
}

export default Comp
