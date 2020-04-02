import React, { useState, useEffect } from 'react'
import {useHistory} from 'react-router-dom'
import {useHttp} from '../hooks/http.hook'
import {useMessage} from '../hooks/message.hook'

export const RegisterPage = () => {
    const history = useHistory();
    const message =  useMessage();
    const {loading, request, error, clearError} = useHttp();
    const [form, setForm] = useState({
        email: '', password: '', name: ''
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

    const registerHandler = async () => {
        try {
            const data = await request('/api/auth/register', 'POST', {...form});
            message(data.message);
            history.push('/login');
        } catch (e) {}
    };

    return(
        <div className="row">
            <div className="col s6 offset-s3">
                <h1 className="center">Registration</h1>
                    <div className="card purple darken-3">
                        <div className="card-content white-text">
                            <div>
                            <div className="input-field">
                            <i className="material-icons prefix">email</i>
                            <input id="icon_prefix" type="text" className="validate" name="email" value={form.email} onChange={changeHandler} />
                            <label htmlFor="icon_prefix">E-mail</label>
                            </div>
                            <div className="input-field">
                            <i className="material-icons prefix">account_circle</i>
                            <input id="icon_name" type="text" className="validate" name="name" value={form.name} onChange={changeHandler} />
                            <label htmlFor="icon_name">Name</label>
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
                            onClick={registerHandler}
                            disabled={loading}
                            >
                            Sign up
                            </button>
                        </div>
                </div>
            </div>
        </div>
    )
}