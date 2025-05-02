import express from 'express';
import cors from 'cors';
import router from '../routes/index';

const app = express();
const port = process.env.PORT || 4000;
app.use(cors());
app.use(express.json());
app.use('/', router);

app.listen(port, () =>
    console.log(`Example app listening on port ${port}!`),
);