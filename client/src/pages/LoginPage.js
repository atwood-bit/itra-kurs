import React, { useContext, useState, useEffect } from 'react'
import {useHttp} from '../hooks/http.hook'
import {useMessage} from '../hooks/message.hook'
import { AuthContext } from '../context/auth.context'
import {useHistory} from 'react-router-dom'

export const LoginPage = () => {
    const history = useHistory();
    const auth = useContext(AuthContext);
    const message =  useMessage();
    const {loading, request, error, clearError} = useHttp();
    const [form, setForm] = useState({
        email: '', password: ''
    });

    useEffect( () => {
        message(error);
        clearError();
    }, [error, message, clearError]);

    useEffect( () => {
        window.M.updateTextFields();
    }, []);

    const changeHandler = event => {
        setForm({ ...form, [event.target.name]: event.target.value })
    };

    const loginHandler = async () => {
        try {
            const data = await request('/api/auth/login', 'POST', {...form});
            auth.login(data.token, data.userId, data.userRole);
            history.push('/');
            window.location.reload(true);
        } catch (e) {}
    };

    return(
        <div className="row">
            <div className="col s6 offset-s3">
                <h1 className="center">Авторизация</h1>
                    <div className="card purple darken-3">
                        <div className="card-content white-text">
                            <div>
                            <div className="input-field">
                            <i className="material-icons prefix">email</i>
                            <input id="icon_prefix" type="text" className="validate" name="email" value={form.email} onChange={changeHandler} />
                            <label htmlFor="icon_prefix">E-mail</label>
                            </div>
                            <div className="input-field">
                            <i className="material-icons prefix">border_color</i>
                            <input id="icon_pass" type="password" className="validate" name="password" value={form.password} onChange={changeHandler} />
                            <label htmlFor="icon_pass">Password</label>
                            </div>
                        </div>
                    </div>
                        <div className="card-action">
                            <button
                            className="btn yellow darken-4"
                            style={{marginRight: 10}}
                            disabled={loading}
                            onClick={loginHandler}
                            >
                            Login
                            </button>
                        </div>
                </div>
            </div>
        </div>
    )
}