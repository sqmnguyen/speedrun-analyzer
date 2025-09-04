import { Router } from "express";
import pool from "../db/pool.js";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM runs ORDER BY date DESC");
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "server error" });
    }
});

export default router;
