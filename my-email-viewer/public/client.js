const socket = io("http://localhost:3000");
let lastShownId = localStorage.getItem("last_email_id");

// ----- Realtime hiển thị email mới -----
socket.on("new_email", (email) => {
  if (email.id !== lastShownId) {
    const display = document.getElementById("realtime");
    // const message = `🆕 MỚI: #${email.id} - ${email.title} - ${email.received_time}`;
    if (display) {
      const div = document.createElement("div");
      // div.textContent = message;
      display.prepend(div);
      localStorage.setItem("last_email_id", email.id);
      lastShownId = email.id;
    }
  }
});

// ----- Regex để phân loại -----
const spamRegex = [
  /GIẢM GIÁ.*[0-9]{2,}%/i,
  /CHỈ.*HÔM NAY/i,
  /KHUYẾN MÃI.*KHỦNG/i,
  /[💰🎉🔥⭐💯]/u,
  /!!!/,
  /\$\$\$/,
  /CLICK.*NGAY/i,
];
const dangerRegex = [
  /bảo mật|security|alert/i,
  /tài khoản.*bị.*khóa|suspended|compromised/i,
  /xác (minh|nhận|thực).*khẩn|verify|confirm/i,
  /cập nhật.*ngay|update now/i,
  /hoạt động đáng ngờ/i,
  /thông báo thanh toán/i,
  /amaz[0o]n|g[0o]{2}gle|micr[0o]soft|payp[a@]l|faceb[0o]{2}k/i,
];
const junkRegex = [/quảng cáo/i, /sale/i, /dịch vụ/i, /ưu đãi/i];

function classifyEmail(email) {
  const text = (email.title + " " + email.content || "").toLowerCase();
  if (spamRegex.some((r) => r.test(text))) return "spam";
  if (dangerRegex.some((r) => r.test(text))) return "danger";
  if (junkRegex.some((r) => r.test(text))) return "junk";
  return "safe";
}

// ----- Tab chuyển trang -----
document.getElementById("btnHome").addEventListener("click", () => {
  document.getElementById("homePage").style.display = "block";
  document.getElementById("categoryPage").style.display = "none";
});

document.getElementById("btnCategory").addEventListener("click", async () => {
  document.getElementById("homePage").style.display = "none";
  document.getElementById("categoryPage").style.display = "block";

  // Gọi API mới để lấy dữ liệu phân loại
  const res = await fetch("/emails/classify");
  const { counts, data } = await res.json();

  // Cập nhật tổng số
  document.getElementById("safeCount").textContent = counts.safe;
  document.getElementById("junkCount").textContent = counts.junk;
  document.getElementById("spamCount").textContent = counts.spam;
  document.getElementById("dangerCount").textContent = counts.danger;

  // Render từng nhóm
  renderCategory("safe", data.safe);
  renderCategory("junk", data.junk);
  renderCategory("spam", data.spam);
  renderCategory("danger", data.danger);
});

// ----- Render bảng có phân trang -----
function renderCategory(type, emails) {
  const perPage = 20;
  let currentPage = 1;
  const tbody = document.getElementById(type + "Emails");

  // Chỉ tạo 1 lần
  if (!tbody.dataset.initialized) {
    for (let i = 0; i < perPage; i++) {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="email-id" style="width:60px;"></td>
        <td class="email-from" style="width:250px;"></td>
        <td class="email-title"></td>
      `;
      tbody.appendChild(tr);
    }
    tbody.dataset.initialized = "true";
  }

  const rows = tbody.querySelectorAll("tr");

  function renderPage(page) {
    const start = (page - 1) * perPage;
    const pageData = emails.slice(start, start + perPage);

    // Cập nhật dữ liệu vào các dòng đã có
    rows.forEach((tr, index) => {
      const email = pageData[index];
      tr.querySelector(".email-id").textContent = email ? email.id : "";
      tr.querySelector(".email-from").textContent = email
        ? email.from_email
        : "";
      tr.querySelector(".email-title").textContent = email ? email.title : "";
    });

    // Pagination
    const totalPages = Math.ceil(emails.length / perPage);
    const pagination = document.getElementById(type + "Pagination");
    pagination.innerHTML = "";

    function createPageButton(p) {
      const btn = document.createElement("button");
      btn.textContent = p;
      if (p === page) btn.classList.add("active");
      btn.addEventListener("click", () => {
        currentPage = p;
        renderPage(currentPage);
      });
      pagination.appendChild(btn);
    }

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) createPageButton(i);
    } else {
      createPageButton(1);
      if (page > 4) createPageButton("...");
      for (
        let i = Math.max(2, page - 2);
        i <= Math.min(totalPages - 1, page + 2);
        i++
      ) {
        createPageButton(i);
      }
      if (page < totalPages - 3) createPageButton("...");
      createPageButton(totalPages);
    }
  }

  renderPage(1);
}

// Chuyển tab
document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".tab-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    document
      .querySelectorAll(".tab-content")
      .forEach((c) => (c.style.display = "none"));
    document.getElementById(btn.dataset.tab + "Tab").style.display = "block";
  });
});

// ----- Lazy load trang chủ -----
const emailList = document.getElementById("email-list");
let page = 1;
const limit = 50;
let loading = false;
let hasMore = true;

function loadEmails() {
  if (loading || !hasMore) return;
  loading = true;
  document.getElementById("loading").style.display = "block";

  function appendRowsSmoothly(rows) {
    let i = 0;
    function addRow() {
      if (i >= rows.length) return;
      emailList.appendChild(rows[i]);
      i++;
      requestAnimationFrame(addRow); // Thêm từng frame
    }
    addRow();
  }

  fetch(`/emails?page=${page}&limit=${limit}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.length === 0) hasMore = false;
      else {
        const rows = data.map((email) => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
          <td>${email.id}</td>
          <td>${email.title}</td>
          <td>${email.from_email || "N/A"}</td>
          <td>${email.received_time}</td>
        `;
          return tr;
        });
        appendRowsSmoothly(rows);
        page++;
      }
      loading = false;
      document.getElementById("loading").style.display = "none";
    });
}
loadEmails();

// Thay vì scroll toàn trang, dùng scroll riêng cho bảng
document.addEventListener("DOMContentLoaded", () => {
  const tableWrapper = document.querySelector(".table-wrapper");
  if (tableWrapper) {
    tableWrapper.addEventListener("scroll", (e) => {
      const el = e.target;
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 20) {
        loadEmails();
      }
    });
  }
});
