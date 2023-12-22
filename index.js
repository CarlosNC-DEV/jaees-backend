import app from './src/app.js';
import { PORT } from './src/config.js';
import './src/db.js'

app.use((req, res, next) => {
    return res.status(200).json("Bienvenido a JAEES");
  });

app.listen(PORT, ()=>{
    console.log("servidor en puerto", PORT)
});