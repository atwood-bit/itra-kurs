import React from 'react'
import {Link} from 'react-router-dom'
import MDReactComponent from 'markdown-react-js';

export const CommentsList = ( {comments} ) => {
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
            <h4>Comments</h4>
            { comments.map((comment) => {
                return (
                  <div className="comments" key={comment._id}>
                      <h6><strong>{ comment.name }</strong></h6>
                      <MDReactComponent text={ comment.text } />
                </div>
                )
            }) }
      </div>
    )
}