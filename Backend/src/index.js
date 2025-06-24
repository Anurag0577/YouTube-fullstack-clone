// This way to import thing is better why? It is asyncronouse , you can use it anywhere in the code only at the top. Introduced in ES Module befor it we use commonJS one. Also if you are using it make sure you add type: 'Module' in package.json file.
import express from 'express';
import cors from 'cors';
import connectDB from './db/index.js';

const PORT = 3000;
const app = express(); // create an instance

app.use(cors);
app.use(express.json())

try {
    app.listen(PORT, () => {
        console.log('Server started successfully!')
    })
    connectDB();
} catch (error) {
    console.log(error);
}
