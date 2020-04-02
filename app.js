const express = require('express');
const config = require('config');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
app.use(express.json({ extended: true }));
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/user', require('./routes/user.routes'));
app.use('/api/col', require('./routes/collections.routes'));
app.use('/api/items', require('./routes/items.routes'));
app.use('/api/comments', require('./routes/comments.routes'));
app.use('/api/search', require('./routes/search.route'));

if (process.env.NODE_ENV === 'production') {
    app.use('/', express.static(path.join(__dirname, 'client', 'build')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

const PORT = process.env.PORT || 5000;
async function start() {
    try{
        await mongoose.connect(config.get('mongoUri'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        app.listen(PORT, () => console.log(`App has been started on ${PORT}`));
    }   catch(e) {
        console.log('Server error', e.message);
        process.exit(1);
    }
}
start();
