import React, { useState, useEffect, useRef} from 'react'
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import tt from "@tomtom-international/web-sdk-maps";
import '../styles/explore.css'
import '../styles/sidebar.css'
import { acceptFriendRequest, friendList, sentList, removeFriend, removeRequest, requestList, allUsers, sendRequestToUser } from '../database/firebase';
import UserCard from '../components/UserCard';
import SearchCard from '../components/SearchCard';
import InfoCard from '../components/InfoCard';
import CurrentWeather from '../components/CurrentWeather';


function Explore({user}) {

   const popupOffsets = {
    top: [0, 0],
    bottom: [0, -40],
    'bottom-right': [0, -40],
    'bottom-left': [0, -40],
    left: [25, -35],
    right: [-25, -35]
  };

  const markerData = [
    { coords: [-83.719158, 42.281984],
      name: 'Nichols Arboretum'
    },
    {
      coords: [-83.742341,42.295413],
      name: 'Argo Park & Nature Area'
    },
    {
      coords: [-83.753741,42.304870],
      name: 'Barton Nature Area'
    }
  ];

  const places = [
    {
      "title": "Nichols Arboretum",
      "emojis": "🚶🏃",
      "accessibility": "Parking available, Some routes wheelchair accessible, Dogs allowed on leash",
      "difficulty": "Several routes of varying length and difficulty",
      "avg-safety": "4",
      "recent-safety": "5",
      "overall-rating": "4.5",
      "info": "https://mbgna.umich.edu/nichols-arboretum/trails/",
      "directions": "https://www.google.com/maps/place/Nichols+Arboretum,+Ann+Arbor,+MI+48104/@42.2798012,-83.7235567,16z/data=!3m1!4b1!4m5!3m4!1s0x883caef5681704ad:0x47dbe4e1d9d6572f!8m2!3d42.2799544!4d-83.7212419",
      "image": "https://mbgna.umich.edu/wp-content/uploads/2017/09/Laurel-Ridge.jpg"
    },
    {
      "title": "Argo Park & Nature Area",
      "emojis": "🚶🏃🚲🚣🎣",
      "accessibility": "Parking available, Wheelchair accessible, Dogs allowed on leash",
      "difficulty": "Several routes of varying length and difficulty",
      "avg-safety": "4",
      "recent-safety": "5",
      "overall-rating": "4.5",
      "info": "https://www.a2gov.org/departments/Parks-Recreation/parks-places/pages/Argo.aspx",
      "directions": "https://www.google.com/maps/place/Argo+Nature+Area/@42.2959589,-83.7442667,17z/data=!3m1!4b1!4m5!3m4!1s0x883cae0b590ca2a7:0xd0c04ce6ebcbcf30!8m2!3d42.295955!4d-83.742078",
      "image": "https://www.a2gov.org/departments/Parks-Recreation/parks-places/PublishingImages/Pages/Argo/Argo%20Pond.jpg?RenditionID=7"
    },
    {
      "title": "Barton Nature Area",
      "emojis": "🚶🏃🚲🎣",
      "accessibility": "Parking available, Some routes wheelchair accessible, Dogs allowed",
      "difficulty": "Several routes of varying length and difficulty",
      "avg-safety": "4",
      "recent-safety": "5",
      "overall-rating": "4.5",
      "info": "https://www.a2gov.org/departments/Parks-Recreation/parks-places/Pages/BartonNatureArea.aspx",
      "directions": "https://www.google.com/maps/place/Barton+Nature+Area/@42.3072913,-83.7588419,17z/data=!3m1!4b1!4m5!3m4!1s0x883cadfcc5a78333:0x8d28df88aa80d67a!8m2!3d42.3072874!4d-83.7566532",
      "image": "https://www.a2gov.org/departments/Parks-Recreation/parks-places/PublishingImages/Pages/Barton/22222.jpg?RenditionID=7"
    }
  ]

  const weather_api = {
    key: "52407a0c9f59c7941383eaedd8e7b124",
    base: "https://api.openweathermap.org/data/2.5/onecall?"
  }
  const [weatherData, setWeatherData] = useState({})
  let markers = [];
  let popups = [];

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(pos => {
      console.log("Latitude is :", pos.coords.latitude);
      console.log("Longitude is :", pos.coords.longitude);
      let data = {latitude: pos.coords.latitude, longitude: pos.coords.longitude}
      fetch(`${weather_api.base}lat=${data.latitude}&lon=${data.longitude}&units=imperial&appid=${weather_api.key}`)
      .then(res => res.json())
      .then(result => {
        setWeatherData(result)
      });
    });
  }, []);

  const mapElement = useRef()
  const topSpots = [];

  useEffect(() => {

        const _map = tt.map({
          key: "wKAO84a5qgXarMhyXoa1BwQ0W5AfiyI7",
          container: mapElement.current,
          center: [mapLongitude, mapLatitude],
          zoom: 13,
        });
        setMap(_map);
        _map.on("load", () => {
          console.log(typeof(markerData))
          for(var a = 0; a < markerData.length; a++){
            markers[a] = new tt.Marker().setLngLat(markerData[a].coords).addTo(_map);
            popups[a] = new tt.Popup({offset: popupOffsets}).setHTML(`<div class="marker-card"><h5>${markerData[a].name}</h5><a href="#${a+1}">Learn More</a></div>`);
            markers[a].setPopup(popups[a]);
          }
          
          (async () => {
            //_map.addControl(new tt.NavigationControl());
            const response = await fetch(
              "https://api.tomtom.com/geofencing/1/projects/c69478f8-4950-44e5-9d89-653e08fa68f9?&key=wKAO84a5qgXarMhyXoa1BwQ0W5AfiyI7"
            );
            const json = await response.json();
            const fenceIds = json.fences;
            console.log("fenceIds", fenceIds);
            const fenceData = fenceIds.map(async (fence) => {
              const fenceResponse = await fetch(
                "https://api.tomtom.com/geofencing/1/fences/" +
                  fence.id +
                  "?&key=wKAO84a5qgXarMhyXoa1BwQ0W5AfiyI7"
              );
              const fenceJSON = await fenceResponse.json();
              return { id: fenceJSON.id, geometry: fenceJSON.geometry };
            });
    
            console.log("All Promises", fenceData);
            const finishedPromises = await Promise.all(fenceData);
            console.log("Fence Geometry", finishedPromises);
            for(var i = 0; i < 3; i++){
                topSpots.push({name: fenceIds[i].name, id: fenceIds[i].id ,position: finishedPromises[i].geometry.coordinates[0][0]})
            }
            finishedPromises.forEach((fenceStuff) => {
               setPageReady(true)
              _map.addLayer({
                id: fenceStuff.id,
                type: "fill",
                source: {
                  type: "geojson",
                  data: {
                    type: "Feature",
                    geometry: fenceStuff.geometry,
                  },
                },
                layout: {},
                paint: {
                  "fill-color": "#088",
                  "fill-opacity": 0.8,
                },
              });
            });
          })();
        }); // end on load
        
        return () => _map.remove();
      }, []);

    const [friends, setFriends] = useState({});
    const [requests, setRequests] = useState({});
    const [sent, setSent] = useState({});
    const [all, setAll] = useState({});
    const [query, setQuery] = useState('')
    const [results, setResults] = useState({})
    const [pulled, setPulled] = useState(false);

      useEffect(() => {
        friendList(user.uid, (dat1) => {
          if(dat1){
            console.log('friends retrieved')
            setFriends(dat1);
          }
        })
        requestList(user.uid, (dat2) => {
          if(dat2){
            console.log('requests retrieved')
            setRequests(dat2)
          }
        })
        sentList(user.uid, (dat3) => {
          if(dat3){
            console.log('sent requests retrieved')
            setSent(dat3)
          }
        })
        allUsers((dat4) => {
          if(dat4){
            console.log('users retrieved')
            let tempAll = Object.fromEntries(
              Object.entries(dat4).filter(([key,value]) => key !== user.uid)
            )
            setAll(tempAll)
          }
        })
      }, [user])

    const [mapLongitude, setMapLongitude] = useState(-83.74047);
    const [mapLatitude, setMapLatitude] = useState(42.281107);
    const [map, setMap] = useState({});
    const [pageReady, setPageReady] = useState(false)

    const showSidebar = () => {
        var sidebar = document.querySelector(".right-sidebar");
        sidebar.classList.toggle("sidebar-shown")
    }

    function handleRemove(uid){
      removeFriend(uid, (response) => {
        let tempFriends = Object.fromEntries(
          Object.entries(friends).filter(([key,value]) => value !== uid)
        )
        setFriends(tempFriends)
        console.log(response)
      })
    }

    function handleAccept(uid){
      acceptFriendRequest(uid, (response) => {
        let tempRequests = Object.fromEntries(
          Object.entries(requests).filter(([key,value]) => value !== uid)
        )
        setRequests(tempRequests)
        friendList(user.uid, (dat1) => {
          if(dat1){
            setFriends(dat1);
          }
        })
        console.log(response)
      });
    }

    function handleDecline(uid){
      removeRequest(uid, (response) => {
        let tempRequests = Object.fromEntries(
          Object.entries(requests).filter(([key,value]) => value !== uid)
        )
        setRequests(tempRequests)
        console.log(response)
      })
    }

    function handleSearch(){
      let res = Object.fromEntries(
        Object.entries(all).filter(([key,value]) => value.displayName.includes(query))
      )
      setResults(res)
    }

    function sendRequest(uid){
      let tempSent = JSON.parse(JSON.stringify(sent))
      tempSent[uid] = uid;
      console.log(tempSent)
      setSent(tempSent)
      sendRequestToUser(uid);
    }

    return (
        <div className='background fullsize extramargin'>
            <div className="right-sidebar">
              <button className='sidebar-toggle' onClick={() => showSidebar()}>
                  <i className="fas fa-chevron-left"></i>
              </button>
              <div className='sidebar-content'>
                  <h4>Friends</h4>
                  <div className="users-box">
                    {Object.keys(friends).map(
                      friend => <UserCard uid={friend} key={friend} handleRemove={handleRemove} request={false}/>
                    )}
                  </div>
                  <h4>Requests</h4>
                  <div className="users-box">
                    {Object.keys(requests).map(
                      request => <UserCard uid={request} key={request} handleRemove={handleDecline} handleAccept={handleAccept} request={true}/>
                    )}
                  </div>
                </div>
            </div>
            <div className='row align-items-start'>
                <div ref={mapElement} className="col mapDiv"></div>
                <div className="col extramargins right-col">
                    <h2>Find Friends</h2>
                    <input className='friend-search' type='text' placeholder='...' onChange={(e) => {setQuery(e.target.value)}} onKeyPress={(e) => e.key === 'Enter' && handleSearch()} />
                    <div className="extra-box">

                      {Object.keys(results).length === 0 ? 
                      <h2 style={{padding: '10px'}}>No Results Found</h2>
                      :
                      Object.keys(results).map(
                        result => {
                          let f = Object.keys(friends).includes(result);
                          let r = Object.keys(sent).includes(result);
                          return <SearchCard uid={result} key={result} type={ f ? 'following' : (r ? 'sent' : 'request')} sendRequest={sendRequest}/>
                        }
                      )}
                    </div>
                    {/* End of Section */}
                    {Object.keys(weatherData).length !== 0 ?
                            <CurrentWeather weatherData={weatherData.current}/>          
                    :
                            <div className='not-found' style={{padding: '20px'}}>Weather Data Loading...</div>    
                    }
                    </div>
            </div>
            <div>
              <h2>Places Near Ann Arbor, Michigan:</h2>
                <div className='flex-center grid'>
                {places.map((entry, i) => {
                  return  <InfoCard id={i+1} key={i} info={entry} />
                })
                }
                </div>
            </div>
        </div>
        
    )
}

export default Explore
