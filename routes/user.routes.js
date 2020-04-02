const {Router} = require('express');
const config = require('config');
const User = require('../models/User');
const auth = require('../middleware/auth.middleware');
const router = Router();

router.get('/', auth, async (req,res) => {
    try {
        const users = await User.find({  }) 
        res.json(users);
    } catch(e) {
        res.status(500).json({ message: 'Что-то пошло не так' });
    }
})

router.get(
    '/findname', auth, async (req,res) => {
        try {
            const user = await User.findOne({ _id: req.user.userId }, {name: 1});
            res.json(user);
        } catch (e) {
            res.status(500).json({ message: 'Что-то пошло не так' });
        }
    }
)

router.post(
    '/delete',
    async (req,res) => {
    try {
        const { delId } = req.body;
        await User.deleteMany({ _id: delId });
        if (delId.length > 1) {
            res.status(201).json({ message: 'Пользователи удалены' });
            }
            else {
                res.status(201).json({ message: 'Пользователь удален' });
            }
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так!' });
    }
});

router.post(
    '/block',
    async (req,res) => {
    try {
        const { blockId } = req.body;
        await User.updateMany({ '_id': blockId }, { $set: { 'status': 'blocked' } });
        if (blockId.length > 1) {
            res.status(201).json({ message: 'Пользователи заблокированы' });
            }
            else {
                res.status(201).json({ message: 'Пользователь заблокирован' });
            }
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так!' });
    }
});

router.post(
    '/unblock',
    async (req,res) => {
    try {
        const { unblockId } = req.body;
        await User.updateMany({ '_id': unblockId }, { $set: { 'status': 'not blocked' } });
        if (unblockId.length > 1) {
        res.status(201).json({ message: 'Пользователи разблокированы' });
        }
        else {
            res.status(201).json({ message: 'Пользователь разблокирован' });
        }
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так!' });
    }
});

router.post(
    '/changerole',
    async (req,res) => {
    try {
        const { usersId } = req.body;
        const users = await User.find({ _id: usersId });
        for (let i = 0; i < users.length; i++) {
            if (users[i].role === 'user') {
                await User.updateOne({ '_id': users[i]._id }, { $set: { 'role': 'admin' } });
            } else {
                await User.updateOne({ '_id': users[i]._id }, { $set: { 'role': 'user' } });
            }
        }
        res.status(200).json({ message: 'Изменения приняты' });
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так!' });
    }
});

module.exports = router;