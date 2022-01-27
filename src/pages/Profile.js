import React, {useState, useEffect} from 'react'
import { storage, newImage, writePost, getUserPosts, updatePost } from '../database/firebase'
import Resizer from "react-image-file-resizer";
import Loader from 'react-spinner-loader'
import Post from '../components/Post';
import '../styles/profile.css'

function Profile({user}) {

    const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
    ];
    const [file, setFile] = useState(null);
    const [create, setCreate] = useState(false)
    const [caption, setCaption] = useState("");
    const [type, setType] = useState("");

    const [posts, setPosts] = useState({});
    const [pulled, setPulled] = useState(false);
    const [spinner, setSpinner] = useState(false);

    var dateObj = new Date(user.metadata.creationTime);
    var month = dateObj.getMonth();
    var year = dateObj.getFullYear();

    useEffect(() => {
        if (!pulled) {
            //console.log('uid', user.uid)
            getUserPosts(user.uid, (retrivedData) => {
            if (retrivedData) {
                setPosts(retrivedData);
                setPulled(true);
            }
          });
        }
    }, [user]);

    const handleImageAsFile = (e) => {
        if(e.target.files[0]){
            try {
                Resizer.imageFileResizer(
                  e.target.files[0],
                  400,
                  400,
                  "JPEG",
                  100,
                  0,
                  (uri) => {
                    console.log(uri);
                    setFile(uri);
                  },
                  "file",
                  300,
                  300,
                );
            } catch (err) {
                console.log(err);
            }
        }
    }

    function newPost(url){
        var date = new Date();
		let data = {
			img: url,
            caption: caption,
			likes: 0,
            user: user.uid,
            created_at: date.toISOString(),
            usersLiked: [user.uid],
            username: user.displayName,
            type: type
		};
		writePost(data);
        setFile(null)
        setCaption('')
        setType('')
	}
    
    const handleImageSubmit = (callback) => {
        if(file != null){
        const uploadTask = storage.ref(`images/${file.name}`).put(file);
        uploadTask.on(
            "state_changed",
            snapshot => {},
            error => {
            console.log(error)
            },
            () => {
            storage
                .ref("images")
                .child(file.name)
                .getDownloadURL()
                .then(url => {
                    console.log(url)
                    newImage(user, url);
                    setFile(null);
                    setSpinner(false)
                    callback(url);
                })
            }
        )
        }
    };

    const handleFormSubmit = () => {
        setSpinner(true);
        handleImageSubmit(url => {
            newPost(url);
        })
        setCreate(false)
    }

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
                    <img className="proimg" src={user.photoURL} alt="propic"/>
                </div>
                <div className="text-box">
                    <h1 className="name">{user.displayName}</h1>
                    <p className="sub-head">joined <span className="date">{monthNames[month]}&nbsp;{year}</span></p>
                </div>
            </div>
            {create ?
                <div className="post-creation">
                    {  spinner ?
                        <div className="spinner">
                            <Loader
                                type="Rings"
                                color="#0f9bd1"
                                height={150}
                                width={150}
                                visible={true}
                                style={{display:'flex', justifyContent:'center', marginTop:'1rem' }}
                            />  
                        </div>  
                    :
                    <div className="flex">
                        <button onClick={() => {setCreate(!create)}} className="btn btn-x"><i className="fas fa-times-circle"></i></button>
                        <h1 className="title-bar">Add a new Activity</h1>
                        <div className="text-in">
                            <span className="prompt">caption: </span> 
                            <input type="text" className="input-text"
                            value={caption} onChange={(e) => setCaption(e.target.value)}/>
                        </div>
                        <div className='type-in'>
                            <span className="prompt">type: </span> 
                            <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
                                <input type="radio" className="btn-check" name="btnradio" id="btnradio1" autoComplete="off" onClick={() => setType("🚶‍♂️ Walk")}/>
                                <label className="btn btn-outline-primary" htmlFor="btnradio1">🚶‍♂️ Walk</label>

                                <input type="radio" className="btn-check" name="btnradio" id="btnradio2" autoComplete="off" onClick={() => setType("🏃‍♂️ Run")}/>
                                <label className="btn btn-outline-primary" htmlFor="btnradio2">🏃‍♂️ Run</label>

                                <input type="radio" className="btn-check" name="btnradio" id="btnradio3" autoComplete="off" onClick={() => setType("🚴‍♂️ Bike")}/>
                                <label className="btn btn-outline-primary" htmlFor="btnradio3">🚴‍♂️ Bike</label>
                            </div>
                        </div>
                        <div className='file-in'>  
                            <span className="prompt">image: </span>  
                            <input type='file' className='input-file'
                            onChange={handleImageAsFile}/>
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
            }
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

export default Profile