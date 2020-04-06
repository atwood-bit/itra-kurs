import React, {useState, useEffect, useContext, useCallback} from 'react'
import { useParams, useHistory } from 'react-router-dom'
import MDReactComponent from 'markdown-react-js';
import {storage} from '../config/configFirebase'
import {useHttp} from '../hooks/http.hook'
import {useMessage} from '../hooks/message.hook'
import {AuthContext} from '../context/auth.context'
import {Loader} from '../components/Loader'
import {ItemTable} from '../components/ItemTable'

let col_Fields = [];
let id_fields = [];
let item_fields = [];
let div_id ="";
export const CollectionPage = () => {
    const history = useHistory();
    const message =  useMessage();
    const [items, setItems] = useState( [] );
    const [fields, setFields] = useState( [] );
    const [collection, setCollection] = useState( [] );
    const {token, isAuthenticated, userId, userRole} = useContext(AuthContext);
    const {loading, request, requestNotLoading} = useHttp();
    const [formItem, setFormItem] = useState({
        name: '', tags: ''
    });
    const colId = useParams().id;
    
    
    let d = new Date();
    let curr_date = d.getDate();
    let curr_month = d.getMonth() + 1;
    let curr_year = d.getFullYear();
        if (curr_month < 10)
    curr_month = '0'+curr_month;
        if (curr_date < 10)
    curr_date = '0'+curr_date;
    let date = curr_year + "-" + curr_month + "-" + curr_date;

    const fetchItems = useCallback( async () => {
        try {
            const fetched = await request(`/api/items/${colId}`, 'GET', null);
            setItems(fetched);
            item_fields = JSON.parse(JSON.stringify(fetched.custom_fields));
        } catch(e) {
        }
    }, [token, request]);

    useEffect( () => {
        fetchItems();
    }, [fetchItems]);

    const fetchFields = useCallback( async () => {
        try {
            const fetched = await request(`/api/col/findone/${colId}`, 'GET', null, {
                Authorization: `Bearer ${token}`
            });
            setFields(fetched.custom_fields);
            col_Fields = JSON.parse(JSON.stringify(fetched.custom_fields));
            setCollection(fetched);
        } catch(e) {
        }
    }, [token, request]);

    useEffect( () => {
        fetchFields();
    }, [fetchFields]);

    useEffect( () => {
        window.M.updateTextFields();
    }, []);

    const changeHandlerItem = event => {
        setFormItem({ ...formItem, [event.target.name]: event.target.value })
    };

    const changeHandlerCol = event => {
        collection[event.target.name] = event.target.value;
    };

    const addItem = async () => {
        try {
            await request(`/api/items/add/${colId}`, 'POST', {...formItem, fields});
            fetchItems();
        } catch (e) {}
    };
    
    const addField = () => {
        col_Fields.push({name: '', type: ''});
    };

    const deleteItem = async (itemId) => {
        try {
            await request(`/api/items/delete`, 'POST', {itemId, idCol: colId});
            fetchItems();
        } catch (e) {}
    }

    const deleteCollection = async () => {
        try {
            await request(`/api/col/delete`, 'POST', {delID: colId});
            history.push('/');
        } catch (e) {}
    }

    const updateCollection = async () => {
        try {
            await request('/api/col/update/', 'POST', {collection, col_Fields, id_fields}, {
                Authorization: `Bearer ${token}`
            });
            fetchItems();
            fetchFields();
        } catch (e) {}
    };

    const sortItem = useCallback( async (value) => {
        try {
            const fetched = await requestNotLoading(`/api/items/sort/${colId}/${value}`, 'GET', null);
            setItems(fetched);
        } catch(e) {
        }
    }, [token, requestNotLoading]);

    const handleImageUpload = (e) => {
        if (e.target.files[0]) {
            const image = (e.target.files[0]);
            const uploadTask = storage.ref(`images/${image.name}`).put(image);
            uploadTask.on('state_changed', 
            (snapshot) => {
                console.log(snapshot);
            },
            (error) => {
                console.log(error);
            },
            () => {
                storage.ref('images').child(image.name).getDownloadURL().then(url => {
                    collection.image = url;
                })
            }
            )
        }
    }

    let elem = document.querySelector('.collapsible.expandable');
    window.M.Collapsible.init(elem, {
        accordion: false});

    if(loading) {
        return <Loader />
    } 

    if (userId === collection.owner || userRole === 'admin')
    return(
        <>
                    <h3>{collection.name}</h3>
                   {/* <p> {collection.image && <img src={`${collection.image}`} alt="" className="square left" style={{maxWidth: "20%", height: "auto", marginRight: "10px"}} />}</p> */}
                    <p><b>Topic:</b> {collection.topic} <br/> </p>
                        <MDReactComponent text={`${collection.text}`} />
        <ul className="collapsible expandable row">
    <li className="col s6">
      <div className="collapsible-header"><i className="material-icons">add</i>New item</div>
      <div className="collapsible-body row">
        <div className="col s6">
          <div className="input-field">
            <input id="item_name" type="text" className="validate" name="name" onChange={changeHandlerItem} />
            <label htmlFor="item_name">Name</label>
          </div>
        </div>
        <div className="col s6">
            <div className="input-field">
            <input id="item_tags" type="text" className="validate" name="tags" onChange={changeHandlerItem} />
            <label htmlFor="item_tags">Tags</label>
            </div>
        </div>
            { !loading && <> { fields.map((f, ind) => {
                switch (f.type) {
                    case 'string':
                    case 'number':
                        return (
                            <div key={f._id} className="col s6s">
                                <div className="input-field">
                                    <label>{f.name}</label>
                                    <input type="text" className="validate" onChange={ (e) => {
                                        fields[ind].value = e.target.value;
                                    } } />
                                </div>
                            </div>
                            );
                    case 'text':
                        return (
                            <div key={f._id} className="col s6">
                            <div className="input-field">
                              <textarea id="textarea1" className="materialize-textarea"
                              onChange={ (e) => {
                                fields[ind].value = e.target.value;
                              } }
                              ></textarea>
                              <label htmlFor="textarea1">{f.name}</label>
                              </div>
                            </div>
                        );
                    case 'checkbox':
                        return (
                            <div key={f._id} className="col s6" style={{paddingBottom: 20}}>
                                <div className="input-field">
                                    <label> 
                                    <input type="checkbox" className="filled-in" 
                                    onChange={() => {
                                        const maine = document.getElementsByClassName('filled-in');
                                        if (maine.item(0).checked === true)
                                        fields[ind].value = true;
                                        else 
                                        fields[ind].value = false;
                                    }}
                                    />
                                    <span>{f.name}</span>
                                    </label>
                                </div>
                            </div>
                        );
                    case 'date':
                        return (
                            <div key={f._id} className="col s6">
                                <div className="input-field">
                                 <input type="date" name="trip-start" placeholder=""
                                defaultValue= {date}
                                onLoad={() => {
                                    fields[ind].value = date;} }
                                onChange={ (e) => {
                                fields[ind].value = e.target.value;
                              } }>
                                    </input>
                                    <label>{f.name}</label>  
                                </div>
                            </div>
                            
                        );
                }
            }) }
            </>
        }
        <div className="card-action">
            <div className="col s12">
        <button className="btn yellow darken-4"
            disabled={loading}
            onClick={addItem}> Add item </button>
        </div>
        </div>
      </div>
    </li>
    <li className="col s6">
      <div className="collapsible-header">
            <i className="material-icons">edit</i>Change collection</div>
      <div className="collapsible-body row">
          <div className="col s6">
                <label>Topic</label>
                <select className="browser-default"
                        name="topic"
                        defaultValue = {collection.topic}
                        onChange={changeHandlerCol}>
                    <option value="Books">Books</option>
                    <option value="Brands">Brands</option>
                    <option value="Alcohol">Alcohol</option>
                    <option value="Pets">Pets</option>
                    <option value="Guns">Guns</option>
                </select>
            </div>
            
            <div className="col s6">
                <label htmlFor="col_name">Name collection</label>
                <input id="col_name"
                    type="text"
                    className="validate"
                    name = "name"
                    defaultValue={collection.name}
                    onChange={changeHandlerCol}
                />
            </div>

            <div className="col s12">
                <label htmlFor="col_text">Description</label>
                <input
                    type="text"
                    className="validate"
                    name = "text"
                    defaultValue={collection.text}
                    onChange={changeHandlerCol}
                />
            </div>

            <div className="file-field input-field col s12">
                    <div className="btn">
                        <span>File</span>
                        <input type="file" multiple
                        onChange={handleImageUpload} 
                        />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" defaultValue={collection.image} />
                    </div>
            </div>

            { !loading && <> { 
                col_Fields.map((col, id) => {
                return (
                    <div key={col._id}>
                        <div className="col s5">
                            <label>Type of field</label>
                            <select className="browser-default"
                                    name="type"
                                    defaultValue={col.type}
                                    onChange= { e => {
                                        col_Fields[id].type = e.target.value;
                                            } }
                                            >
                                <option value="" disabled selected>Choose type of field</option>
                                <option value="text">Text</option>
                                <option value="string">String</option>
                                <option value="date">Date</option>
                                <option value="checkbox">Checkbox</option>
                                <option value="number">Number</option>
                            </select>
                        </div>

                        <div className="col s6">
                            <label>Name of field</label>
                            <input
                                type="text"
                                className="validate"
                                name = "text"
                                defaultValue={col.name}
                                onChange={(e) => {
                                    col_Fields[id].name = e.target.value;
                                    
                                }}
                            /> 
                        </div>
                        <div className="col s1">
                            <a href="#1"
                                        className="right"
                                            onClick={ () => {
                                                item_fields.map((i) => {
                                                    if (col.name === i.name && col.type === i.type)
                                                    {
                                                        id_fields.push(i._id);
                                                    }
                                                })
                                                col_Fields.splice(id, 1);
                                            } }
                                            ><i className="material-icons">clear</i></a>
                        </div>
                    </div>
                );
            })}
            </>}
            <div className="col s12">
            <a href="#" className="btn-floating btn-small waves-effect waves-light red"
                onClick={addField}><i className="material-icons" title="Add field">add</i></a>
                <div className="right">
                <a className="waves-effect waves-light btn"
                onClick={updateCollection}
                >Update</a>
                <a className="waves-effect waves-light btn"
                onClick={deleteCollection}
                >Delete</a>
                </div>
        </div>
        </div>
    </li>
  </ul>

        {!loading && <ItemTable items={items} fields={fields} sort={sortItem} deleted={deleteItem} owner={collection.owner} />}
       </> 
    )
    else 
    return (
        <div>
        {!loading && <ItemTable items={items} fields={fields} sort={sortItem}/>}
        </div>
    )
}