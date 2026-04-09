/* ═══════════════════════════════════════════════
   NIA GAME — ADMIN BACK-OFFICE  |  shared.js
   Auth, navigation, sidebar, and helpers
   Used by ALL pages
═══════════════════════════════════════════════ */

/* ══════════════════════════════════
   ROLE CONFIGURATION
══════════════════════════════════ */
const ROLE_META = {
  superadmin: { label:'Super Admin', abbr:'SA', cls:'superadmin', email:'superadmin@niagame.com' },
  admin:      { label:'Admin',       abbr:'AD', cls:'admin',      email:'admin@niagame.com' },
  staff:      { label:'Staff',       abbr:'ST', cls:'staff',      email:'staff@niagame.com' },
};

const NAV_LINKS = {
  superadmin: [
    { section: 'Main' },
    { id:'dashboard', href:'dashboard.html', icon:'fa-th-large',    label:'Dashboard' },
    { section: 'Management' },
    { id:'users',     href:'users.html',     icon:'fa-users',       label:'User Management', badge:3 },
    { id:'create-game', href:'create-game.html', icon:'fa-plus-circle', label:'Create Game' },
    { id:'games',     href:'games.html',     icon:'fa-gamepad',     label:'Game Approval',   badge:5 },
    { id:'topics',    href:'topics.html',    icon:'fa-book-open',   label:'Topic Menu' },
    { id:'roles',     href:'roles.html',     icon:'fa-user-shield', label:'Role Management' },
    { section: 'Analytics' },
    { id:'reports',   href:'reports.html',   icon:'fa-chart-bar',   label:'Reports' },
  ],
  admin: [
    { section: 'Main' },
    { id:'dashboard', href:'dashboard.html', icon:'fa-th-large',  label:'Dashboard' },
    { section: 'Management' },
    { id:'users',     href:'users.html',     icon:'fa-users',     label:'User Management', badge:3 },
    { id:'games',       href:'games.html',       icon:'fa-gamepad',     label:'Game Approval',   badge:5 },
    { id:'create-game', href:'create-game.html', icon:'fa-plus-circle', label:'Create Game' },
    { id:'topics',      href:'topics.html',      icon:'fa-book-open',   label:'Topic Menu' },
    { section: 'Analytics' },
    { id:'reports',   href:'reports.html',   icon:'fa-chart-bar', label:'Reports' },
  ],
  staff: [
    { section: 'Main' },
    { id:'dashboard', href:'dashboard.html', icon:'fa-th-large',  label:'Dashboard' },
    { section: 'View Only' },
    { id:'users',     href:'users.html',     icon:'fa-users',     label:'Users' },
    { id:'games',       href:'games.html',       icon:'fa-gamepad',     label:'Games' },
    { id:'create-game', href:'create-game.html', icon:'fa-plus-circle', label:'Create Game' },
    { id:'topics',      href:'topics.html',      icon:'fa-book-open',   label:'Topics' },
    { section: 'Analytics' },
    { id:'reports',   href:'reports.html',   icon:'fa-chart-bar', label:'Reports' },
  ],
};

/* ══════════════════════════════════
   AUTH HELPERS
══════════════════════════════════ */

/** Returns the current session or null */
function getSession() {
  try {
    const raw = sessionStorage.getItem('nia_admin_session');
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

/** Saves a session */
function setSession(role, name, email) {
  sessionStorage.setItem('nia_admin_session', JSON.stringify({ role, name, email }));
}

/** Clears the session and redirects to login */
function doLogout() {
  sessionStorage.removeItem('nia_admin_session');
  window.location.href = 'login.html';
}

/**
 * Call at top of every protected page.
 * Redirects to login.html if not logged in.
 * Returns the session object.
 */
function requireAuth() {
  const session = getSession();
  if (!session) {
    window.location.href = 'login.html';
    return null;
  }
  return session;
}

/* ══════════════════════════════════
   LAYOUT BUILDERS
══════════════════════════════════ */

let _sidebarCollapsed = false;

/**
 * Builds the sidebar nav based on current role.
 * @param {string} currentPageId - e.g. 'dashboard', 'users', etc.
 * @param {string} role
 */
function buildSidebar(currentPageId, role) {
  const nav = document.getElementById('sidebar-nav');
  if (!nav) return;
  nav.innerHTML = '';
  const links = NAV_LINKS[role] || NAV_LINKS.staff;

  links.forEach(item => {
    if (item.section) {
      const s = document.createElement('div');
      s.className = 'nav-section';
      s.textContent = item.section;
      nav.appendChild(s);
    } else {
      const a = document.createElement('a');
      a.className = 'nav-item' + (item.id === currentPageId ? ' active' : '');
      a.href = item.href;
      const badge = item.badge ? `<span class="nav-badge">${item.badge}</span>` : '';
      a.innerHTML = `<i class="fas ${item.icon}"></i><span class="nav-label">${item.label}</span>${badge}`;
      nav.appendChild(a);
    }
  });
}

/**
 * Builds the header user pill and breadcrumb.
 * @param {string} pageLabel - e.g. 'Dashboard', 'User Management'
 * @param {object} session   - from requireAuth()
 */
function buildHeader(pageLabel, session) {
  const m = ROLE_META[session.role];

  const avatar = document.getElementById('header-avatar');
  if (avatar) {
    avatar.textContent = m.abbr;
    avatar.className = 'user-avatar avatar-' + m.cls;
  }
  const uname = document.getElementById('header-name');
  if (uname) uname.textContent = session.name || m.label;

  const urole = document.getElementById('header-role');
  if (urole) urole.textContent = session.email || m.email;

  const badge = document.getElementById('header-badge');
  if (badge) {
    badge.textContent = m.label;
    badge.className = 'role-badge badge-' + m.cls;
  }
  const bc = document.getElementById('breadcrumb-text');
  if (bc) bc.textContent = pageLabel;
}

/** Toggles the sidebar collapsed state */
function toggleSidebar() {
  _sidebarCollapsed = !_sidebarCollapsed;
  document.getElementById('sidebar')?.classList.toggle('collapsed', _sidebarCollapsed);
  document.getElementById('header')?.classList.toggle('collapsed',  _sidebarCollapsed);
  document.getElementById('main')?.classList.toggle('collapsed',    _sidebarCollapsed);
}

/* ══════════════════════════════════
   MODAL HELPERS
══════════════════════════════════ */
function openModal(id)  { document.getElementById(id)?.classList.add('show'); }
function closeModal(id) { document.getElementById(id)?.classList.remove('show'); }

/** Closes a modal when clicking the dark overlay */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) overlay.classList.remove('show');
    });
  });
});

/* ══════════════════════════════════
   PERMISSION HELPERS
══════════════════════════════════ */

/** Returns true if current role can perform the action */
function can(session, action) {
  const perms = {
    superadmin: ['view','approve','create','edit','delete','assign_roles'],
    admin:      ['view','approve','create','edit','delete'],
    staff:      ['view'],
  };
  return (perms[session.role] || []).includes(action);
}

/**
 * Renders a permission notice banner for read-only roles.
 * @param {string} containerId - element id to inject into
 * @param {string} message
 */
function showPermNotice(containerId, message) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = `
    <div class="perm-notice">
      <i class="fas fa-info-circle"></i>
      ${message}
    </div>`;
}

/* ══════════════════════════════════
   SHARED MOCK DATA
══════════════════════════════════ */
const MOCK = {
  users: [
    { id:1, name:'Alice Mwamba',   email:'alice@student.ac.tz',  level:'Advanced',     games:34,  score:87, status:'active',  reg:'2025-01-12' },
    { id:2, name:'Brian Juma',     email:'brian@student.ac.tz',  level:'Intermediate', games:18,  score:72, status:'active',  reg:'2025-02-03' },
    { id:3, name:'Caroline Nkusi', email:'caro@student.ac.tz',   level:'Basic',        games:5,   score:55, status:'pending', reg:'2026-03-20' },
    { id:4, name:'David Osei',     email:'david@student.ac.tz',  level:'Expert',       games:91,  score:94, status:'active',  reg:'2024-11-08' },
    { id:5, name:'Esther Wanjiku', email:'esther@student.ac.tz', level:'Master',       games:143, score:97, status:'active',  reg:'2024-09-15' },
    { id:6, name:'Felix Banda',    email:'felix@student.ac.tz',  level:'Basic',        games:2,   score:41, status:'blocked', reg:'2026-03-28' },
    { id:7, name:'Grace Amara',    email:'grace@student.ac.tz',  level:'Intermediate', games:22,  score:68, status:'active',  reg:'2025-06-14' },
    { id:8, name:'Hassan Mbeki',   email:'hassan@student.ac.tz', level:'Advanced',     games:57,  score:82, status:'pending', reg:'2026-03-10' },
  ],
  staff: [
    { id:1, name:'Dr. Amina Salim',  email:'amina@niagame.com', role:'superadmin', status:'active', last:'2 min ago' },
    { id:2, name:'Mr. Peter Njomo',  email:'peter@niagame.com', role:'admin',      status:'active', last:'1 hour ago' },
    { id:3, name:'Ms. Faith Ochieng',email:'faith@niagame.com', role:'admin',      status:'active', last:'3 hours ago' },
    { id:4, name:'Mr. Kevin Dube',   email:'kevin@niagame.com', role:'staff',      status:'active', last:'Yesterday' },
    { id:5, name:'Ms. Lydia Kamau',  email:'lydia@niagame.com', role:'staff',      status:'active', last:'2 days ago' },
  ],
  games: {
    pending: [
      { id:1, name:'Dynamic Programming Basics', file:'dp-basics.html',       subject:'Algorithms',       level:'Intermediate', author:'Alice Mwamba',  submitted:'2026-03-29', desc:'An interactive quiz covering tabulation vs memoization with real-world examples like Fibonacci and coin change problems.' },
      { id:2, name:'Graph Traversal Advanced',   file:'graph-traversal-adv.html', subject:'Algorithms',   level:'Advanced',     author:'David Osei',    submitted:'2026-03-28', desc:'Deep dive into DFS/BFS applications, topological sort and cycle detection with animated visualizations.' },
      { id:3, name:'Red-Black Tree Operations',  file:'rbt-ops.html',         subject:'Data Structures',  level:'Expert',       author:'Esther Wanjiku',submitted:'2026-03-27', desc:'Step-by-step game for rotations, insertions and deletions in Red-Black Trees with auto-checking.' },
      { id:4, name:'String Matching KMP+',       file:'kmp-plus.html',        subject:'Algorithms',       level:'Advanced',     author:'Brian Juma',    submitted:'2026-03-25', desc:'Extended KMP game covering failure function, pattern matching and Aho-Corasick introduction.' },
      { id:5, name:'Heap Sort Challenge',        file:'heap-sort-chal.html',  subject:'Algorithms',       level:'Basic',        author:'Caroline Nkusi',submitted:'2026-03-24', desc:'Beginner-friendly heap sort game with step-by-step animations and guided challenges.' },
    ],
    approved: [
      { id:6, name:'Binary Search Basics', file:'binary-search-basics.html', subject:'Algorithms',       level:'Basic',        author:'System',        submitted:'2026-01-10', desc:'Core binary search algorithm game with visual feedback.' },
      { id:7, name:'Quick Sort Master',    file:'quick-sort.html',            subject:'Algorithms',       level:'Intermediate', author:'Peter Njomo',   submitted:'2026-01-12', desc:'Quick sort with partition strategies, pivot selection and complexity analysis.' },
    ],
    rejected: [
      { id:8, name:'Test Game Prototype',  file:'test-game.html',             subject:'Data Structures',  level:'Basic',        author:'Felix Banda',   submitted:'2026-03-22', desc:'Incomplete prototype — lacks proper question set and scoring.' },
    ],
  },
  topics: [
    { id:1,  name:'Array Operations',      subject:'Data Structures', level:'basic',        desc:'Indexing, traversal, insertion and deletion.', file:'array-operations.html',        plays:312 },
    { id:2,  name:'Linked List Basics',    subject:'Data Structures', level:'basic',        desc:'Singly and doubly linked lists, pointers.',    file:'linked-list-basics.html',      plays:280 },
    { id:3,  name:'Stack Basics',          subject:'Data Structures', level:'basic',        desc:'LIFO structure, push/pop operations.',          file:'stack-basics.html',            plays:248 },
    { id:4,  name:'Binary Search',         subject:'Algorithms',      level:'basic',        desc:'Divide and conquer search in sorted arrays.',   file:'binary-search-basics.html',    plays:301 },
    { id:5,  name:'Bubble Sort',           subject:'Algorithms',      level:'intermediate', desc:'Comparison and swap based sorting.',            file:'bubble-sort.html',             plays:198 },
    { id:6,  name:'Hash Table',            subject:'Data Structures', level:'intermediate', desc:'Hash functions, collision handling.',           file:'hash-table.html',              plays:176 },
    { id:7,  name:'Binary Tree Traversal', subject:'Data Structures', level:'intermediate', desc:'Inorder, preorder, postorder traversals.',      file:'binary-tree-traversal.html',   plays:154 },
    { id:8,  name:"Dijkstra's Algorithm",  subject:'Algorithms',      level:'advanced',     desc:'Shortest path in weighted graphs.',             file:'dijkstra.html',                plays:112 },
    { id:9,  name:'A* Search',             subject:'Algorithms',      level:'advanced',     desc:'Heuristic-based pathfinding.',                  file:'astar.html',                   plays:98  },
    { id:10, name:'Red-Black Trees',       subject:'Data Structures', level:'expert',       desc:'Self-balancing BST with color properties.',    file:'red-black-tree.html',          plays:67  },
    { id:11, name:'Fibonacci Heap',        subject:'Data Structures', level:'master',       desc:'Advanced heap with amortized analysis.',       file:'fibonacci-heap.html',          plays:34  },
    { id:12, name:'TSP Challenge',         subject:'Algorithms',      level:'master',       desc:'Travelling Salesman Problem approximations.',  file:'tsp.html',                     plays:28  },
  ],
  activities: [
    { icon:'fa-user-plus',   color:'var(--green)',  bg:'rgba(0,230,118,.1)',   msg:'<strong>Caroline Nkusi</strong> registered and is pending approval',        time:'3 minutes ago' },
    { icon:'fa-gamepad',     color:'var(--cyan)',   bg:'rgba(0,212,255,.08)',  msg:'<strong>David Osei</strong> submitted game: <strong>Graph Traversal Adv</strong>', time:'18 minutes ago' },
    { icon:'fa-star',        color:'var(--gold)',   bg:'rgba(240,165,0,.1)',   msg:'<strong>Esther Wanjiku</strong> reached <strong>Master</strong> level',      time:'1 hour ago' },
    { icon:'fa-check-circle',color:'var(--green)',  bg:'rgba(0,230,118,.1)',   msg:'<strong>Peter Njomo</strong> approved game: <strong>Quick Sort Master</strong>', time:'2 hours ago' },
    { icon:'fa-shield-alt',  color:'var(--purple)', bg:'rgba(168,85,247,.1)',  msg:'<strong>Dr. Amina Salim</strong> assigned Staff role to <strong>Lydia Kamau</strong>', time:'5 hours ago' },
    { icon:'fa-ban',         color:'var(--red)',    bg:'rgba(255,77,77,.1)',   msg:'<strong>Felix Banda</strong> was blocked after policy violation',            time:'Yesterday' },
  ],
};