// This way to import thing is better why? It is asyncronouse , you can use it anywhere in the code only at the top. Introduced in ES Module befor it we use commonJS one. Also if you are using it make sure you add type: 'Module' in package.json file.

import connectDB from './db/index.js';
import app from './app.js';
const PORT = 3000;




try {
    app.listen(PORT, () => {
        console.log('Server started successfully!')
    })
    connectDB();
} catch (error) {
    console.log(error);
}
