const {Router} = require('express');
//const Items = require('../models/Items');
const Comments = require('../models/Comments');
//const auth = require('../middleware/auth.middleware');
const router = Router();

router.get('/:id', async (req,res) => {
    try {
        const comments = await Comments.find({ itemId: req.params.id })
        res.json(comments);
    } catch(e) {
        res.status(500).json({ message: 'Что-то пошло не так' });
    }
})

router.post(
    '/add/:id',
    async (req,res) => {
        try {
        const { name, text } = req.body;
        const comment = new Comments({ name, text, itemId: req.params.id });
        await comment.save();
        res.status(201).json({ message: 'Добавлено' });
        } catch (e) {
            res.status(500).json({ message: 'Что-то пошло не так!' });
        }
    }
)

// router.post(
//     '/delete',
//     async (req,res) => {
//     try {
//         const { delId } = req.body;
//         if (delId.length === 1) {
//             await Items.deleteOne({ _id: delId });
//             res.status(201).json({ message: 'Айтем удален' });
//             }
//             else {
//                 await Items.deleteMany({ _id: delId });
//                 res.status(201).json({ message: 'Айтемы удалены' });
//             }
//             const count = delId.length();
//             await Collections.updateOne( {_id: colId}, { $inc: {"countItems": -count} } );
//     } catch (e) {
//         res.status(500).json({ message: 'Что-то пошло не так!' });
//     }
// });

module.exports = router;