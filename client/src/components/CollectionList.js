import React from 'react'
import {Link} from 'react-router-dom'
import {useAuth} from '../hooks/auth.hook'
import MDReactComponent from 'markdown-react-js';

export const CollectionsList = ( {collections, func, all} ) => {
  const {userId, userRole} = useAuth();

    return (
        <div>
         <ul className="collection" id={all}>
            { collections.map((col, index) => {
                return (
                  <>
                    <li className="collection-item avatar" key={index}>
                    {col.image && <Link to ={`/collection/${col._id}`}><img src={`${col.image}`} alt="" className="circle" /></Link>}
                    {!col.image && <Link to ={`/collection/${col._id}`}><i className="material-icons circle">folder</i></Link>}
                    <span className="title"><b>Name:</b> {col.name}</span>
                    <p><b>Topic:</b> {col.topic} <br/> </p>
                    <MDReactComponent text={'**Description**: ' + `${col.text.length > 50 ?
                    `${col.text.substring(0, 50)}...` : col.text}` } />
                    <div className="secondary-content">
                    {(userId === col.owner || userRole === 'admin') &&
                    <a href="#"><i className="material-icons"
                    onClick={() => {let delID=col._id; func(delID)}}
                    >delete</i></a>}
                    <Link to ={`/collection/${col._id}`}><i className="material-icons">send</i></Link>
                    </div>
                    </li>
                 </>
                )
            }) }
            </ul> 
      </div>
    )
}