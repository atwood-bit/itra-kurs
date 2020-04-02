import React, {useState, useContext} from 'react'
import {AuthContext} from '../context/auth.context'
import {useHttp} from '../hooks/http.hook'
import {linkId} from '../pages/DetailPage'

export const LinkCard = ({ link }) => {
    const {token} = useContext(AuthContext);
    const {request} = useHttp();
    const [txt, setTxt] = useState('');
    const [color, setColor] = useState('');
    const updHandler = async event => {
        if (color === '') {
            setColor(link.color);
        }
        if (txt !== '') {
        try {
            await request('/api/link/update', 'POST', {from: txt, linkId: linkId, colorCard: color}, {
                Authorization: `Bearer ${token}`
            });
        } catch (e) {}
        } else {
            try {
                await request('/api/link/updateColor', 'POST', {linkId: linkId, colorCard: color}, {
                    Authorization: `Bearer ${token}`
                });
            } catch (e) {}
        }
} 

const delHandler = async event => {
    try {
        await request('/api/link/delete', 'POST', {delId: linkId}, {
            Authorization: `Bearer ${token}`
        });
       
    } catch (e) {}
}

    const setColorPF = () => {
        document.getElementsByName("colors").item(2).className="active"
        document.getElementsByName("colors").item(1).className="waves-effect"
        document.getElementsByName("colors").item(0).className="waves-effect"
        setColor("peachpuff");
    }

    const setColorYL = () => {
        document.getElementsByName("colors").item(0).className="active"
        document.getElementsByName("colors").item(1).className="waves-effect"
        document.getElementsByName("colors").item(2).className="waves-effect"
        setColor("yellow");
    }

    const setColorPK = () => {
        document.getElementsByName("colors").item(1).className="active"
        document.getElementsByName("colors").item(2).className="waves-effect"
        document.getElementsByName("colors").item(0).className="waves-effect"
        setColor("pink");
    }

    return (
        <>
        <div>
            <br />
            <p className="noteCard">Ваш текст: <strong>{link.text}</strong></p>
            <div className="input-field">
                            <input
                                placeholder="Вставьте новый текст"
                                id="link"
                                type="text"
                                value={txt}
                                onChange={e => setTxt(e.target.value)}
                            />
                            </div>
            <p>Дата создания: <strong>{new Date(link.dateCreate).toLocaleDateString()}</strong></p>
            {link.dateChanged != null && <p>Дата редактирования: <strong>{new Date(link.dateChanged).toLocaleDateString()}</strong></p>}
            </div>
            <div className="CardColor">
                <p><strong>Color</strong></p>
            <ul className="pagination">
            <li className="waves-effect" name="colors" title="Yellow"
            onClick={ setColorYL }
            ><a href="#!">1</a></li>
            <li className="waves-effect" name="colors" title="Pink"
            onClick={ setColorPK }
            ><a href="#!">2</a></li>
            <li className="waves-effect" name="colors" title="Peachpuff"
            onClick={ setColorPF}
            ><a href="#1">3</a></li>
  </ul>
            </div>
            <div>
            <a className="waves-effect waves-light btn" href="/links"
            onClick={updHandler}
            >Save</a>
            <a className="waves-effect waves-light btn" href="/links"
            onClick={delHandler}
            >Delete</a>
            </div>
        </>
    )
}