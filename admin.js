// -------------------------
// Supabase Client Connection
// -------------------------
const supabaseClient = supabase.createClient(
    "https://YOUR_URL.supabase.co",
    "YOUR_ANON_KEY"
);

// -------------------------
// Elements
// -------------------------
const calendar = document.getElementById("calendar");
const appointmentsTable = document.getElementById("appointments-table");
const appointmentsBody = document.getElementById("appointments-body");
const dayTitle = document.getElementById("day-title");

let today = new Date();
let year = today.getFullYear();
let month = today.getMonth();

buildCalendar(month, year);

function buildCalendar(month, year) {
    calendar.innerHTML = "";

    let firstDay = new Date(year, month, 1).getDay();
    let daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement("div");
        empty.className = "day empty";
        calendar.appendChild(empty);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const div = document.createElement("div");
        div.className = "day";
        div.textContent = day;
        div.onclick = () => loadAppointments(year, month, day);
        calendar.appendChild(div);
    }
}

// -------------------------
// Load Appointments for Day
// -------------------------
async function loadAppointments(year, month, day) {
    const date = new Date(year, month, day);
    const isoDate = date.toISOString().split("T")[0];

    dayTitle.textContent = `Appointments for ${isoDate}`;

    let { data, error } = await supabaseClient
        .from("appointments")
        .select("*")
        .gte("start_time", isoDate + " 00:00")
        .lte("start_time", isoDate + " 23:59");

    if (error) {
        console.error("Error:", error);
        return;
    }

    appointmentsBody.innerHTML = "";
    appointmentsTable.style.display = "table";

    if (data.length === 0) {
        appointmentsBody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center;">No appointments</td>
            </tr>`;
        return;
    }

    data.forEach(row => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${row.client_name}</td>
            <td>${row.client_email}</td>
            <td>${row.service}</td>
            <td>${row.location}</td>
            <td>${row.start_time}</td>
        `;
        appointmentsBody.appendChild(tr);
    });
}
