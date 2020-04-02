import React, {useState, useEffect, useContext, useCallback} from 'react'
import {useHttp} from '../hooks/http.hook'
import {useMessage} from '../hooks/message.hook'
import {AuthContext} from '../context/auth.context'
import {Loader} from '../components/Loader'
import {ItemTable} from '../components/ItemTable'
import { useParams } from 'react-router-dom'

export const CollectionPage = () => {
    
    const message =  useMessage();
    const [items, setItems] = useState( [] );
    const [fields, setFields] = useState( [] );
    const [fieldsCol, setFieldsCol] = useState( [] );
    const [collection, setCollection] = useState( [] );
    const {token, isAuthenticated} = useContext(AuthContext);
    const {loading, request} = useHttp();
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
            const fetched = await request(`/api/items/${colId}`, 'GET', null, {
                Authorization: `Bearer ${token}`
            });
            setItems(fetched);
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
            setFieldsCol(fetched.custom_fields);
            delete fetched.custom_fields;
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
            const data = await request(`/api/items/add/${colId}`, 'POST', {...formItem, fields});
            fetchItems();
        } catch (e) {}
    };
    
    const addField = () => {
        fieldsCol.push({name: '', type: ''});
    };

    const updateCollection = async () => {
        try {
            const data = await request('/api/col/update/', 'POST', {collection, fieldsCol}, {
                Authorization: `Bearer ${token}`
            });
            fetchItems();
            fetchFields();
            message(data.message);
        } catch (e) {}
    };

    let elem = document.querySelector('.collapsible.expandable');
    let instance = window.M.Collapsible.init(elem, {
        accordion: false});


    if(loading) {
        return <Loader />
    } 

    if (isAuthenticated)
    return(
        <form>
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
                            <div key={f._id} className="col s6">
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
                            <div key={f._id} className="col s6">
                                <div className="input-field">
                                    <label> 
                                    <input type="checkbox" className="filled-in" />
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
                                defaultValue={date}
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
            style={{marginRight: 10}}
            disabled={loading}
            onClick={addItem}> Add item </button>
        </div>
        </div>
      </div>
    </li>
    <li className="col s6">
      <div className="collapsible-header"><i className="material-icons">edit</i>Change collection</div>
      <div className="collapsible-body row">
          <div className="col s6">
                <label htmlFor="col_topic">Topic</label>
                <select className="browser-default" name="topic" defaultValue = {collection.topic}
                onChange={changeHandlerCol}
                >
                    <option value="" disabled selected>Choose your topic</option>
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

            { !loading && <> { fieldsCol.map((f, ind) => {
                return (
                    <div key={f._id}>
                        <div className="col s5">
                            <label>Type of field</label>
                            <select className="browser-default"
                                    name="type"
                                    defaultValue={f.type}
                                    onChange= { e => {
                                        fieldsCol[ind].type = e.target.value;
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
                                defaultValue={f.name}
                                onChange={(e) => {
                                    fieldsCol[ind].name = e.target.value;
                                }}
                            /> 
                        </div>
                        <div className="col s1">
                            <a href="#1"
                                        className="right"
                                            onClick={ () => {
                                                fieldsCol.splice(ind, 1);
                                            } }
                                            ><i className="material-icons"
                                            >clear</i></a>
                        </div>
                    </div>
                );
            })}
            </>}
            <div className="col s12">
            <a href="#" className="btn-floating btn-small waves-effect waves-light red"
                onClick={addField}><i className="material-icons" title="Add field">add</i></a>
                <a className="waves-effect waves-light btn"
                onClick={updateCollection}
                >Update</a>
                <a className="waves-effect waves-light btn">Delete</a>
        </div>
        </div>
    </li>
  </ul>

        {!loading && <ItemTable items={items} fields={fields} />}
       </form> 
    )
    else 
    return (
        <div>
        {!loading && <ItemTable items={items} fields={fields}/>}
        </div>
    )
}