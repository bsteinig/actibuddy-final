import React from 'react'
import '../styles/infocard.css'

function InfoCard({id, info}) {
    
    return (
        <div className='info-card' id={id}>
            <img src={info.image} className="info-img"/>
            <h1 className='info-title'>{info.title}</h1>
            <h4 className='info-emojis'>{info.emojis}</h4>
            <h3>Accessibility</h3>
            <h5>{info.accessibility}</h5>
            <h3>Difficulty</h3>
            <h5>{info.difficulty}</h5>
            
            <div className="info-row">
                <a href={info.info} target="_blank"><i className="fas fa-info-circle"></i></a>
                <a href={info.directions} target="_blank"><i className="fas fa-map-marked-alt"></i></a>
            </div>
        </div>
    )
}

export default InfoCard
