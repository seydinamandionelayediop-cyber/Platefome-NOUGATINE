const supabaseClient = supabase.createClient(
  "https://rjnuoslhxwawiyvvtjlc.supabase.co",
  "TON_ANON_KEY_ICI"
);

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const KEY = "nougatine_dark_v2";

const icons = {
  dashboard: "📊",
  users: "👥",
  events: "📅",
  wardrobe: "🧥",
  logout: "🚪"
};

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
      },
      {
        id: "u4",
        nom: "Garde Robe",
        email: "garde@nougatine.sn",
        password: "garde123",
        role: "garde_robe",
        phone: "",
        photo: ""
      }
    ],

    events: [
      {
        id: "e1",
        titre: "Salon Premium Dakar",
        lieu: "King Fahd Palace",
        date: "2026-06-15",
        status: "Confirmé"
      },
      {
        id: "e2",
        titre: "Forum Business",
        lieu: "CICAD",
        date: "2026-06-18",
        status: "En attente"
      }
    ],

    wardrobe: [
      {
        id: "w1",
        nom: "Tenue Hôtesse Noir",
        stock: 12
      },
      {
        id: "w2",
        nom: "Costume Premium",
        stock: 5
      }
    ],

    current: null
  };
}

let db = JSON.parse(localStorage.getItem(KEY) || "null") || seed();

const save = () => {
  localStorage.setItem(KEY, JSON.stringify(db));
};

function toast(text) {
  const x = document.createElement("div");
  x.className = "toast";
  x.textContent = text;
  document.body.appendChild(x);

  setTimeout(() => x.remove(), 2500);
}

function avatar(photo, nom = "N") {
  return photo
    ? `<img class="avatar" src="${photo}" alt="">`
    : `<div class="avatar">${nom[0]}</div>`;
}

function app() {
  db.current ? renderShell() : renderLogin();
}

function renderLogin() {
  $("#app").innerHTML = `
    <div class="login">

      <div class="login-left">
        <img class="login-bg-logo" src="logo.png">

        <h1>
          Plateforme interne
          Nougatine Accueil
        </h1>

        <p>
          Gestion premium des agents,
          responsables, évènements,
          convocations et garde-robe.
        </p>

        <div class="tags">
          <span>Dark mode</span>
          <span>Photos agents</span>
          <span>GitHub / Vercel</span>
        </div>

        <div class="demo">
          Comptes test :
          <br><br>

          <b>admin@nougatine.sn</b> / admin123
          <br>

          <b>resp@nougatine.sn</b> / resp123
          <br>

          <b>agent@nougatine.sn</b> / agent123
          <br>

          <b>garde@nougatine.sn</b> / garde123
        </div>
      </div>

      <div class="login-card">

        <div class="tabs">
          <button class="tab active">Connexion</button>
        </div>

        <h2>Connexion</h2>

        <label>Email</label>
        <input id="email" value="admin@nougatine.sn">

        <label>Mot de passe</label>
        <input id="pass" type="password" value="admin123">

        <button class="primary" onclick="login()">
          Se connecter
        </button>

      </div>

    </div>
  `;
}

function login() {
  const email = $("#email").value.trim();
  const pass = $("#pass").value.trim();

  const user = db.users.find(
    x => x.email === email && x.password === pass
  );

  if (!user) {
    toast("Identifiants incorrects");
    return;
  }

  db.current = user.id;
  save();

  renderShell();
}

function logout() {
  db.current = null;
  save();
  renderLogin();
}

const me = () => db.users.find(x => x.id === db.current);

function renderShell(page = "dashboard") {

  const user = me();

  $("#app").innerHTML = `
    <div class="shell">

      <aside class="sidebar">

        <div class="brand">
          <img src="logo.png">
          <div>
            <h3>Nougatine</h3>
            <small>${user.role}</small>
          </div>
        </div>

        <nav class="nav">

          <button data-page="dashboard">
            ${icons.dashboard}
            Tableau de bord
          </button>

          <button data-page="users">
            ${icons.users}
            Agents
          </button>

          <button data-page="events">
            ${icons.events}
            Évènements
          </button>

          <button data-page="wardrobe">
            ${icons.wardrobe}
            Garde robe
          </button>

          <button onclick="logout()">
            ${icons.logout}
            Déconnexion
          </button>

        </nav>

      </aside>

      <main class="content">

        <div class="topbar">

          <div>
            <h1 id="pageTitle"></h1>
          </div>

          <div class="top-user">
            ${avatar(user.photo, user.nom)}
            <span>${user.nom}</span>
          </div>

        </div>

        <div id="page"></div>

      </main>

    </div>
  `;

  $$(".nav button[data-page]").forEach(btn => {
    btn.onclick = () => renderShell(btn.dataset.page);
  });

  renderPage(page);
}

function renderPage(page) {

  $("#pageTitle").textContent = pageLabel(page);

  if (page === "dashboard") dashboardPage();
  if (page === "users") usersPage();
  if (page === "events") eventsPage();
  if (page === "wardrobe") wardrobePage();
}

function pageLabel(page) {

  return {
    dashboard: "Tableau de bord",
    users: "Gestion des agents",
    events: "Évènements",
    wardrobe: "Garde robe"
  }[page];
}

function dashboardPage() {

  $("#page").innerHTML = `
    <div class="stats">

      <div class="card stat">
        <h3>${db.users.length}</h3>
        <p>Agents & utilisateurs</p>
      </div>

      <div class="card stat">
        <h3>${db.events.length}</h3>
        <p>Évènements</p>
      </div>

      <div class="card stat">
        <h3>${db.wardrobe.length}</h3>
        <p>Articles garde robe</p>
      </div>

    </div>

    <div class="card">
      <h2>Bienvenue sur Nougatine Accueil</h2>

      <p>
        Plateforme interne premium pour la gestion
        des agents événementiels.
      </p>
    </div>
  `;
}

function usersPage() {

  $("#page").innerHTML = `
    <div class="grid">

      ${db.users.map(u => `
        <div class="card user-card">

          ${avatar(u.photo, u.nom)}

          <h3>${u.nom}</h3>

          <p>${u.role}</p>

          <small>${u.email}</small>

        </div>
      `).join("")}

    </div>
  `;
}

function eventsPage() {

  $("#page").innerHTML = `
    <div class="card">

      <table>

        <thead>
          <tr>
            <th>Évènement</th>
            <th>Lieu</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>

          ${db.events.map(e => `
            <tr>
              <td>${e.titre}</td>
              <td>${e.lieu}</td>
              <td>${e.date}</td>
              <td>${e.status}</td>
            </tr>
          `).join("")}

        </tbody>

      </table>

    </div>
  `;
}

function wardrobePage() {

  $("#page").innerHTML = `
    <div class="grid">

      ${db.wardrobe.map(w => `
        <div class="card">

          <h3>${w.nom}</h3>

          <p>
            Stock :
            <b>${w.stock}</b>
          </p>

        </div>
      `).join("")}

    </div>
  `;
}

app();
