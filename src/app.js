import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

//create roles default
import './middlewares/create.roles.default.js'

import users from './routes/user.routes.js';
import lotteries from './routes/lotteries.routes.js';
import sales from './routes/sales.routes.js';
import company from './routes/company.routes.js';

const app = express()

app.use(cors())
app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use("/api", users)
app.use("/api", lotteries)
app.use("/api", sales)
app.use("/api", company)

export default app