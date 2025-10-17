document.addEventListener("DOMContentLoaded", () => {
    const apiBase = "http://localhost:3000/CriminalCases";

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
        try {
            const res = await fetch(apiBase);
            const data = await res.json();
            showMessage(`All cases: ${JSON.stringify(data, null, 2)}`);
        } catch (err) {
            showMessage(`Error fetching all: ${err.message}`, true);
        }
    });

    fetchByIdButton.addEventListener("click", async () => {
        const id = idInput.value.trim();
        if (!id) return showMessage("ID is required", true);

        try {
            const res = await fetch(`${apiBase}`);
            const all = await res.json();
            const caseData = all.find(c => c.id == id);
            if (!caseData) return showMessage("Case not found", true);
            showMessage(JSON.stringify(caseData, null, 2));
        } catch (err) {
            showMessage(`Error: ${err.message}`, true);
        }
    });

    insertButton.addEventListener("click", async () => {
        try {
            const CaseOverview = overviewInput.value.trim();
            const Evidence = evidenceInput.value.trim();
            const LegalProcess = processInput.value.trim();
            const Updates = updatesInput.value.trim();

            const res = await fetch(apiBase, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ CaseOverview, Evidence, LegalProcess, Updates })
            });

            const data = await res.json();
            showMessage(`Inserted: ${JSON.stringify(data)}`);
        } catch (err) {
            showMessage(`Insert error: ${err.message}`, true);
        }
    });

    updateButton.addEventListener("click", async () => {
        const id = idInput.value.trim();
        if (!id) return showMessage("ID is required", true);

        try {
            const res = await fetch(`${apiBase}/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    CaseOverview: overviewInput.value.trim(),
                    Evidence: evidenceInput.value.trim(),
                    LegalProcess: processInput.value.trim(),
                    Updates: updatesInput.value.trim()
                })
            });

            const data = await res.json();
            showMessage(`Updated: ${JSON.stringify(data)}`);
        } catch (err) {
            showMessage(`Update error: ${err.message}`, true);
        }
    });

    deleteButton.addEventListener("click", async () => {
        const id = idInput.value.trim();
        if (!id) return showMessage("ID is required", true);

        try {
            const res = await fetch(`${apiBase}/${id}`, { method: "DELETE" });
            const data = await res.json();
            showMessage(data.message);
        } catch (err) {
            showMessage(`Delete error: ${err.message}`, true);
        }
    });
});
