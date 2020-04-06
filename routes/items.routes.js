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
        res.status(500).json(e.message);
    }
})

router.get('/search/:itemId', async (req,res) => {
    const itemId = req.params.itemId.split('&');
    const res_items = [];
    itemId.pop();
    try {
        await Promise.all(itemId.map(async (i) => {
            const item = await Items.findById(i);
            res_items.push(item);
        }))
        res.json(res_items);
    } catch(e) {
        res.status(500).json(e.message);
    }
})

router.get('/:id', async (req,res) => {
    try {
        const items = await Items.find({ ownCol: req.params.id })
        res.json(items);
    } catch(e) {
        res.status(500).json(e.message);
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
        res.status(201).json({ message: 'Add' });
        } catch (e) {
            res.status(500).json(e.message);
        }
    }
)

router.post(
    '/like',
    async (req,res) => {
        try {
        const { idItem, idUser } = req.body;
        await Items.updateOne({ '_id': idItem }, { $push: {'likes': idUser } });
        res.status(201).json({ message: 'Liked' });
        } catch (e) {
            res.status(500).json(e.message);
        }
    }
)

router.post(
    '/unlike',
    async (req,res) => {
        try {
        const { idItem, idUser } = req.body;
        await Items.updateOne({ '_id': idItem }, { $pull: {'likes': idUser } });
        res.status(201).json({ message: 'unLiked' });
        } catch (e) {
            res.status(500).json(e.message);
        }
    }
)

router.get('/findone/:id', async (req,res) => {
    try {
        const items = await Items.findOne({ _id: req.params.id });
        res.json(items);
    } catch(e) {
        res.status(500).json(e.message);
    }
})

router.get('/sort/:id/:value', async (req,res) => {
    try {
        const value = req.params.value;
        const items = await Items.find({ ownCol: req.params.id }).sort({ 'name': value })
        res.json(items);
    } catch(e) {
        res.status(500).json(e.message);
    }
})

router.post(
    '/delete',
    async (req,res) => {
    try {
        const { itemId, idCol } = req.body;
            await Items.deleteOne({ _id: itemId });
            await Collections.updateOne( {_id: idCol}, { $inc: {"countItems": -1} } );
            res.status(201).json({ message: 'Deleted' });
    } catch (e) {
        res.status(500).json(e.message);
    }
});

router.post(
    '/update',
    async (req,res) => {
    try {
        const { item, fields } = req.body;
            await Items.updateOne({ '_id': item._id }, { $set: {'name': item.name, 'tags': item.tags } });
            fields.map(async (f) => {
                await Items.updateOne({ '_id': item._id }, { $set: {'custom_fields': { 'name': f.name, 'value': f.value }} });
            })
            res.status(201).json({message: "Updated"});
    } catch (e) {
        res.status(500).json(e.message);
    }
});

module.exports = router;