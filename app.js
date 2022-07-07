require('dotenv').config();
const express = require('express');


const connectDB = require('./db/connect');

const accountRouter = require('./routes/account');

const errorHandlerMiddleware = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.get('/', (req, res) => {
//     res.status(200).send('welcome!')
// })

app.use('/split-payments/compute', accountRouter);

app.use(notFound);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, console.log(`listening on port ${port}...`))
    } catch (error) {
        console.log(error)
    }
}
start()