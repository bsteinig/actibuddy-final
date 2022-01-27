import React from 'react'
import { updatePost } from '../database/firebase'

function ExplorePost({name, id, position, setMapLatitude, setMapLongitude}) {
    function updateMap(){
        setMapLatitude(position[0])
        setMapLongitude(position[1])
    }

    return (
        <div id={id}>
            <h1>{name}</h1>
            <button onClick={() => updateMap()}>Go here</button>
        </div>
    )
}

export default ExplorePost
