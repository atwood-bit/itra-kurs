import React from 'react'
import {Link} from 'react-router-dom'

export const ItemsList = ( {items, all} ) => {
    return (
        <div>
          <ul className="collection" id={all}>
            { items.map((item, index) => {
              if (index<10)
                return (
                  <li className="collection-item avatar" key={index}>
                  <Link to ={`/item/${item._id}`}><i className="material-icons circle green">insert_chart</i></Link>
                  <span className="title"><b>Name: </b>{item.name}</span>
                  <p><b>Tags: </b>
                  {item.tags.length > 250 ?
                    `${item.tags.substring(0, 250)}...` : item.tags }
                  </p>
                  <Link to ={`/item/${item._id}`} className="secondary-content"><i className="material-icons">send</i></Link>
                  </li>
                )
            }) }
          </ul>
      </div>
    )
}