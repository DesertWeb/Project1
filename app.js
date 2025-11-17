import { createClient } from '@supabase/supabase-js';
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = "https://mxkdnzuwqwaexmpfshir.supabase.co"
const supabaseKey = 'sb_publishable_U5xeCDZNs_potUNZLjhs2A_mVAPTdBS'
const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("frontend"));


function sendError(res, status, error, fieldErrors = []) {
    return res.status(status).json({
        status,
        error,
        timestamp: new Date().toISOString(),
        fieldErrors
    });
}


function validateCasePayload(body) {
    const errors = [];

    if (!body.CaseOverview || body.CaseOverview.length < 5) {
        errors.push({ field: "CaseOverview", code: "INVALID", message: "Minimum 5 characters" });
    }

    if (!body.Evidence || body.Evidence.length < 3) {
        errors.push({ field: "Evidence", code: "INVALID", message: "Minimum 3 characters" });
    }

    if (!body.LegalProcess || body.LegalProcess.length < 3) {
        errors.push({ field: "LegalProcess", code: "INVALID", message: "Minimum 3 characters" });
    }

    if (body.Updates && body.Updates.length < 3) {
        errors.push({ field: "Updates", code: "INVALID", message: "Minimum 3 characters if provided" });
    }

    return errors;
}


app.get("/status", (req, res) => {
    res.json({ status: "Running" });
});

app.get("/CriminalCases", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('CriminalCases')
            .select('*')
            .order('id');

        if (error) throw error;
        res.json(data);

    } catch (err) {
        sendError(res, 500, err.message);
    }
});

app.post("/CriminalCases", async (req, res) => {

    const errors = validateCasePayload(req.body);
    if (errors.length > 0) {
        return sendError(res, 400, "Bad Request", errors);
    }

  const { CaseOverview, Evidence, LegalProcess, Updates, JudgeName, VerdictDate } = req.body;


    try {
        const { data, error } = await supabase
            .from('CriminalCases')
            .insert([req.body])
            .select();


        if (error) throw error;

  try {
    const { data, error } = await supabase
      .from('CriminalCases')
      .insert([{ CaseOverview, Evidence, LegalProcess, Updates, JudgeName, VerdictDate }])
      .select();

        res.status(201).json(data[0]);

    } catch (err) {
        sendError(res, 500, err.message);
    }
});

app.patch("/CriminalCases/:id", async (req, res) => {
    const { id } = req.params;

    if (isNaN(id)) {
        return sendError(res, 400, "ID must be numeric");
    }
  const { id } = req.params;
  const { CaseOverview, Evidence, LegalProcess, Updates, JudgeName, VerdictDate } = req.body;

  try {
    const { data, error } = await supabase
      .from('CriminalCases')
      .update({ CaseOverview, Evidence, LegalProcess, Updates, JudgeName, VerdictDate })
      .eq('id', id)
      .select();

    const errors = validateCasePayload(req.body);
    if (errors.length > 0) {
        return sendError(res, 422, "Validation Failed", errors);
    }

    try {
        const { data, error } = await supabase
            .from('CriminalCases')
            .update(req.body)
            .eq('id', id)
            .select();

        if (error) throw error;

        if (!data || data.length === 0) {
            return sendError(res, 404, "Not Found");
        }

        res.json(data[0]);

    } catch (err) {
        sendError(res, 500, err.message);
    }
});

app.delete("/CriminalCases/:id", async (req, res) => {
    const { id } = req.params;

    if (isNaN(id)) {
        return sendError(res, 400, "ID must be numeric");
    }

    try {
        const { data, error } = await supabase
            .from('CriminalCases')
            .delete()
            .eq('id', id)
            .select();

        if (error) throw error;

        if (!data || data.length === 0) {
            return sendError(res, 404, "Not Found");
        }

        res.json({ message: `Case ${id} deleted` });

    } catch (err) {
        sendError(res, 500, err.message);
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
