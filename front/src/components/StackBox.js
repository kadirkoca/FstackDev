import React from "react"
import {Link} from "react-router-dom"
import {
    Card,
    ListGroup,
    ListGroupItem,
} from "react-bootstrap"
import { FiExternalLink, FiGithub } from 'react-icons/fi'
import { BsStarFill, BsStarHalf, BsStar } from 'react-icons/bs'


//BsStarFill, BsStarHalf, BsStar
const Rating = (data) =>{
    const ratings = data.ratings
    const total = ratings.ups + ratings.downs
    const positivePercent = ( ratings.ups * 100 ) / total
    const fulls = parseInt(positivePercent/20)
    const halfth = fulls + parseInt(( positivePercent%20)/10)
    const stars = []
    
    for(let i = 0; i < 5; i++) {
        if(i<fulls){
            stars.push(<BsStarFill size={12} key={i} className="rating-stars" />)
        }else if(i < halfth){
            stars.push(<BsStarHalf size={12} key={i} className="rating-stars" />)
        }else{
            stars.push(<BsStar size={12} key={i} className="rating-stars"/>)
        }
    }

    return (
        <div>
            {stars}
            <span className="float-end">over {total} votes</span>
        </div>
    )
}

const StackBox = ({data}) => {
    return (
        <Card>
            <Card.Img variant="top" src={data.image} />
            <Card.Body>
                <Card.Title>{data.title}</Card.Title>
                <Card.Text>
                    {data.summary}
                </Card.Text>
            </Card.Body>
            <ListGroup className="list-group-flush">
                <ListGroupItem>{data.developer}</ListGroupItem>
                <ListGroupItem>{data.trendchannel}</ListGroupItem>
                <ListGroupItem>{data.releasechannel}</ListGroupItem>
            </ListGroup>
            <Card.Body>
                <Card.Link href={data.giturl} target="_blank"><FiGithub size={12} className="SweetIcons"/>Go to Repository</Card.Link>
                <Card.Link href={data.weburl} target="_blank"><FiExternalLink size={12} className="SweetIcons"/>Visit Website</Card.Link>
            </Card.Body>
            <Card.Footer>
                <Rating ratings={data.ratings} />
            </Card.Footer>
        </Card>
    )
}

export default StackBox