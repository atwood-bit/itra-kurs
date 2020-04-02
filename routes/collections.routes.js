const {Router} = require('express');
const Collections = require('../models/Collections');
const auth = require('../middleware/auth.middleware');
const router = Router();

router.get('/findall', async (req,res) => {
    try {
        const collections = await Collections.find( {} ).sort({ "countItems": -1, "dateCreate": -1 }).limit(10);
        res.json(collections);
    } catch(e) {
        res.status(500).json({ message: 'Что-то пошло не так' });
    }
})

router.get('/collection/:id', auth, async (req,res) => {
    try {
        const collections = await Collections.find( { owner: req.params.id } );
        res.json(collections);
    } catch(e) {
        res.status(500).json({ message: 'Что-то пошло не так' });
    }
})

router.get('/findone/:id', auth, async (req,res) => {
    try {
        const collections = await Collections.findOne( { _id: req.params.id } );
        res.json(collections);
    } catch(e) {
        console.log(e.message)
        res.status(500).json({ message: 'Что-то пошло не так' });
    }
})

router.post(
    '/create/:id',
    auth,
    async (req,res) => {
        try {
        const { name, topic, text, fields, img } = req.body;
        const collection = new Collections({ name, topic, text, owner: req.params.id, image: img });
        await collection.save();
        fields.map(async (f) => {
            await Collections.updateOne({ '_id': collection._id }, { $push: {'custom_fields': { 'name': f.name_field, 'type': f.type_field }} });
        })
        res.status(201).json({ message: 'Коллекция добавлена!' });
        } catch (e) {
            res.status(500).json({ message: 'Что-то пошло не так!' });
        }
    }
)

router.post(
    '/delField',
    async (req,res) => {
    try {
        const { colId, idField } = req.body;
            await Collections.updateOne({ '_id': colId }, { $pull: {'custom_fields': {'_id': idField}} });
            res.status(201).json({ message: 'Ok' });
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так!' });
    }
});

router.post(
    '/delete',
    async (req,res) => {
    try {
        const { delID } = req.body;
            await Collections.deleteOne({ _id: delID });
            res.status(201).json({ message: 'Ok' });
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так!' });
    }
});

router.post(
    '/update',
    async (req,res) => {
    try {
        const { collection, fieldsCol } = req.body;
            await Collections.updateOne({ '_id': collection._id}, { $set: {'name': collection.name, 'topic': collection.topic, 'text': collection.text } });
            fieldsCol.map(async (f) => {
                await Collections.updateOne({ '_id': collection._id }, { $set: {'custom_fields': { 'name': f.name, 'type': f.type }} });
            })
            res.status(201).json({ message: 'Updated' });
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так!' });
    }
});

module.exports = router;