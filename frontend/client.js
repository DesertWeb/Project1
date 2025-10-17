import { createClient } from 'https://esm.sh/@supabase/supabase-js';

const SUPABASE_URL = "https://mxkdnzuwqwaexmpfshir.supabase.co";
const SUPABASE_KEY = "sb_publishable_U5xeCDZNs_potUNZLjhs2A_mVAPTdBS";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener("DOMContentLoaded", () => {
  const idInput = document.getElementById("id");
  const overviewInput = document.getElementById("CaseOverview");
  const evidenceInput = document.getElementById("Evidence");
  const processInput = document.getElementById("LegalProcess");
  const updatesInput = document.getElementById("Updates");
  const messageDiv = document.getElementById("message");

  const fetchAllButton = document.getElementById("fetchAll");
  const fetchByIdButton = document.getElementById("fetchById");
  const insertButton = document.getElementById("insertButton");
  const updateButton = document.getElementById("updateButton");
  const deleteButton = document.getElementById("deleteButton");

  function showMessage(msg, isError = false) {
    messageDiv.textContent = msg;
    messageDiv.style.color = isError ? "red" : "green";
    console.log(msg);
  }

  fetchAllButton.addEventListener("click", async () => {
    const { data, error } = await supabase.from("CriminalCases").select("*").order("id");
    if (error) return showMessage(error.message, true);
    showMessage(JSON.stringify(data, null, 2));
  });

  fetchByIdButton.addEventListener("click", async () => {
    const id = idInput.value.trim();
    if (!id) return showMessage("ID is required", true);

    const { data, error } = await supabase.from("CriminalCases").select("*").eq("id", id).single();
    if (error) return showMessage(error.message, true);
    showMessage(JSON.stringify(data, null, 2));
  });

  insertButton.addEventListener("click", async () => {
    const CaseOverview = overviewInput.value.trim();
    const Evidence = evidenceInput.value.trim();
    const LegalProcess = processInput.value.trim();
    const Updates = updatesInput.value.trim();

    const { data, error } = await supabase
      .from("CriminalCases")
      .insert([{ CaseOverview, Evidence, LegalProcess, Updates }])
      .select();

    if (error) return showMessage(error.message, true);
    showMessage(`Inserted: ${JSON.stringify(data[0])}`);
  });

  updateButton.addEventListener("click", async () => {
    const id = idInput.value.trim();
    if (!id) return showMessage("ID is required", true);

    const { data, error } = await supabase
      .from("CriminalCases")
      .update({
        CaseOverview: overviewInput.value.trim(),
        Evidence: evidenceInput.value.trim(),
        LegalProcess: processInput.value.trim(),
        Updates: updatesInput.value.trim(),
      })
      .eq("id", id)
      .select();

    if (error) return showMessage(error.message, true);
    showMessage(`Updated: ${JSON.stringify(data[0])}`);
  });

  deleteButton.addEventListener("click", async () => {
    const id = idInput.value.trim();
    if (!id) return showMessage("ID is required", true);

    const { error } = await supabase.from("CriminalCases").delete().eq("id", id);
    if (error) return showMessage(error.message, true);
    showMessage(`Case ${id} deleted`);
  });
});
