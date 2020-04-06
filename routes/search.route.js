const {Router} = require('express');
const Collections = require('../models/Collections');
const Comments = require('../models/Comments');
const Items = require('../models/Items');
const router = Router();

router.get('/:findWord', async (req,res) => {
    let arr = [];
    try {
        const collections = await Collections.find({ $text: { $search: req.params.findWord } }, {_id: 1});
        if (collections.length) {
            await Promise.all(collections.map(async (c) => {
                const items = await Items.find({ 'ownCol': c._id }, {_id: 1});
                items.map((i) => {arr.push(i)})
            })) 
        }
        const items = await Items.find( { $text: { $search: req.params.findWord } }, {_id: 1} );
        const comments = await Comments.find({ $text: { $search: req.params.findWord } }, {itemId: 1});
        items.map((i) => {arr.push(i)})
        comments.map((com) => {arr.push(com)})
        let i = 0,
        current,
        length = arr.length,
        unique = [];
            for (; i < length; i++) {
              current = arr[i];
              if (!~unique.indexOf(current)) {
                unique.push(current);
              }
            }
        res.json(unique);
    } catch(e) {
        console.log(e.message);
        res.status(500).json({ message: 'Что-то пошло не так' });
    }
})

module.exports = router;