import React, {useState, useEffect, useCallback} from 'react'
import {useHttp} from '../hooks/http.hook'
import {Loader} from '../components/Loader'
import {CollectionsList} from '../components/CollectionList'

export const AllCollectionsPage = () => {
    const [collections, setCollections] = useState( [] );
    const {loading, request} = useHttp();

    const fetchCollections = useCallback( async () => {
        try {
            const fetched = await request('/api/col/', 'GET', null);
            setCollections(fetched);
        } catch(e) {

        }
    }, [request]);

    useEffect( () => {
        fetchCollections();
    }, [fetchCollections]);

    if(loading) {
        return <Loader />
    } 

    return(
        <>
            <div>
                <h4>All collections</h4>
        {!loading && <CollectionsList collections={collections} all="col" />}
        </div>
       </> 
    )
}