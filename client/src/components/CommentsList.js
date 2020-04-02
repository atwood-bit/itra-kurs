import React, {useContext} from 'react'
import {Link} from 'react-router-dom'
import {mdReact} from 'markdown-react-js'
import {AuthContext} from '../context/auth.context'
import {useAuth} from '../hooks/auth.hook'

export const CommentsList = ( {comments} ) => {
    const {isAuthenticated} = useContext(AuthContext);

    if (!comments.length)
    return (
        <div>
            <h4>
                No comments
            </h4>
        </div>
    )
    return (
        <div>
            <h3>Comments</h3>
            { comments.map((comment) => {
                return (
                  <div style={{border: "2px solid", borderColor: "#cacd58 #5faf8a #b9cea5 #aab238"}}>
                      <h6><strong>{ comment.name }</strong></h6>
                      <p>{ comment.text } </p>
                </div>
                )
            }) }
      </div>
    )
}