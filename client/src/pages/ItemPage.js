import React, {useState, useEffect, useContext, useCallback, useLayoutEffect} from 'react'
import {useHttp} from '../hooks/http.hook'
import {useMessage} from '../hooks/message.hook'
import {AuthContext} from '../context/auth.context'
import {Loader} from '../components/Loader'
import {ItemTable} from '../components/ItemTable'
import {CommentsList} from '../components/CommentsList'
import { useParams } from 'react-router-dom'
import MDReactComponent from 'markdown-react-js';

let count_likes;
export const ItemPage = () => {
    const message =  useMessage();
    const [item, setItem] = useState( [] );
    const [fields, setFields] = useState( [] );
    const [comments, setComments] = useState( [] );
    const {token, isAuthenticated, userId, userRole} = useContext(AuthContext);
    const {loading, request, requestNotLoading} = useHttp();
    const [text, setText] = useState('');
    const itemId = useParams().id;
    const [owner, setOwner] = useState('');
    let checks = false;
    
    const fetchComments = useCallback( async () => {
        try {
            const fetched = await request(`/api/comments/${itemId}`, 'GET', null, {
                Authorization: `Bearer ${token}`
            });
            setComments(fetched);
        } catch(e) {
        }
    }, [token, request, itemId]);

    const updateComments = useCallback( async () => {
        try {
            const updated = await requestNotLoading(`/api/comments/${itemId}`, 'GET', null, {
                Authorization: `Bearer ${token}`
            });
            setComments(updated);
        } catch(e) {
        }
    }, [token, requestNotLoading, itemId]);

    const addComment = async () => {
        try {
            const user = await request('/api/user/findname', 'GET', null, {
                Authorization: `Bearer ${token}`
            }); 
            await request(`/api/comments/add/${itemId}`, 'POST', { name: user.name, text: text });
            fetchComments();
        } catch (e) {}
    }

    const Liked = async () => {
        let like = false;
        const check = document.getElementsByName("checkLike")
        for (let i = 0; i < item.likes.length; i++)
            {
                if (item.likes[i] === userId)
                {
                    like = true;
                    break;
                }
            }
        try {
            if (like)
            {
            const user = await requestNotLoading('/api/items/unlike', 'POST', {idItem: itemId, idUser: userId}, {
                Authorization: `Bearer ${token}` });
                check.item[0].checked = false; 
            }
                else {
            const user = await requestNotLoading('/api/items/like', 'POST', {idItem: itemId, idUser: userId}, {
                Authorization: `Bearer ${token}` });
                check.item[0].checked = false; 
                }
             fetchItem();
        } catch (e) {}
    }


    const fetchItem = useCallback( async () => {
        try {
            const fetched = await request(`/api/items/findone/${itemId}`, 'GET', null, {
                Authorization: `Bearer ${token}`
            });
            setItem(fetched);
            count_likes = fetched.likes.length;
            setFields(fetched.custom_fields);
            fetched.likes.map((l) => {
                if (l === userId) {
                    checks = true;
                }
            })
            const fetch = await request(`/api/col/findone/${fetched.ownCol}`, 'GET', null, {
                Authorization: `Bearer ${token}`
            });
            setOwner(fetch.owner);
        } catch(e) {
        }
    }, [token, request, itemId]);

    useEffect( () => {
        fetchItem();
    }, [fetchItem]);

    useEffect( () => {
        fetchComments();
    }, [fetchComments]);


    useEffect( () => {
        setInterval(updateComments, 5000);
    }, [updateComments]);

    useEffect( () => {
        window.M.updateTextFields();
    }, []);

    if(loading) {
        return <Loader />
    } 

    return (
        <>
        <div>
                <div style={{marginTop: "10px"}}>
                <span style={{fontSize:"24pt"}}>{item.name}</span>
                {isAuthenticated && (userId === owner || userRole === 'admin') && <>
                <a href={`/change_item/${item._id}`}><i className="material-icons">edit</i></a>
                <a href={`/change_item/${item._id}`}><i className="material-icons">delete</i></a>
                </> }
                </div>

                <p><b>Tags:</b> {item.tags} </p>
                
        { fields.map((f, ind) => {
            return (
            <p><b>{f.name}:</b> {f.type === 'text' && <MDReactComponent text={f.value} />}
            {f.type !== 'text' && <span>{f.value}</span>}</p>
            )
        }) }
        </div>
        {isAuthenticated && !loading && <><div className="left">
            <input id="toggle-heart" type="checkbox" name="checkLike" />
            <label htmlFor="toggle-heart" aria-label="like"
                onClick = {Liked}
                >❤</label>
                <span>{count_likes}</span>
        </div>
        <br/>
        <div className="row">
            <div className="input-field col s6">
                <textarea id="textarea1" className="materialize-textarea"
                onChange={ e => { setText(e.target.value) } }
                ></textarea>
                <label htmlFor="textarea1">Input your comment</label>
                </div>
                <div style={{marginTop: "10px"}}>
                    <a className="waves-effect waves-light btn"
                href='#'
                onClick={addComment}
                >Comment</a>
            </div>
        </div></>}
        
        {!loading && <CommentsList comments={comments}/>}
        </>
    )

}