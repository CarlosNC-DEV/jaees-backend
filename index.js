import app from './src/app.js';
import { PORT } from './src/config.js';
import './src/db.js'

app.listen(PORT, ()=>{
    console.log("servidor en puerto", PORT)
});