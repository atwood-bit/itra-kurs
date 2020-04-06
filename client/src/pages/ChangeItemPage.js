import React, {useState, useEffect, useContext, useCallback} from 'react'
import {useHttp} from '../hooks/http.hook'
import {AuthContext} from '../context/auth.context'
import {Loader} from '../components/Loader'
import { useParams, useHistory } from 'react-router-dom'


export const ChangeItemPage = () => {
    const history = useHistory();
    const [item, setItem] = useState( [] );
    const [fields, setFields] = useState( [] );
    const {token, isAuthenticated} = useContext(AuthContext);
    const {loading, request} = useHttp();
    const itemId = useParams().id;

    const fetchItem = useCallback( async () => {
        try {
            const fetched = await request(`/api/items/findone/${itemId}`, 'GET', null, {
                Authorization: `Bearer ${token}`
            });
            setItem(fetched);
            setFields(fetched.custom_fields);
        } catch(e) {
        }
    }, [token, request, itemId]);

    const changeHandlerItem = event => {
        item[event.target.name] = event.target.value;
    }

    const Saved = async () => {
        try {
            await request('/api/items/update', 'POST', {item, fields});
            fetchItem();
            history.push(`/item/${itemId}`);
        } catch(e) {
        }
    }

    const Deleted = async () => {
        try {
            await request('/api/items/delete', 'POST', {itemId, idCol: item.ownCol});
            history.push(`/`);
        } catch(e) {
        }
    }

    useEffect( () => {
        fetchItem();
    }, [fetchItem]);
    
    useEffect( () => {
        window.M.updateTextFields();
    }, []);

    if(loading) {
        return <Loader />
    } 

    if (isAuthenticated)
    return(
        <>
        <div className="row" style={{border: "2px solid", borderColor: "green", marginTop: "20px"}}>
            <div className="col s6">
          <label>Name</label>
            <input id="item_name" type="text" className="validate" name="name" defaultValue={item.name} onChange={changeHandlerItem} 
            />
        </div>
        <div className="col s6">
          <label>Tags</label>
            <input id="item_tags" type="text" className="validate" name="tags" defaultValue={item.tags} onChange={changeHandlerItem} 
            />
        </div>
        <div className="col s6">
            <label>Date of add</label>
            <input disabled value={ new Date(item.dateAdd).toLocaleString() } id="disabled" type="text" className="validate" />
        </div>
        { fields.map((f, ind) => {
            return (
            <div className="col s6" key={ind}>
                <label>{f.name}</label>
                <input type="text" className="validate" name={f.name} defaultValue={f.value} onChange={e => {
                    fields[ind].value = e.target.value;
                }} 
                />
            </div>
            )
        }) }
            </div>
        <div>
            <a className="waves-effect waves-light btn"
                href='#'
                onClick={Saved}
                >Save</a>
            <a className="waves-effect waves-light btn"
                href='#'
                onClick={Deleted}
                >Delete</a>
        </div>
       </> 
    )

}