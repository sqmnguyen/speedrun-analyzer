import express, { json } from "express";
import cors from "cors";
    
const app = express();

// middleware
app.use(cors());
app.use(json());

app.listen(5000, () => {
    console.log("server has started on port 5000")
});