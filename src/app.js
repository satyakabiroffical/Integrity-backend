import express from "express";
import cors from "cors"
import { errorMiddleware } from "./api/middlewares/errorMiddleware.js";
const app = express();

// middlewares
app.use(cors())
app.use(express.json());// For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use(errorMiddleware);


// import all routes
import userRoute from "./api/routers/userRoute.js"
import cityRoute from "./api/routers/cityRoute.js"
import  companyRoute from "./api/routers/companyRoute.js"
import transactionRoute from "./api/routers/transactionRoute.js"
import contactUsRoute from "./api/routers/contactUsRoute.js"
import planRoute from "./api/routers/planRoute.js"
import purchaseRoute from "./api/routers/purchaseRoute.js"
import durationRoute from "./api/routers/durationRoute.js"



app.use("/api", userRoute)
app.use("/api", cityRoute)
app.use("/api", companyRoute)
app.use("/api", transactionRoute)
app.use("/api", contactUsRoute)
app.use("/api", planRoute)
app.use("/api", purchaseRoute)
app.use("/api", durationRoute)






export default app;