const {Router} = require('express');
const config = require('config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {check, validationResult} = require('express-validator');
const User = require('../models/User');
const router = Router()

// /api/auth/register
router.post(
    '/register',
    [
        check('email', 'Некорректный Email').isEmail(),
        check('password', 'Длина пароля не менее 6 символов').isLength({ min: 6 })
    ],
    async (req,res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Некорректные данные при регистрации'
            })
        }
        const {email, password, name} = req.body;
        const candidate = await User.findOne({ email });
        if (candidate) {
           return res.status(400).json({ message: "Такой пользователь уже существует "});
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({ email, password: hashedPassword, name });
        
        await user.save();
        res.status(201).json({ message: 'Пользователь создан' });
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так!' });
    }
});


// api/auth/login
router.post(
    '/login',
    [
        check('email', 'Введите корректный email').normalizeEmail().isEmail(),
        check('password', 'Введите пароль').exists()
    ],
    async (req,res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Некорректные данные при входе в систему'
            })
        }

        const {email, password} = req.body;
        const user = await User.findOne({ email });
        dateLog = Date.now();
        if (!user) {
            return res.status(400).json({ message: 'Пользователь не найден' })
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Неверный пароль, попробуйте снова.' })
        }
        if (user.blocked === 'blocked')
        {
            return res.status(400).json({ message: 'Вы заблокированы' })
        }

        await User.updateOne({ 'email':  email}, { $set: { 'dateLog': dateLog } });
        const token = jwt.sign(
            { userId: user.id, userRole: user.role},
            config.get('jwtSecret'),
            {  }
        );
        res.json({ token, userId: user.id, userRole: user.role })
    } catch (e) {
        res.status(500).json(e.message);
    }
});

router.post(
    '/soc_login',
    async (req,res) => {
    try {
        const {name, email, pass} = req.body;
        const user = await User.findOne({ 'email': email });
        dateLog = Date.now();
        if (!user) {
            const hashedPassword = await bcrypt.hash(pass, 12);
            const userCreate = new User({ email, password: hashedPassword, name });
            const userC = await userCreate.save();
            const token = jwt.sign(
                { userId: userC.id, userRole: userC.role},
                config.get('jwtSecret'),
                {  }
            );
            res.status(201).json({ token, userId: user.id, userRole: user.role })
        }
        else {
            if (user.blocked === 'blocked')
        {
            return res.status(400).json({ message: 'Вы заблокированы' })
        }
            await User.updateOne({ 'email':  email}, { $set: { 'dateLog': dateLog } });
            const token = jwt.sign(
                { userId: user.id, userRole: user.role},
                config.get('jwtSecret'),
                {  }
            );
            res.status(201).json({ token, userId: user.id, userRole: user.role })
        }
        
    } catch (e) {
        res.status(500).json(e.message);
    }
});

module.exports = router;