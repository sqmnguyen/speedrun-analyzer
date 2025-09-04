import React, { useEffect, useState } from "react";

const SPREADSHEET_ID =
  "1Tyw9fwdZgsHJoHzlE-0LPSEDOduRkZwL2UUNA-_4Xo4"; // your sheet
const RANGE = "Raw Data"; // change to the tab name you want

export default function RunPage() {
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<string[][]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  

  useEffect(() => {
    const apiKey =
      "AIzaSyCRQ0y8ZYrBSo1qSGBim5Xg4ymHNlfTnK4";
    if (!apiKey) {
      setErr("Missing Google API key");
      setLoading(false);
      return;
    }
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(
      RANGE
    )}?key=${apiKey}`;

    (async () => {
      try {
        const res = await fetch(url);
        const data = await res.json();
        const vals: string[][] = data.values || [];
        if (vals.length === 0) {
          setHeaders([]);
          setRows([]);
        } else {
          setHeaders(vals[0]);
          setRows(vals.slice(1));
        }
      } catch (e: any) {
        setErr(e?.message || "Fetch failed");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="p-4">Loading…</div>;
  if (err) return <div className="p-4 text-red-600">Error: {err}</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Run Page</h1>
      <div className="overflow-x-auto rounded-2xl shadow">
        <table id="data-table" className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              {headers.map((h, i) => (
                <th key={i} className="px-3 py-2 text-left text-sm font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b">
                {r.map((c, j) => (
                  <td key={j} className="px-3 py-2 text-sm">
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
