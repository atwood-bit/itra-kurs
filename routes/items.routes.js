const {Router} = require('express');
const Items = require('../models/Items');
const Collections = require('../models/Collections');
const auth = require('../middleware/auth.middleware');
const router = Router();

router.get('/', async (req,res) => {
    try {
        const items = await Items.find({  }).sort({ 'dateAdd': -1 });
        res.json(items);
    } catch(e) {
        res.status(500).json({ message: 'Что-то пошло не так' });
    }
})

router.get('/:id', async (req,res) => {
    try {
        const items = await Items.find({ ownCol: req.params.id })
        res.json(items);
    } catch(e) {
        res.status(500).json({ message: 'Что-то пошло не так' });
    }
})

router.post(
    '/add/:id',
    async (req,res) => {
        try {
        const idCollection = req.params.id;
        const { name, tags, fields } = req.body;
        const item = new Items({ name, tags, ownCol: idCollection });
        await item.save();
        await Collections.updateOne( { '_id': idCollection}, { $inc: {"countItems": 1} } );
        if (fields.length > 0)
        fields.map(async (f) => {
            await Items.updateOne({ '_id': item._id }, { $push: {'custom_fields': {'name': f.name, 'type': f.type, 'value': f.value}} });
        })
        res.status(201).json({ message: 'Айтем добавлен!' });
        } catch (e) {
            res.status(500).json({ message: 'Что-то пошло не так!' });
        }
    }
)

router.post(
    '/like',
    async (req,res) => {
        try {
        const { idItem, idUser } = req.body;
        await Items.updateOne({ '_id': idItem }, { $push: {'likes': { 'userId':idUser }} });
        res.status(201).json({ message: 'Liked' });
        } catch (e) {
            res.status(500).json({ message: 'Что-то пошло не так!' });
        }
    }
)

router.post(
    '/unlike',
    async (req,res) => {
        try {
        const { idItem, idUser } = req.body;
        await Items.updateOne({ '_id': idItem }, { $pull: {'likes': { 'userId':idUser }} });
        res.status(201);
        } catch (e) {
            res.status(500).json({ message: 'Что-то пошло не так!' });
        }
    }
)

router.get('/findone/:id', async (req,res) => {
    try {
        const items = await Items.findOne({ _id: req.params.id });
        res.json(items);
    } catch(e) {
        res.status(500).json({ message: 'Что-то пошло не так' });
    }
})

router.post(
    '/delete',
    async (req,res) => {
    try {
        const { delId } = req.body;
        if (delId.length === 1) {
            await Items.deleteOne({ _id: delId });
            res.status(201).json({ message: 'Айтем удален' });
            }
            else {
                await Items.deleteMany({ _id: delId });
                res.status(201).json({ message: 'Айтемы удалены' });
            }
            const count = delId.length();
            await Collections.updateOne( {_id: colId}, { $inc: {"countItems": -count} } );
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так!' });
    }
});

router.post(
    '/update',
    async (req,res) => {
    try {
        const { itemId, itemName } = req.body;
            await Items.updateOne({ '_id': itemId }, { $set: {'name': itemName } });
            res.status(201).json({ message: 'Коллекция удалена' });
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так!' });
    }
});

module.exports = router;