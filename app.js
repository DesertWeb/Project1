import { createClient } from '@supabase/supabase-js';
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("frontend"));

app.get("/status", (req, res) => {
  res.json({ status: "Running" });
});

app.get("/CriminalCases", async (req, res) => {
  try {
    const { data, error } = await supabase.from('CriminalCases').select('*').order('id');
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/CriminalCases", async (req, res) => {
  const { CaseOverview, Evidence, LegalProcess, Updates } = req.body;

  if (!CaseOverview) {
    return res.status(400).json({ error: "CaseOverview is required" });
  }

  try {
    const { data, error } = await supabase
      .from('CriminalCases')
      .insert([{ CaseOverview, Evidence, LegalProcess, Updates }])
      .select();

    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch("/CriminalCases/:id", async (req, res) => {
  const { id } = req.params;
  const { CaseOverview, Evidence, LegalProcess, Updates } = req.body;

  try {
    const { data, error } = await supabase
      .from('CriminalCases')
      .update({ CaseOverview, Evidence, LegalProcess, Updates })
      .eq('id', id)
      .select();

    if (error) throw error;
    res.json(data[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/CriminalCases/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = await supabase
      .from('CriminalCases')
      .delete()
      .eq('id', id);
    if (error) throw error;
    res.json({ message: `Case ${id} deleted` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
