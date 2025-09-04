import "dotenv/config";
import pool from "../db/pool.js";

const id = process.env.SHEETS_SPREADSHEET_ID;
const range = encodeURIComponent(process.env.SHEETS_RANGE || "Raw Data");
const key = process.env.GOOGLE_API_KEY;

const url = `https://sheets.googleapis.com/v4/spreadsheets/${id}/values/${range}?key=${key}`;

const sql = `
  INSERT INTO runs (
    id,            -- $1
    run_number,     -- $2
    run_ts,        -- $3
    rta_seconds,   -- $4
    igt_seconds,   -- $5
    seed,          -- $6
    spawn_biome,   -- $7
    iron_source,   -- $8
    enter_type,    -- $9
    gold_source,   -- $10
    bastion_type,  -- $11
    end_fight_type,-- $12
    recent_version,-- $13
    notes          -- $14
  )
  VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
`;

const main = async () => {
    const r = await fetch(url);
    if (!r.ok) throw new Error(`Sheets HTTP ${r.status}`);
    const { values = [] } = await r.json();
    if (values.length < 2) return console.log("No rows");

    // actual data starts on 4th row
    const headers = values[0];      // row 1 = headers
    const rows    = values.slice(3); // rows 4..N = data

    const idx = (h) => headers.indexOf(h);

    // header indices
    const iId            = idx("run_id");               // sheet unique id
    const iRunTs         = idx("date_played_est");      // timestamp/date
    const iRta           = idx("rta");                  // real-time seconds (or mm:ss)
    const iIgtA          = idx("igt");                  // preferred igt header
    const iIgtB          = idx("igt_2");                // fallback igt header
    const iSeed          = idx("seed");
    const iSpawnBiome    = idx("spawn_biome");
    const iIronSource    = idx("iron_source");
    const iEnterType     = idx("enter_type");
    const iGoldSource    = idx("gold_source");
    const iBastionType   = idx("bastion_type");
    const iEndFightType  = idx("end_fight_type");
    const iRecentVersion = idx("recent_version");
    const iNotes         = idx("notes");

    const get = (row, i) => (i >= 0 ? row[i] : null);

    const toBool = (v) =>
        v === true || String(v).toLowerCase() === "true" ? true :
        v === false || String(v).toLowerCase() === "false" ? false : null;

    const toNumber = (v) => (v === "" || v == null ? null : Number(v));

    const toIso = (v) => {
        if (!v) return null;
        const d = new Date(v);
        return isNaN(d) ? null : d.toISOString();
    };

    // const toIgt = (row) => {
    //     const a = get(row, iIgtA);
    //     const b = get(row, iIgtB);
    //     const val = a ?? b;
    //     return toNumber(val);
    // };

    const toInt = (v) => v == null || v === '' ? null : Number(String(v).replace(/,/g,''));

    const parseHMS = (v) => {
        if (!v) return null;
        const s = String(v).trim();
        if (/^\d+(\.\d+)?$/.test(s)) return Number(s); // already seconds
        const m = s.match(/^(\d{1,2}):([0-5]?\d)(?::([0-5]?\d))?$/);
        if (!m) return null;
        const [, a, b, c] = m.map(Number);
        return c != null ? a*3600 + b*60 + c : a*60 + b;
    };


    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        let count = 0;

        for (const row of rows) {
        const sheetId = get(row, iId)?.trim();
        if (!sheetId) continue;

        await client.query(sql, [
            toInt(row[iId]),                    // $1 id
            toInt(row[iId]),                    // $2 run number (remove in future migration, it's a repeat of id)
            toIso(row[iRunTs]),                 // $3 run_ts
            2,                                  // rta_seconds placeholder since it doesn't seem to work
            // parseHMS(row[iRta]),             // $4 rta_seconds
            parseHMS(row[iIgtA] ?? row[iIgtB]), // $5 igt_seconds
            get(row, iSeed) ?? null,            // $6 seed
            get(row, iSpawnBiome) ?? null,      // $7 spawn_biome
            get(row, iIronSource) ?? null,      // $8 iron_source
            get(row, iEnterType) ?? null,       // $9 enter_type
            get(row, iGoldSource) ?? null,      // $10 gold_source
            get(row, iBastionType) ?? null,     // $11 bastion_type
            get(row, iEndFightType) ?? null,    // $12 end_fight_type
            toBool(get(row, iRecentVersion)),   // $13 recent_version
            get(row, iNotes) ?? null,           // $14 notes
        ]);

        count++;
        }

        await client.query("COMMIT");
        console.log(`Inserted ${count} rows`);
    } catch (e) {
        await client.query("ROLLBACK");
        throw e;
    } finally {
        client.release();
        await pool.end();
    }
};

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
