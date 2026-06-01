const supabaseClient = supabase.createClient(
  "https://rjnuoslhxwawiyvvtjlc.supabase.co",
  "TON_ANON_KEY"
);

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const KEY = "nougatine_dark_v1";

const icon = (name) => ({
  dash: `<svg class="ico" viewBox="0 0 24 24"><path d="M3 13h8V3H3zm10 8h8V11h-8zM13 3v6h8V3zM3 21h8v-6H3z"/></svg>`,
  users: `<svg class="ico" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zM8 11c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>`,
  events: `<svg class="ico" viewBox="0 0 24 24"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v13c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 15H5V10h14v9z"/></svg>`,
  wardrobe: `<svg class="ico" viewBox="0 0 24 24"><path d="M12 2l4 4-1.5 1.5L13 6v4h5v12h-3v-5H9v5H6V10h5V6L9.5 7.5 8 6l4-4z"/></svg>`
}[name] || "");

function seed() {
  return {
    users: [
      {
        id: "u1",
        nom: "Administrateur Général",
        email: "admin@nougatine.sn",
        password: "admin123",
        role: "admin_general",
        phone: "",
        photo: ""
      },
      {
        id: "u2",
        nom: "Responsable Event",
        email: "resp@nougatine.sn",
        password: "resp123",
        role: "responsable",
        phone: "",
        photo: ""
      },
      {
        id: "u3",
        nom: "Agent Accueil",
        email: "agent@nougatine.sn",
        password: "agent123",
        role: "agent",
        phone: "",
        photo: ""
      }
    ],
    current: null
  };
}

let db = JSON.parse(localStorage.getItem(KEY) || "null") || seed();

const save = () => localStorage.setItem(KEY, JSON.stringify(db));

function toast(t) {
  let x = document.createElement("div");
  x.className = "toast";
  x.textContent = t;
  document.body.appendChild(x);
  setTimeout(() => x.remove(), 2400);
}

function img(u, txt = "N") {
  return u
    ? `<img class="avatar" src="${u}" alt="">`
    : `<div class="avatar">${txt[0] || "N"}</div>`;
}

function app() {
  db.current ? renderShell() : renderLogin();
}

function renderLogin() {
  $("#app").innerHTML = `
  <div class="login">

    <img class="login-bg-logo" src="logo.png">

    <div class="login-card">

      <div class="hero">
        <img class="hero-logo" src="logo.png">

        <h1>Plateforme interne<br>Nougatine Accueil</h1>

        <p>
          Gestion premium des agents, responsables,
          événements, convocations et garde-robe.
        </p>

        <div class="chips">
          <span>Dark mode</span>
          <span>Photos agents</span>
          <span>GitHub / Vercel</span>
        </div>

        <small>
          Comptes test :
          admin@nougatine.sn / admin123
        </small>
      </div>

      <div class="login-form">
        <div class="tabs">
          <button class="tab active">Connexion</button>
        </div>

        <h2>Connexion</h2>

        <input id="email" placeholder="Email">
        <input id="pass" type="password" placeholder="Mot de passe">

        <button class="primary" onclick="login()">
          Se connecter
        </button>

        <div class="demo-users">
          Responsable : resp@nougatine.sn / resp123 <br>
          Agent : agent@nougatine.sn / agent123
        </div>
      </div>

    </div>
  </div>
  `;
}

function login() {
  let u = db.users.find(
    x =>
      x.email === $("#email").value.trim() &&
      x.password === $("#pass").value
  );

  if (!u) return toast("Identifiants incorrects");

  db.current = u.id;
  save();
  app();
}

function logout() {
  db.current = null;
  save();
  app();
}

const me = () => db.users.find(x => x.id === db.current);

function renderShell(page = "dashboard") {
  let u = me();

  $("#app").innerHTML = `
  <div class="shell">

    <aside class="side">

      <div class="brand">
        <img class="logo" src="logo.png">
        <div>
          <b>Nougatine</b>
          <small>${u.role}</small>
        </div>
      </div>

      <nav class="nav">
        <button onclick="renderPage('dashboard')">
          ${icon("dash")} Tableau de bord
        </button>

        <button onclick="renderPage('agents')">
          ${icon("users")} Agents
        </button>

        <button onclick="renderPage('events')">
          ${icon("events")} Événements
        </button>

        <button onclick="renderPage('wardrobe')">
          ${icon("wardrobe")} Garde-robe
        </button>
      </nav>

      <button class="logout" onclick="logout()">
        Déconnexion
      </button>

    </aside>

    <main class="content">
      <header class="topbar">
        <h1 id="pageTitle">Dashboard</h1>

        <div class="userbox">
          ${img(u.photo, u.nom)}
          <span>${u.nom}</span>
        </div>
      </header>

      <section id="content"></section>
    </main>

  </div>
  `;

  renderPage(page);
}

function renderPage(p) {
  $("#pageTitle").textContent = p;

  if (p === "dashboard") dashboard();
  if (p === "agents") agents();
  if (p === "events") events();
  if (p === "wardrobe") wardrobe();
}

function dashboard() {
  $("#content").innerHTML = `
  <div class="cards">

    <div class="card">
      <h3>Agents</h3>
      <strong>${db.users.length}</strong>
    </div>

    <div class="card">
      <h3>Événements</h3>
      <strong>12</strong>
    </div>

    <div class="card">
      <h3>Présences</h3>
      <strong>94%</strong>
    </div>

  </div>
  `;
}

function agents() {
  $("#content").innerHTML = `
  <div class="grid">
    ${db.users.map(
      u => `
      <div class="agent-card">
        ${img(u.photo, u.nom)}
        <h3>${u.nom}</h3>
        <p>${u.role}</p>
        <small>${u.email}</small>
      </div>
    `
    ).join("")}
  </div>
  `;
}

function events() {
  $("#content").innerHTML = `
  <div class="table">
    <h2>Événements</h2>

    <table>
      <tr>
        <th>Titre</th>
        <th>Lieu</th>
        <th>Date</th>
      </tr>

      <tr>
        <td>Défilé Mode</td>
        <td>Dakar</td>
        <td>15 Juin</td>
      </tr>

      <tr>
        <td>Salon Premium</td>
        <td>Radisson</td>
        <td>22 Juin</td>
      </tr>
    </table>
  </div>
  `;
}

function wardrobe() {
  $("#content").innerHTML = `
  <div class="table">
    <h2>Garde-robe</h2>

    <table>
      <tr>
        <th>Tenue</th>
        <th>Taille</th>
        <th>Stock</th>
      </tr>

      <tr>
        <td>Robe Hôtesse</td>
        <td>M</td>
        <td>12</td>
      </tr>

      <tr>
        <td>Costume Event</td>
        <td>L</td>
        <td>7</td>
      </tr>
    </table>
  </div>
  `;
}

app();
