import React, {useState, useEffect, useContext, useCallback} from 'react'
import { useParams } from 'react-router-dom'
import {useHttp} from '../hooks/http.hook'
import {useMessage} from '../hooks/message.hook'
import {AuthContext} from '../context/auth.context'
import {Loader} from '../components/Loader'
import {storage} from '../config/configFirebase'
import {CollectionsList} from '../components/CollectionList'


let fields = [ {} ];
fields.length = 0;
export const ProfilePage = () => {
    const message =  useMessage();
    const [collections, setCollections] = useState( [] );
    const {token} = useContext(AuthContext);
    const {loading, request} = useHttp();
    const [form, setForm] = useState({
        topic: '', text: '', name: ''
    });
    const idOWner = useParams().id;
    const [state, setState] = useState({
        url: ''
    });

    const fetchCollections = useCallback( async () => {
        try {
            const fetched = await request(`/api/col/collection/${idOWner}`, 'GET', null, {
                Authorization: `Bearer ${token}`
            });
            setCollections(fetched);
        } catch(e) {
        }
    }, [token, request]);

    useEffect( () => {
        fetchCollections();
    }, [fetchCollections]);


    useEffect( () => {
        window.M.updateTextFields();
    }, []); 

    const changeHandlerCol = event => {
        setForm({ ...form, [event.target.name]: event.target.value })
    };


    const addCollection = async () => {
        try {
            const data = await request(`/api/col/create/${idOWner}`, 'POST', {...form, fields, img: state.url}, {
                Authorization: `Bearer ${token}`
            });
            fetchCollections();
            message("Collection created");
        } catch (e) {}
    };

    const deleteCollection = async (delID) => {
        try {
            await request(`/api/col/delete`, 'POST', {delID: delID}, {
                Authorization: `Bearer ${token}`
            });
            fetchCollections();
            message("Deleted");
        } catch (e) {}
    };

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
                    setState({url});
                })
            }
            )
        }
    }

    if(loading) {
        return <Loader />
    } 
    
    return(
        <div className="row">
            <div className="col s7">
                <h1>My collections</h1>
            {!loading && <CollectionsList collections={collections} func={deleteCollection} />}
            </div>
                <div className="col s4 offset-m1">
                    <h3 style={{marginTop: '50px'}}>New collection</h3>
                <label htmlFor="col_topic">Topic</label>
                <select className="browser-default" name="topic" onChange={changeHandlerCol}>
                    <option value="" disabled selected>Choose your topic</option>
                    <option value="Books">Books</option>
                    <option value="Brands">Brands</option>
                    <option value="Alcohol">Alcohol</option>
                    <option value="Pets">Pets</option>
                    <option value="Guns">Guns</option>
                </select>
                <div className="input-field">
                <label htmlFor="col_name">Name collection</label>
                    <input id="col_name"
                    type="text"
                    className="validate"
                    name = "name"
                    onChange={changeHandlerCol}
                    />
                </div>
                <div className="input-field">
                    <label htmlFor="col_text">Description</label>
                    <input id="col_text"
                    type="text"
                    className="validate"
                    name = "text"
                    onChange={changeHandlerCol}
                    />
                </div>    
                <div className="file-field input-field">
                    <div className="btn">
                        <span>File</span>
                        <input type="file" multiple
                        onChange={handleImageUpload} />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" placeholder="Drag 'n' drop image or click here" />
                    </div>
                </div>
                    
                { !loading &&
                <div>
                    { fields.map((item, ind) => {
                        return (
                            <div key={item._id}>
                                <div>
                                <label>Type</label>
                                <select className="browser-default"
                                        name="type_field"
                                        onChange= { e => {
                                            fields[ind].type_field = e.target.value;
                                        } }
                                        >
                                            <option value="" disabled selected>Choose type of field</option>
                                            <option value="text">Text</option>
                                            <option value="string">String</option>
                                            <option value="date">Date</option>
                                            <option value="checkbox">Checkbox</option>
                                            <option value="number">Number</option>
                                        </select>
                                        <a href="#1"
                                        className="right"
                                            onClick={ () => {
                                                fields.splice(ind, 1);
                                            } }
                                            ><i className="material-icons"
                                            >clear</i></a>
                                        </div>
                                        <label>Name field</label>
                                        <input
                                            type="text"
                                            className="validate"
                                            name = "name_field"
                                            onChange= { e => {
                                                fields[ind].name_field = e.target.value;
                                            } }
                                            />
                                        </div>
                                        );
                    }) }
                </div> 
                }
                <a href="#" className="btn-floating btn-small waves-effect waves-light red"
                onClick={ () => {
                    fields.push({name_field: '', type_field: ''});
                } }
                ><i className="material-icons" title="Add field">add</i></a>  
                <div className="card-action right">
                            <button
                                className="btn yellow darken-4"
                                disabled={loading}
                                onClick={addCollection}
                                >
                                Create Collection
                            </button>
                        </div>
                    </div>
        </div>
    )
}