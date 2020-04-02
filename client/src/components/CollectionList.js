import React from 'react'
import {Link} from 'react-router-dom'
//import {mdReact} from 'markdown-react-js'
import {useAuth} from '../hooks/auth.hook'

export const CollectionsList = ( {collections, func} ) => {
  const {userId, userRole} = useAuth();


    return (
        <div>
         <ul className="collection">
            { collections.map((col, index) => {
                return (
                  <>
                    <li className="collection-item avatar" key={index}>
                    {col.image && <Link to ={`/collection/${col._id}`}><img src={`${col.image}`} alt="" className="circle" /></Link>}
                    {!col.image && <Link to ={`/collection/${col._id}`}><i className="material-icons circle">folder</i></Link>}
                    <span className="title"><b>Name:</b> {col.name}</span>
                    <p><b>Topic:</b> {col.topic} <br/>
                    <b>Description:</b> {col.text.length > 50 ?
                    `${col.text.substring(0, 50)}...` : col.text }
                    </p>
                    <div className="secondary-content">
                    {(userId === col.owner || userRole === 'admin') && <>
                    <i className="material-icons"
                    onClick={() => {let delID=col._id; func(delID)}}
                    >delete</i> </>}
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