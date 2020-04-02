import React, {useState, useEffect, useContext, useCallback} from 'react'
import {useHttp} from '../hooks/http.hook'
import {useMessage} from '../hooks/message.hook'
import {AuthContext} from '../context/auth.context'
import {Loader} from '../components/Loader'
import {UsersList, arr} from '../components/UsersList'

export const UsersPage = () => {
    const message =  useMessage();
    const [users, setUsers] = useState( [] );
    const {token} = useContext(AuthContext);
    const {loading, request} = useHttp();

    const fetchUsers = useCallback( async () => {
        try {
            const fetched = await request(`/api/user/`, 'GET', null, {
                Authorization: `Bearer ${token}`
            });
            setUsers(fetched);
        } catch(e) {

        }
    }, [token, request]);

    useEffect( () => {
        fetchUsers();
    }, [fetchUsers]);


    const deleteUsers = async () => {
        if (arr.length) {
        try {
            const data = await request('/api/user/delete', 'POST', { delId: arr });
            const userId = JSON.parse(localStorage.getItem('userData')).userId;
            for (let i = 0; i < arr.length; i++) {
                if (userId === arr[i]) {
                    localStorage.removeItem('userData');
                    window.location.reload(true);
                }
                else {
                    message(data.message);
                }
                fetchUsers();
                UsersList(users);
            }
            arr.length = 0;
        } catch (e) {}
    } else message('Выберите пользователей');
    };

    const blockUsers = async () => {
        if (arr.length) {
        try {
            const data = await request('/api/user/block', 'POST', { blockId: arr });
            const userId = JSON.parse(localStorage.getItem('userData')).userId;
            for (let i = 0; i < arr.length; i++) {
                if (userId === arr[i]) {
                    localStorage.removeItem('userData');
                    window.location.reload(true);
                }
                else {
                  message(data.message);
                }
            }
            fetchUsers();
            UsersList(users);
            arr.length = 0;
        } catch (e) {}
    } else message('Выберите пользователей');
    };

    const unblockUsers = async () => {
        if (arr.length) {
        try {
                const data = await request('/api/user/unblock', 'POST', { unblockId: arr });
                arr.length = 0;
                message(data.message);
                fetchUsers();
                UsersList(users);
        } catch (e) {}
    } else message('Выберите пользователей');
    };

    const changeRole = async () => {
        if (arr.length) {
        try {
                const data = await request('/api/user/changerole', 'POST', { usersId: arr });
                arr.length = 0;
                message(data.message);
                fetchUsers();
                UsersList(users);
        } catch (e) {}
    } else message('Выберите пользователей');
    };

    useEffect( () => {
        window.M.updateTextFields();
    }, []);

    if(loading) {
        return <Loader />
    } 

    return(
        <>
        <div className="right users">
        <a className="waves-effect waves-light btn"
        href="#1"
        onClick={blockUsers}
        >Block</a>
        <a className="waves-effect waves-light btn"
        href="#2"
        onClick={unblockUsers}
        >Unblock</a>
        <a className="waves-effect waves-light btn"
        href="#3"
        onClick={changeRole}
        >Change role</a>
        <a className="waves-effect waves-light btn"
        href="#4"
        onClick={deleteUsers}
        >Delete</a>
        </div>
        {!loading && <UsersList users={users} />}
       </> 
    )
}