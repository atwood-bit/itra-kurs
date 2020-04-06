import React, {useState, useEffect, useCallback} from 'react'
import {useParams} from 'react-router-dom'
import {useHttp} from '../hooks/http.hook'
import {Loader} from '../components/Loader'
import {ItemsList} from '../components/ItemList'


export const SearchResultPage = () => {
    const {loading, request} = useHttp();
    const [items, setItems] = useState([]);
    const string = useParams().id;

    const searchItems = useCallback( async () => {
        try {
        let params = '';
        const fetchId = await request(`/api/search/${string}`, 'GET', null);
        if (fetchId.length) {
        fetchId.map((i) => {
            params += i._id + '&';
        })
        const fetchItems = await request(`/api/items/search/${params}`, 'GET', null);
        setItems(fetchItems);
    }
      } catch(e) {}
      }, [request])


    useEffect( () => {
        searchItems();
    }, [searchItems]);

    if(loading) {
        return <Loader />
    } 

    return(
        <>
            <div>
                {(items.length && <h4>Result of search</h4>) || <h4>Items not found</h4>}
        {!loading && <ItemsList items={items} all="col" />}
        </div>
       </> 
    )
}