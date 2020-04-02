import React, {useState, useEffect, useContext, useCallback} from 'react'
import {useHttp} from '../hooks/http.hook'
import {useMessage} from '../hooks/message.hook'
import {AuthContext} from '../context/auth.context'
import {Loader} from '../components/Loader'
import {ItemTable} from '../components/ItemTable'
import {CommentsList} from '../components/CommentsList'
import { useParams } from 'react-router-dom'

export const ItemPage = () => {
    const message =  useMessage();
    const [item, setItem] = useState( [] );
    const [fields, setFields] = useState( [] );
    const [comments, setComments] = useState( [] );
    const {token, isAuthenticated, userId, userRole} = useContext(AuthContext);
    const {loading, request, requestComment} = useHttp();
    const [text, setText] = useState('');
    const itemId = useParams().id;
    const [owner, setOwner] = useState('');
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
            const updated = await requestComment(`/api/comments/${itemId}`, 'GET', null, {
                Authorization: `Bearer ${token}`
            });
            setComments(updated);
        } catch(e) {
        }
    }, [token, requestComment, itemId]);

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
        // let k;
        // try {
        //     item[0].likes.map(async (l) => {
        //         if (l.userId == userId) {
        //             const user = await request('/api/items/unlike', 'POST', {idItem: itemId, idUser: userId}, {
        //                 Authorization: `Bearer ${token}`
        //             });
        //             k++;
        //             console.log("qq" + k);
        //         }
        //     })
        //     if (!k) {
        //     const user = await request('/api/items/like', 'POST', {idItem: itemId, idUser: userId}, {
        //         Authorization: `Bearer ${token}`
        //     }); 
        //     message(user.message);
        // }
        //     fetchItem();
        //     console.log(item[0].likes);
        //     console.log(k)
        // } catch (e) {}
    }


    const fetchItem = useCallback( async () => {
        try {
            const fetched = await request(`/api/items/findone/${itemId}`, 'GET', null, {
                Authorization: `Bearer ${token}`
            });
            setItem(fetched);
            setFields(fetched.custom_fields);
            const fetch = await request(`/api/col/findone/${fetched[0].ownCol}`, 'GET', null, {
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

    if (isAuthenticated)
    return(
        <>
         { (userId === owner || userRole === 'admin') && <>
            <div className="row" style={{border: "5px dotted", marginTop: "20px"}}>
            <div className="col s6">
          <label>Name</label>
            <input id="item_name" type="text" className="validate" name="name" defaultValue={item.name} //onChange={changeHandlerItem} 
            />
        </div>
        <div className="col s6">
          <label>Tags</label>
            <input id="item_tags" type="text" className="validate" name="tags" defaultValue={item.tags} //onChange={changeHandlerItem} 
            />
        </div>
        <div className="col s6">
            <label>Date of add</label>
            <input disabled value={ item.dateAdd } id="disabled" type="text" class="validate" />
        </div>
        { fields.map((f, ind) => {
            return (
            <div className="col s6">
                <label>{f.name}</label>
                <input type="text" className="validate" name={f.name} defaultValue={f.value} //onChange={changeHandlerItem} 
                />
            </div>
            )
        }) }
            </div>
         </> }

         <div>
         <input id="toggle-heart" type="checkbox"
                onClick = {Liked}
                />
                <label htmlFor="toggle-heart" aria-label="like"
                >❤</label>
         </div>
            <div className="row">
                <div className="input-field col s6">
                <textarea id="textarea1" className="materialize-textarea"
                onChange={ e => { setText(e.target.value) } }
                ></textarea>
                <label htmlFor="textarea1">Input your comment</label>
                </div>
                <div>
                    <a className="waves-effect waves-light btn"
                href='#'
                onClick={addComment}
                >Comment</a>
            </div>
            </div>

            {!loading && <CommentsList comments={comments}/>}
            
        
       </> 
    )

    return (
        <>
        <div>
                <h3>{item.name}</h3>
                <p><b>Tags:</b> {item.tags} </p>
        </div>
        { fields.map((f, ind) => {
            return (
            <p><b>{f.name}: {f.value}</b></p>
            )
        }) }
        {!loading && <CommentsList comments={comments}/>}
        </>
    )

}