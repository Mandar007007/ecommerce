import React from 'react'
import ReactStars from 'react-stars'
import profilePng from "../../images/pngegg.png"

const ReviewCard = ({review}) => {
    const options = {
        edit:false,
        color:"rgba(20,20,20,0.1)",
        activateColor:"tomato",
        size: window.innerWidth < 600 ? 20 : 25,
        value:review.rating,
        isHalf:true,

    }
  return (
    <div className='reviewCard'>
        <img src={profilePng} alt="user" />
        <p>{review.name}</p>
        <ReactStars {...options} />
        <span className="reviewCardComment">{review.comment}</span>
    </div>
  )
}

export default ReviewCard
