import React, {useState, useEffect, useCallback} from 'react'
import {useHttp} from '../hooks/http.hook'
import {Loader} from '../components/Loader'
import {CollectionsList} from '../components/CollectionList'
import {ItemsList} from '../components/ItemList'

export const MainPage = () => {
    const [collections, setCollections] = useState( [] );
    const [items, setItems] = useState( [] );
    const {loading, request} = useHttp();

    const fetchCollections = useCallback( async () => {
        try {
            const fetched = await request('/api/col/findall', 'GET', null);
            setCollections(fetched);
        } catch(e) {

        }
    }, [request]);

    const fetchItems = useCallback( async () => {
        try {
            const fetched = await request('/api/items', 'GET', null);
            setItems(fetched);
        } catch(e) {

        }
    }, [request]);

    useEffect( () => {
        fetchCollections();
    }, [fetchCollections]);

    useEffect( () => {
        fetchItems();
    }, [fetchItems]);

    useEffect( () => {
        window.M.updateTextFields();
    }, []);

    if(loading) {
        return <Loader />
    } 

    return(
        <>
        <div className="row">
            <div className="col s5 offset-s1">
                <h4>Collections</h4>
        {!loading && <CollectionsList collections={collections} />}
        </div>
        <div className="col s5 offset-s1">
            <h4>Last added items</h4>
        <ItemsList items={items} />
        </div>
        </div>
       </> 
    )
}