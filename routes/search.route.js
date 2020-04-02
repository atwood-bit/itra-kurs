const {Router} = require('express');
const Collections = require('../models/Collections');
const Comments = require('../models/Comments');
const Items = require('../models/Items');
const router = Router();

router.get('/', async (req,res) => {
    try {
        //const {text2} = req.body;
        //Collections.createIndexes({"text" : "text"});
        //Comments.createIndexes({"text" : "comment"});
        Items.createIndexes({"tags" : 'text'});
        // const collection = await Collections.find({ $text: { $search: text } });
        // console.log(collection);
        // const comments = await Comments.find({ $comment : { $search: text } });
        // console.log(comments);
        const items = await Items.find( { $text: { '$search': "11" } } );
        console.log(items);
        //res.json();
    } catch(e) {
        res.status(500).json({ message: 'Что-то пошло не так' });
    }
})

module.exports = router;