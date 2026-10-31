/* ============================================================
   StudySync – Main Application Logic (GitHub Pages Compatible)
   Admin Account: Priya Singh (admin@studysync.edu / StudySync@Admin2026)
   ============================================================ */

'use strict';

/* --- Credentials & Storage Keys --- */
const ADMIN_EMAIL    = 'admin@studysync.edu';
const ADMIN_PASSWORD = 'StudySync@Admin2026';
const ADMIN_PROFILE  = {
  name: 'Priya Singh',
  email: ADMIN_EMAIL,
  branch: 'Administration',
  year: 'Faculty Lead',
  isAdmin: true
};

const LS_USER      = 'studysync_user';
const LS_REG_USERS = 'studysync_registered_users';
const LS_UPLOADS   = 'studysync_user_uploads';

/* --- Default B.Tech Engineering Notes --- */
const BTECH_NOTES = [
  {
    id: 'note-me-thermo',
    title: 'Thermodynamics – Complete Engineering Notes',
    subject: 'Mechanical Engineering',
    branch: 'ME',
    year: '2nd Year',
    semester: '3rd',
    uploadedBy: ADMIN_EMAIL,
    uploader: 'Priya Singh (Admin)',
    tags: ['thermodynamics', 'rankine-cycle', 'carnot', 'entropy', 'first-law'],
    content: `
      <h2>Engineering Thermodynamics – Comprehensive Module Notes</h2>
      
      <h3>1. Fundamentals & Basic Definitions</h3>
      <p><strong>Thermodynamics</strong> is the physical science that studies energy transfers, work interactions, heat conversions, and the states of matter.</p>
      <ul>
        <li><strong>System:</strong> A defined quantity of matter or region in space chosen for analysis.</li>
        <li><strong>Surroundings:</strong> Everything external to the thermodynamic system.</li>
        <li><strong>Boundary:</strong> The actual or hypothetical envelope that separates system and surroundings.</li>
        <li><strong>Open System (Control Volume):</strong> Both mass and energy cross the boundary (e.g., steam turbines, compressors, nozzles).</li>
        <li><strong>Closed System (Control Mass):</strong> Only energy crosses the boundary; mass remains constant (e.g., sealed piston-cylinder).</li>
        <li><strong>Isolated System:</strong> Neither mass nor energy crosses the boundary (e.g., insulated rigid tank).</li>
      </ul>

      <h3>2. Laws of Thermodynamics</h3>
      <p><strong>Zeroth Law of Thermodynamics:</strong> If bodies A and B are each in thermal equilibrium with a third body C, then A and B are in thermal equilibrium with each other. This law establishes the physical basis for temperature measurement.</p>
      
      <p><strong>First Law of Thermodynamics (Conservation of Energy):</strong> Energy can neither be created nor destroyed, only transformed from one form to another.</p>
      <div class="formula-box">
        For a closed system undergoing a process:
        Q - W = ΔU
        where Q = Net heat supplied, W = Net work done, ΔU = Change in internal energy (m · Cv · ΔT)
      </div>

      <p><strong>Second Law of Thermodynamics:</strong> Spontaneous processes proceed in the direction of increasing entropy. Real conversions of heat into work are limited by thermal reservoir temperatures.</p>
      <ul>
        <li><strong>Kelvin-Planck Statement:</strong> It is impossible for any device operating on a thermodynamic cycle to receive heat from a single thermal reservoir and produce a net equivalent amount of work.</li>
        <li><strong>Clausius Statement:</strong> It is impossible to construct a cyclic device that transfers heat from a lower-temperature body to a higher-temperature body without external work input.</li>
      </ul>

      <p><strong>Third Law of Thermodynamics:</strong> The entropy of a pure crystalline substance approaches absolute zero as the absolute temperature approaches 0 Kelvin.</p>

      <h3>3. Standard Thermodynamic Processes</h3>
      <table>
        <thead>
          <tr>
            <th>Process</th>
            <th>Governing Condition</th>
            <th>Work Done (W)</th>
            <th>Heat Transfer (Q)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Isochoric</strong> (Constant Volume)</td>
            <td>V = Constant, dV = 0</td>
            <td>W = 0</td>
            <td>Q = ΔU = m · Cv · (T2 - T1)</td>
          </tr>
          <tr>
            <td><strong>Isobaric</strong> (Constant Pressure)</td>
            <td>P = Constant, dP = 0</td>
            <td>W = P · (V2 - V1)</td>
            <td>Q = m · Cp · (T2 - T1) = ΔH</td>
          </tr>
          <tr>
            <td><strong>Isothermal</strong> (Constant Temperature)</td>
            <td>T = Constant, ΔU = 0</td>
            <td>W = P1·V1 · ln(V2/V1)</td>
            <td>Q = W</td>
          </tr>
          <tr>
            <td><strong>Adiabatic</strong> (Zero Heat Transfer)</td>
            <td>Q = 0, P·V^γ = Constant</td>
            <td>W = (P1·V1 - P2·V2) / (γ - 1)</td>
            <td>Q = 0</td>
          </tr>
          <tr>
            <td><strong>Polytropic</strong></td>
            <td>P·V^n = Constant</td>
            <td>W = (P1·V1 - P2·V2) / (n - 1)</td>
            <td>Q = W · [(γ - n) / (γ - 1)]</td>
          </tr>
        </tbody>
      </table>

      <h3>4. The Carnot Cycle & Maximum Efficiency</h3>
      <p>The Carnot cycle is the ideal reversible benchmark cycle operating between a high-temperature heat source (TH) and a low-temperature sink (TL).</p>
      <div class="formula-box">
        Carnot Thermal Efficiency (η_carnot) = 1 - (TL / TH)
        (Both TL and TH must be measured in Kelvin)
      </div>
      <ul>
        <li><strong>Process 1-2:</strong> Reversible Isothermal Heat Addition at source temperature TH.</li>
        <li><strong>Process 2-3:</strong> Reversible Adiabatic (Isentropic) Expansion down to sink temperature TL.</li>
        <li><strong>Process 3-4:</strong> Reversible Isothermal Heat Rejection at sink temperature TL.</li>
        <li><strong>Process 4-1:</strong> Reversible Adiabatic (Isentropic) Compression back to initial state.</li>
      </ul>

      <h3>5. The Rankine Cycle (Modern Steam Power Plant Cycle)</h3>
      <p>The Rankine cycle is the primary thermodynamic model for conventional steam power plants and nuclear generating facilities.</p>
      <ul>
        <li><strong>1 to 2 (Feed Pump):</strong> Isentropic compression of saturated liquid water to boiler pressure (Work input Win).</li>
        <li><strong>2 to 3 (Boiler):</strong> Isobaric heat addition where high-pressure water evaporates into superheated steam (Heat input Qin).</li>
        <li><strong>3 to 4 (Turbine):</strong> Isentropic expansion of superheated steam driving generator blades (Work output Wout).</li>
        <li><strong>4 to 1 (Condenser):</strong> Isobaric heat rejection condensing exhaust wet steam into saturated water (Heat rejected Qout).</li>
      </ul>
      <div class="formula-box">
        Rankine Cycle Net Work: W_net = W_turbine - W_pump = (h3 - h4) - (h2 - h1)
        Thermal Efficiency: η_th = W_net / Q_in = [(h3 - h4) - (h2 - h1)] / (h3 - h2)
      </div>

      <h3>6. Entropy & Irreversibility</h3>
      <p>Entropy (S) quantifies the degree of microscopic disorder and irreversibility present in thermodynamic processes.</p>
      <div class="formula-box">
        Clausius Inequality: ∮ (δQ / T) ≤ 0  (= 0 for reversible cycles, &lt; 0 for irreversible cycles)
        Entropy Generation: ΔS_universe = ΔS_system + ΔS_surroundings ≥ 0
      </div>

      <h3>7. Formula Quick-Reference Table</h3>
      <table>
        <thead>
          <tr>
            <th>Physical Quantity</th>
            <th>Engineering Formula</th>
            <th>SI Unit</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Enthalpy (H)</td>
            <td>H = U + P·V</td>
            <td>kJ</td>
          </tr>
          <tr>
            <td>Specific Gas Constant</td>
            <td>R = Cp - Cv  (R_air = 0.287 kJ/kg·K)</td>
            <td>kJ / (kg·K)</td>
          </tr>
          <tr>
            <td>Specific Heat Ratio (γ)</td>
            <td>γ = Cp / Cv  (For diatomic air ≈ 1.4)</td>
            <td>Dimensionless</td>
          </tr>
          <tr>
            <td>COP of Refrigerator</td>
            <td>COP_ref = TL / (TH - TL)</td>
            <td>Dimensionless</td>
          </tr>
          <tr>
            <td>COP of Heat Pump</td>
            <td>COP_hp = TH / (TH - TL) = 1 + COP_ref</td>
            <td>Dimensionless</td>
          </tr>
        </tbody>
      </table>
    `
  },
  {
    id: 'note-ds-101',
    title: 'Data Structures & Algorithms',
    subject: 'Computer Science',
    branch: 'CSE',
    year: '2nd Year',
    semester: '3rd',
    uploadedBy: ADMIN_EMAIL,
    uploader: 'Priya Singh (Admin)',
    tags: ['arrays', 'trees', 'graphs', 'sorting', 'complexity'],
    content: `
      <h2>Data Structures & Algorithms – Complete B.Tech Notes</h2>
      
      <h3>1. Asymptotic Analysis & Time Complexity</h3>
      <p>Algorithms are evaluated based on their growth rate as input size n increases:</p>
      <ul>
        <li><strong>Big-O (O):</strong> Upper bound (Worst-case complexity).</li>
        <li><strong>Omega (Ω):</strong> Lower bound (Best-case complexity).</li>
        <li><strong>Theta (Θ):</strong> Tight bound (Average-case when upper and lower bounds match).</li>
      </ul>

      <h3>2. Linear Data Structures</h3>
      <p><strong>Arrays:</strong> Contiguous memory locations offering O(1) random index access, but O(n) insertion and deletion.</p>
      <p><strong>Linked Lists:</strong> Dynamic non-contiguous nodes containing data and pointers. Singly, doubly, and circular variants.</p>
      <p><strong>Stacks:</strong> LIFO (Last In First Out) principle with O(1) push, pop, and peek.</p>
      <p><strong>Queues:</strong> FIFO (First In First Out) principle with O(1) enqueue and dequeue.</p>

      <h3>3. Non-Linear Data Structures</h3>
      <ul>
        <li><strong>Binary Search Tree (BST):</strong> Left child &lt; Parent &lt; Right child. O(log n) average search and insert.</li>
        <li><strong>AVL Tree:</strong> Self-balancing BST with balance factor (-1, 0, +1) using single and double rotations.</li>
        <li><strong>Heaps:</strong> Complete binary trees used for priority queues. Max-heap: parent ≥ child.</li>
        <li><strong>Graphs:</strong> Represented by adjacency matrices (dense) or adjacency lists (sparse).</li>
      </ul>

      <h3>4. Sorting Algorithms Comparison</h3>
      <table>
        <thead>
          <tr>
            <th>Algorithm</th>
            <th>Best Case</th>
            <th>Average Case</th>
            <th>Worst Case</th>
            <th>Space Complexity</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Quick Sort</td>
            <td>O(n log n)</td>
            <td>O(n log n)</td>
            <td>O(n²)</td>
            <td>O(log n)</td>
          </tr>
          <tr>
            <td>Merge Sort</td>
            <td>O(n log n)</td>
            <td>O(n log n)</td>
            <td>O(n log n)</td>
            <td>O(n)</td>
          </tr>
          <tr>
            <td>Heap Sort</td>
            <td>O(n log n)</td>
            <td>O(n log n)</td>
            <td>O(n log n)</td>
            <td>O(1)</td>
          </tr>
        </tbody>
      </table>
    `
  },
  {
    id: 'note-dbms-201',
    title: 'Database Management Systems',
    subject: 'DBMS',
    branch: 'CSE',
    year: '2nd Year',
    semester: '4th',
    uploadedBy: ADMIN_EMAIL,
    uploader: 'Priya Singh (Admin)',
    tags: ['sql', 'normalization', 'transactions', 'acid'],
    content: `
      <h2>Database Management Systems (DBMS) Notes</h2>
      <h3>1. Database Architecture</h3>
      <p>Three-Schema Architecture provides physical and logical data independence (Internal, Conceptual, External views).</p>
      
      <h3>2. Normalization Forms</h3>
      <ul>
        <li><strong>1NF:</strong> Eliminates repeating groups and enforces atomic attribute values.</li>
        <li><strong>2NF:</strong> 1NF + Eliminates partial dependency on composite primary keys.</li>
        <li><strong>3NF:</strong> 2NF + Eliminates transitive dependency (non-prime to non-prime).</li>
        <li><strong>BCNF:</strong> For every functional dependency X → Y, X must be a super key.</li>
      </ul>

      <h3>3. ACID Properties</h3>
      <div class="formula-box">
        A - Atomicity: Transactions execute completely or abort cleanly.<br>
        C - Consistency: System moves from one valid state to another.<br>
        I - Isolation: Concurrent operations cannot observe intermediate states.<br>
        D - Durability: Committed updates persist through hardware restarts.
      </div>
    `
  },
  {
    id: 'note-ec-signals',
    title: 'Signals & Systems',
    subject: 'Electronics & Communication',
    branch: 'ECE',
    year: '3rd Year',
    semester: '5th',
    uploadedBy: ADMIN_EMAIL,
    uploader: 'Priya Singh (Admin)',
    tags: ['fourier', 'laplace', 'sampling', 'nyquist'],
    content: `
      <h2>Signals & Systems – B.Tech Electronics Notes</h2>
      <h3>1. Signal Classification</h3>
      <p>Continuous-Time (CT) vs Discrete-Time (DT), Deterministic vs Random, Energy vs Power signals.</p>

      <h3>2. Fourier Transform</h3>
      <p>Converts time-domain expressions into continuous frequency-domain spectra.</p>
      <div class="formula-box">
        X(ω) = ∫ [x(t) · e^(-jωt)] dt from -∞ to +∞
      </div>

      <h3>3. Nyquist-Shannon Sampling Theorem</h3>
      <div class="formula-box">
        Sampling Frequency: fs ≥ 2 · f_max
        Aliasing happens when fs &lt; 2 · f_max. Anti-aliasing filters prevent spectral overlap.
      </div>
    `
  },
  {
    id: 'note-maths-engg',
    title: 'Engineering Mathematics (Calculus & Linear Algebra)',
    subject: 'Mathematics',
    branch: 'Common',
    year: '1st Year',
    semester: '1st',
    uploadedBy: ADMIN_EMAIL,
    uploader: 'Priya Singh (Admin)',
    tags: ['matrices', 'calculus', 'eigenvalues', 'differential-equations'],
    content: `
      <h2>Engineering Mathematics Notes</h2>
      <h3>1. Linear Algebra & Matrices</h3>
      <p>Eigenvalues and Eigenvectors: (A - λI)·v = 0. Characteristic polynomial det(A - λI) = 0.</p>
      <p>Cayley-Hamilton Theorem: Every square matrix satisfies its own characteristic equation.</p>

      <h3>2. Multiple Integrals & Vector Calculus</h3>
      <ul>
        <li>Gradient (∇f), Divergence (∇ · V), Curl (∇ × V)</li>
        <li>Green's Theorem, Gauss Divergence Theorem, Stokes' Theorem.</li>
      </ul>
    `
  },
  {
    id: 'note-civ-structural',
    title: 'Structural Analysis & Mechanics of Solids',
    subject: 'Civil Engineering',
    branch: 'CE',
    year: '3rd Year',
    semester: '5th',
    uploadedBy: ADMIN_EMAIL,
    uploader: 'Priya Singh (Admin)',
    tags: ['shear-force', 'bending-moment', 'trusses', 'deflection'],
    content: `
      <h2>Structural Analysis – Civil Engineering Notes</h2>
      <h3>1. Shear Force & Bending Moment Diagrams</h3>
      <p>For a simply supported beam with uniformly distributed load w across length L:</p>
      <div class="formula-box">
        Max Shear Force (at supports) = (w · L) / 2<br>
        Max Bending Moment (at midspan) = (w · L²) / 8
      </div>
      <h3>2. Euler's Buckling Load for Columns</h3>
      <div class="formula-box">
        Critical Buckling Load: P_cr = (π² · E · I) / (L_eff)²
      </div>
    `
  }
];

/* --- Previous Year Questions (PYQs) --- */
const PYQ_DATA = [
  { id: 'pyq-1', title: 'GATE 2024 – Computer Science & IT', year: 2024, branch: 'CSE', questions: 65, duration: '180 Mins', difficulty: 'Advanced' },
  { id: 'pyq-2', title: 'GATE 2023 – Mechanical Engineering (Thermodynamics & Heat Transfer)', year: 2023, branch: 'ME', questions: 65, duration: '180 Mins', difficulty: 'Advanced' },
  { id: 'pyq-3', title: 'AKTU B.Tech Sem 3 – Data Structures & Algorithms', year: 2023, branch: 'CSE', questions: 50, duration: '180 Mins', difficulty: 'Medium' },
  { id: 'pyq-4', title: 'AKTU B.Tech Sem 4 – Thermodynamics & Fluids', year: 2023, branch: 'ME', questions: 50, duration: '180 Mins', difficulty: 'Medium' },
  { id: 'pyq-5', title: 'GATE 2024 – Electronics & Communication', year: 2024, branch: 'ECE', questions: 65, duration: '180 Mins', difficulty: 'Advanced' },
  { id: 'pyq-6', title: 'University B.Tech Sem 1 – Engineering Mathematics', year: 2024, branch: 'Common', questions: 45, duration: '150 Mins', difficulty: 'Standard' }
];

/* --- Mock Test / Quiz Data --- */
const QUIZ_DATA = [
  {
    question: 'What is the theoretical maximum thermal efficiency formula for a Carnot engine operating between TH and TL?',
    options: ['1 - (TH / TL)', '1 - (TL / TH)', '(TH - TL) / TL', 'TL / TH'],
    answer: 1,
    explanation: 'The Carnot efficiency is given by η = 1 - (TL / TH), where temperatures must be in absolute Kelvin.'
  },
  {
    question: 'In the Rankine cycle, where does constant-pressure heat addition take place?',
    options: ['Feed Pump', 'Turbine', 'Boiler', 'Condenser'],
    answer: 2,
    explanation: 'In a Rankine cycle, isobaric heat addition occurs inside the boiler to generate superheated steam.'
  },
  {
    question: 'Which normal form eliminates transitive dependencies where a non-prime attribute depends on another non-prime attribute?',
    options: ['1NF', '2NF', '3NF', 'BCNF'],
    answer: 2,
    explanation: 'Third Normal Form (3NF) requires 2NF plus no transitive functional dependencies for non-key attributes.'
  },
  {
    question: 'What is the worst-case time complexity of standard Quick Sort when bad pivot selection occurs?',
    options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(2^n)'],
    answer: 2,
    explanation: 'When partitions are maximally unbalanced (e.g., sorted array with last element as pivot), Quick Sort degrades to O(n²).'
  },
  {
    question: 'According to the Nyquist-Shannon sampling theorem, what is the minimum sampling frequency fs for a signal with max frequency fm?',
    options: ['fs = fm / 2', 'fs ≥ 2 · fm', 'fs = fm', 'fs ≥ 4 · fm'],
    answer: 1,
    explanation: 'To eliminate aliasing and allow perfect reconstruction, sampling rate fs must be at least twice the maximum frequency (2 · fm).'
  },
  {
    question: 'For an irreversible spontaneous thermodynamic process, what happens to the net entropy of the universe?',
    options: ['Decreases', 'Remains strictly zero', 'Increases', 'FlBloom back to 0 K'],
    answer: 2,
    explanation: 'By the Second Law of Thermodynamics, ΔS_universe > 0 for all irreversible processes.'
  }
];

/* --- Application State --- */
let currentUser    = null;
let currentTab     = 'notes';
let timerInterval  = null;
let timerSeconds   = 25 * 60;
let timerRunning   = false;
let quizIndex      = 0;
let quizScore      = 0;
let quizAnswered   = false;
let noteFilter     = { branch: 'all', search: '' };

/* --- Utility Helper Functions --- */
function $(id) { return document.getElementById(id); }

function toast(msg, type = 'info') {
  const container = $('toastContainer');
  if (!container) return;
  const t = document.createElement('div');
  t.className = `toast ${type} toast-${type}`;
  t.textContent = msg;
  container.appendChild(t);
  setTimeout(() => {
    t.style.opacity = '0';
    setTimeout(() => t.remove(), 250);
  }, 3200);
}

function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getRegisteredUsers() {
  try {
    return JSON.parse(localStorage.getItem(LS_REG_USERS) || '[]');
  } catch {
    return [];
  }
}

function saveRegisteredUsers(arr) {
  localStorage.setItem(LS_REG_USERS, JSON.stringify(arr));
}

function getUserUploads() {
  try {
    return JSON.parse(localStorage.getItem(LS_UPLOADS) || '[]');
  } catch {
    return [];
  }
}

function saveUserUploads(arr) {
  localStorage.setItem(LS_UPLOADS, JSON.stringify(arr));
}

/* --- Authentication Handling --- */
function handleLogin(e) {
  if (e) e.preventDefault();
  const emailInput = $('loginEmail');
  const passwordInput = $('loginPassword');
  const email = emailInput ? emailInput.value.trim() : '';
  const password = passwordInput ? passwordInput.value.trim() : '';

  if (!email || !password) {
    toast('Please enter both email and password.', 'error');
    return;
  }

  // 1. Check for Admin Login (Priya Singh)
  if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
    currentUser = { ...ADMIN_PROFILE };
    localStorage.setItem(LS_USER, JSON.stringify(currentUser));
    toast('Welcome back, Admin Priya Singh! 🎓', 'success');
    showDashboard();
    return;
  }

  // 2. Check registered users in localStorage
  const registeredUsers = getRegisteredUsers();
  const foundUser = registeredUsers.find(
    u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (foundUser) {
    currentUser = {
      name: foundUser.name,
      email: foundUser.email,
      branch: foundUser.branch,
      year: foundUser.year,
      isAdmin: false
    };
    localStorage.setItem(LS_USER, JSON.stringify(currentUser));
    toast(`Welcome, ${foundUser.name}! 📚`, 'success');
    showDashboard();
  } else {
    toast('Invalid email or password. Please register first.', 'error');
    if (passwordInput) passwordInput.value = '';
  }
}

function handleRegister(e) {
  if (e) e.preventDefault();
  const name     = $('regName')     ? $('regName').value.trim()     : '';
  const email    = $('regEmail')    ? $('regEmail').value.trim()    : '';
  const branch   = $('regBranch')   ? $('regBranch').value          : '';
  const year     = $('regYear')     ? $('regYear').value            : '';
  const password = $('regPassword') ? $('regPassword').value.trim() : '';
  const confirm  = $('regConfirm')  ? $('regConfirm').value.trim()  : '';

  if (!name || !email || !branch || !year || !password) {
    toast('All registration fields are required.', 'error');
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    toast('Please provide a valid email format.', 'error');
    return;
  }

  if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
    toast('This email address is reserved for system administration.', 'error');
    return;
  }

  if (password.length < 6) {
    toast('Password must contain at least 6 characters.', 'error');
    return;
  }

  if (password !== confirm) {
    toast('Passwords do not match. Please verify.', 'error');
    return;
  }

  const registeredUsers = getRegisteredUsers();
  if (registeredUsers.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    toast('This email is already registered. Please sign in.', 'error');
    switchAuthTab('login');
    return;
  }

  const newUser = {
    name,
    email,
    branch,
    year,
    password,
    joinDate: new Date().toISOString(),
    uploadCount: 0
  };

  registeredUsers.push(newUser);
  saveRegisteredUsers(registeredUsers);

  // Set active session for the newly registered student
  currentUser = {
    name: newUser.name,
    email: newUser.email,
    branch: newUser.branch,
    year: newUser.year,
    isAdmin: false
  };
  localStorage.setItem(LS_USER, JSON.stringify(currentUser));

  toast(`Registration successful! Welcome, ${name} 🎉`, 'success');
  showDashboard();
}

function logout() {
  currentUser = null;
  localStorage.removeItem(LS_USER);
  if (timerRunning) {
    clearInterval(timerInterval);
    timerRunning = false;
  }
  showHome();
  toast('Signed out successfully.', 'info');
}

/* --- Section Navigation --- */
function hideAllMainViews() {
  const sections = ['heroSection', 'statsSection', 'authSection', 'dashSection'];
  sections.forEach(s => {
    const el = $(s);
    if (el) el.classList.add('hidden');
  });
}

function showHome() {
  hideAllMainViews();
  const hero = $('heroSection');
  const stats = $('statsSection');
  if (hero) hero.classList.remove('hidden');
  if (stats) stats.classList.remove('hidden');
  updateNavbar();
}

function showAuth(tab = 'login') {
  hideAllMainViews();
  const auth = $('authSection');
  if (auth) auth.classList.remove('hidden');
  switchAuthTab(tab);
  updateNavbar();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showDashboard(tab = 'notes') {
  hideAllMainViews();
  const dash = $('dashSection');
  if (dash) dash.classList.remove('hidden');
  updateNavbar();
  updateDashHeader();
  switchDashTab(tab);
}

function switchAuthTab(tab) {
  const loginForm = $('loginForm');
  const regForm   = $('registerForm');
  const loginTab  = $('loginTab');
  const regTab    = $('registerTab');

  if (tab === 'login') {
    if (loginForm) loginForm.classList.remove('hidden');
    if (regForm)   regForm.classList.add('hidden');
    if (loginTab)  loginTab.classList.add('active');
    if (regTab)    regTab.classList.remove('active');
  } else {
    if (loginForm) loginForm.classList.add('hidden');
    if (regForm)   regForm.classList.remove('hidden');
    if (loginTab)  loginTab.classList.remove('active');
    if (regTab)    regTab.classList.add('active');
  }
}

function updateNavbar() {
  const isLogged = !!currentUser;
  const guestNav = $('guestNav');
  const userNav = $('userNav');
  const adminNavLink = $('adminNavLink');
  const adminNavPill = $('adminNavPill');
  const adminDashTab = $('adminDashTab');

  if (guestNav) guestNav.classList.toggle('hidden', isLogged);
  if (userNav)  userNav.classList.toggle('hidden', !isLogged);

  if (isLogged && currentUser) {
    const initials = currentUser.name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const avatar = $('navAvatar');
    const userName = $('navUserName');
    if (avatar) avatar.textContent = initials || 'ST';
    if (userName) userName.textContent = currentUser.name;

    const isAdmin = !!currentUser.isAdmin;
    if (adminNavLink) adminNavLink.classList.toggle('hidden', !isAdmin);
    if (adminNavPill) adminNavPill.classList.toggle('hidden', !isAdmin);
    if (adminDashTab) adminDashTab.classList.toggle('hidden', !isAdmin);
  } else {
    if (adminNavLink) adminNavLink.classList.add('hidden');
    if (adminNavPill) adminNavPill.classList.add('hidden');
    if (adminDashTab) adminDashTab.classList.add('hidden');
  }
}

function updateDashHeader() {
  if (!currentUser) return;
  const greeting = $('dashGreeting');
  const subline = $('dashSubline');

  if (greeting) {
    greeting.textContent = currentUser.isAdmin
      ? 'Welcome, Admin Priya Singh 🎓'
      : `Welcome back, ${currentUser.name} 📚`;
  }
  if (subline) {
    subline.textContent = currentUser.isAdmin
      ? 'Administration Center: Manage platform notes, monitor registered students, and review uploads.'
      : `${currentUser.branch} Department • Year ${currentUser.year} • Access semester notes, PYQs, and focus timer.`;
  }
}

function switchDashTab(tabName) {
  currentTab = tabName;
  const tabs = document.querySelectorAll('.dash-tab');
  const panels = document.querySelectorAll('.dash-panel');

  tabs.forEach(t => t.classList.toggle('active', t.getAttribute('data-tab') === tabName));
  panels.forEach(p => p.classList.toggle('hidden', p.getAttribute('data-panel') !== tabName));

  if (tabName === 'notes') renderNotes();
  else if (tabName === 'pyqs') renderPYQs();
  else if (tabName === 'quiz') renderQuiz();
  else if (tabName === 'timer') renderTimer();
  else if (tabName === 'upload') renderUpload();
  else if (tabName === 'myuploads') renderMyUploads();
  else if (tabName === 'admin') renderAdminPanel();
}

/* --- Quick Ribbon Navigation --- */
function ribbonNav(tabName) {
  if (!currentUser) {
    toast('Please log in or create an account to access study modules.', 'info');
    showAuth('login');
    return;
  }
  showDashboard(tabName);
}

/* --- Notes Module --- */
function renderNotes() {
  const panel = $('notesPanel');
  if (!panel) return;

  const userUploads = getUserUploads();
  const allNotes = [...BTECH_NOTES, ...userUploads];

  const filtered = allNotes.filter(n => {
    const matchBranch = noteFilter.branch === 'all' || n.branch === noteFilter.branch;
    const q = noteFilter.search.toLowerCase();
    const matchQuery = !q ||
      n.title.toLowerCase().includes(q) ||
      (n.subject && n.subject.toLowerCase().includes(q)) ||
      (n.tags && n.tags.some(t => t.toLowerCase().includes(q)));
    return matchBranch && matchQuery;
  });

  const toolbarHTML = `
    <div class="notes-toolbar">
      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input class="form-control" id="noteSearch" placeholder="Search topics, subjects, or keywords (e.g. Thermodynamics, Rankine, SQL)..." value="${escapeHTML(noteFilter.search)}" oninput="onNoteSearch(this.value)">
      </div>
      <select class="form-control" style="width: auto; min-width: 140px;" onchange="onBranchFilter(this.value)">
        <option value="all" ${noteFilter.branch === 'all' ? 'selected' : ''}>All Branches</option>
        <option value="CSE" ${noteFilter.branch === 'CSE' ? 'selected' : ''}>CSE</option>
        <option value="ME" ${noteFilter.branch === 'ME' ? 'selected' : ''}>Mechanical (ME)</option>
        <option value="ECE" ${noteFilter.branch === 'ECE' ? 'selected' : ''}>Electronics (ECE)</option>
        <option value="CE" ${noteFilter.branch === 'CE' ? 'selected' : ''}>Civil (CE)</option>
        <option value="Common" ${noteFilter.branch === 'Common' ? 'selected' : ''}>1st Year Common</option>
      </select>
      <span class="text-muted" style="font-weight: 500;">${filtered.length} notes available</span>
    </div>
  `;

  if (filtered.length === 0) {
    panel.innerHTML = toolbarHTML + `
      <div class="text-center card" style="padding: 3rem 1.5rem; margin-top: 1rem;">
        <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">📄</div>
        <h4>No notes found matching your criteria</h4>
        <p class="text-muted" style="margin-bottom: 1rem;">Try another keyword or contribute notes for your semester.</p>
        <button class="btn btn-primary" onclick="switchDashTab('upload')">Upload Notes</button>
      </div>
    `;
    return;
  }

  const cardsHTML = filtered.map(n => {
    const isOwner = currentUser && (currentUser.email === n.uploadedBy || (currentUser.isAdmin && n.uploadedBy === ADMIN_EMAIL));
    return `
      <div class="note-card">
        <div>
          <span class="badge badge-blue">${escapeHTML(n.branch)}</span>
          <span class="badge badge-purple" style="margin-left: 0.35rem;">Sem ${escapeHTML(n.semester || '–')}</span>
          ${isOwner ? '<span class="badge badge-green" style="margin-left: 0.35rem;">My Note</span>' : ''}
        </div>
        <div class="note-title">${escapeHTML(n.title)}</div>
        <div class="note-meta">
          <span>📖 ${escapeHTML(n.subject)}</span>
          <span>🎓 ${escapeHTML(n.year)}</span>
          <span>👤 ${escapeHTML(n.uploader || 'Student')}</span>
        </div>
        <div class="note-preview">
          ${(n.tags || []).map(t => '#' + escapeHTML(t)).join(' ')}
        </div>
        <div class="note-actions">
          <button class="btn btn-primary btn-sm" onclick="openNoteReader('${n.id}')">📄 View Notes</button>
          <button class="btn btn-secondary btn-sm" onclick="bookmarkNote('${n.id}')">🔖 Bookmark</button>
        </div>
      </div>
    `;
  }).join('');

  panel.innerHTML = toolbarHTML + `<div class="notes-grid">${cardsHTML}</div>`;
}

function onNoteSearch(val) {
  noteFilter.search = val;
  renderNotes();
}

function onBranchFilter(val) {
  noteFilter.branch = val;
  renderNotes();
}

/* --- Note Reader Modal (Fixed Glitch & Clean Presentation) --- */
function openNoteReader(noteId) {
  const allNotes = [...BTECH_NOTES, ...getUserUploads()];
  const note = allNotes.find(n => n.id === noteId);
  if (!note) {
    toast('Note could not be located.', 'error');
    return;
  }

  // Remove existing modal if any
  const existingModal = $('readerModal');
  if (existingModal) existingModal.remove();

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'readerModal';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');

  overlay.innerHTML = `
    <div class="modal-box">
      <div class="modal-header">
        <div>
          <div class="modal-title">${escapeHTML(note.title)}</div>
          <div class="text-muted" style="margin-top: 0.25rem; font-size: 0.85rem;">
            ${escapeHTML(note.subject)} • ${escapeHTML(note.branch)} (${escapeHTML(note.year)}) • Uploaded by ${escapeHTML(note.uploader || 'Student')}
          </div>
        </div>
        <button class="modal-close" onclick="closeNoteReader()" title="Close viewer">✕</button>
      </div>
      <div class="modal-body">
        <div class="note-content-area">
          ${note.content || '<p class="text-muted">Content for this module is being updated.</p>'}
        </div>
      </div>
    </div>
  `;

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeNoteReader();
  });

  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';
}

function closeNoteReader() {
  const modal = $('readerModal');
  if (modal) modal.remove();
  document.body.style.overflow = '';
}

function bookmarkNote(id) {
  toast('Note saved to your bookmarks! 🔖', 'success');
}

/* --- Previous Year Questions (PYQs) --- */
function renderPYQs() {
  const panel = $('pyqsPanel');
  if (!panel) return;

  const cards = PYQ_DATA.map(p => `
    <div class="pyq-card">
      <div class="flex gap-2" style="margin-bottom: 0.75rem; flex-wrap: wrap;">
        <span class="badge badge-green">${p.year}</span>
        <span class="badge badge-blue">${escapeHTML(p.branch)}</span>
        <span class="badge badge-orange">${escapeHTML(p.difficulty)}</span>
      </div>
      <div class="note-title" style="margin-bottom: 0.5rem;">${escapeHTML(p.title)}</div>
      <div class="note-meta">
        <span>📝 ${p.questions} Questions</span>
        <span>⏱ ${escapeHTML(p.duration)}</span>
      </div>
      <div class="note-actions" style="margin-top: 1rem;">
        <button class="btn btn-primary btn-sm" onclick="toast('Loading official university question sheet… 📄', 'info')">📄 Open Paper</button>
        <button class="btn btn-secondary btn-sm" onclick="toast('Starting download for ${escapeHTML(p.title)}… ⬇️', 'info')">⬇️ Download PDF</button>
      </div>
    </div>
  `).join('');

  panel.innerHTML = `
    <div style="margin-bottom: 1.25rem;">
      <h3 style="font-size: 1.25rem; margin-bottom: 0.25rem;">University PYQ Archive</h3>
      <p class="text-muted">Official semester and GATE entrance papers with solution outlines.</p>
    </div>
    <div class="pyq-grid">${cards}</div>
  `;
}

/* --- Mock Test / Quiz Engine --- */
function renderQuiz() {
  const panel = $('quizPanel');
  if (!panel) return;
  quizIndex = 0;
  quizScore = 0;
  quizAnswered = false;
  displayQuizCard(panel);
}

function displayQuizCard(panel) {
  if (quizIndex >= QUIZ_DATA.length) {
    const percentage = Math.round((quizScore / QUIZ_DATA.length) * 100);
    panel.innerHTML = `
      <div class="quiz-card text-center">
        <div style="font-size: 3rem; margin-bottom: 0.75rem;">${percentage >= 60 ? '🏆' : '📖'}</div>
        <h3>Engineering Mock Test Completed</h3>
        <div style="font-size: 2.2rem; font-weight: 800; color: var(--primary); margin: 0.75rem 0;">
          ${quizScore} / ${QUIZ_DATA.length}
        </div>
        <p class="text-muted">You achieved a score of ${percentage}%. ${percentage >= 75 ? 'Outstanding preparation!' : 'Review the topics and retake the test.'}</p>
        <button class="btn btn-primary mt-4" onclick="renderQuiz()">🔄 Retake Mock Test</button>
      </div>
    `;
    return;
  }

  const q = QUIZ_DATA[quizIndex];
  const progressPercent = Math.round(((quizIndex + 1) / QUIZ_DATA.length) * 100);
  quizAnswered = false;

  panel.innerHTML = `
    <div class="quiz-card">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
        <span class="text-muted" style="font-size: 0.85rem; font-weight: 600;">Question ${quizIndex + 1} of ${QUIZ_DATA.length}</span>
        <span class="badge badge-blue">Score: ${quizScore}</span>
      </div>
      <div class="quiz-progress">
        <div class="quiz-progress-bar" style="width: ${progressPercent}%;"></div>
      </div>
      <div style="font-size: 1.05rem; font-weight: 700; margin-bottom: 1.25rem; line-height: 1.4;">
        ${escapeHTML(q.question)}
      </div>
      <div id="quizOptions">
        ${q.options.map((opt, i) => `
          <div class="quiz-option" onclick="selectQuizAnswer(${i})">${escapeHTML(opt)}</div>
        `).join('')}
      </div>
      <div id="quizExplanation" class="hidden" style="margin-top: 1rem; padding: 0.85rem 1rem; background: #f0fdf4; border-left: 4px solid var(--success); border-radius: 0 8px 8px 0; font-size: 0.9rem; color: #166534;"></div>
      <div style="margin-top: 1.25rem; text-align: right;">
        <button class="btn btn-primary btn-sm" id="nextQuizBtn" style="display: none;" onclick="goToNextQuestion()">Next Question →</button>
      </div>
    </div>
  `;
}

function selectQuizAnswer(index) {
  if (quizAnswered) return;
  quizAnswered = true;
  const q = QUIZ_DATA[quizIndex];
  const options = document.querySelectorAll('.quiz-option');

  options.forEach((opt, idx) => {
    if (idx === q.answer) opt.classList.add('correct');
    if (idx === index && idx !== q.answer) opt.classList.add('wrong');
  });

  if (index === q.answer) {
    quizScore++;
  }

  const expBox = $('quizExplanation');
  if (expBox) {
    expBox.innerHTML = `<strong>Concept Explanation:</strong> ${escapeHTML(q.explanation)}`;
    expBox.classList.remove('hidden');
  }

  const nextBtn = $('nextQuizBtn');
  if (nextBtn) nextBtn.style.display = 'inline-flex';
}

function goToNextQuestion() {
  quizIndex++;
  displayQuizCard($('quizPanel'));
}

/* --- Pomodoro Focus Timer --- */
function renderTimer() {
  const panel = $('timerPanel');
  if (!panel) return;

  panel.innerHTML = `
    <div class="card" style="max-width: 480px; margin: 0 auto; text-align: center;">
      <h3 style="margin-bottom: 0.5rem;">⏱ Study & Focus Timer</h3>
      <p class="text-muted" style="margin-bottom: 1.5rem;">Pomodoro technique for active engineering revision.</p>
      <div class="timer-display" id="timerDisp">${formatTimerString(timerSeconds)}</div>
      
      <div class="timer-presets">
        <button class="preset-btn" onclick="setTimerDuration(25 * 60)">25 Min Focus</button>
        <button class="preset-btn" onclick="setTimerDuration(45 * 60)">45 Min Deep Work</button>
        <button class="preset-btn" onclick="setTimerDuration(60 * 60)">60 Min Session</button>
        <button class="preset-btn" onclick="setTimerDuration(5 * 60)">5 Min Break</button>
      </div>

      <div class="timer-controls">
        <button class="btn btn-primary" id="timerStartBtn" onclick="toggleTimerState()">▶ Start Timer</button>
        <button class="btn btn-secondary" onclick="resetTimerState()">↺ Reset</button>
      </div>
    </div>
  `;
  updateTimerUI();
}

function formatTimerString(totalSec) {
  const mins = Math.floor(totalSec / 60).toString().padStart(2, '0');
  const secs = (totalSec % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
}

function updateTimerUI() {
  const disp = $('timerDisp');
  if (disp) disp.textContent = formatTimerString(timerSeconds);
  const btn = $('timerStartBtn');
  if (btn) btn.textContent = timerRunning ? '⏸ Pause Timer' : '▶ Start Timer';
}

function toggleTimerState() {
  if (timerRunning) {
    clearInterval(timerInterval);
    timerRunning = false;
  } else {
    if (timerSeconds <= 0) timerSeconds = 25 * 60;
    timerRunning = true;
    timerInterval = setInterval(() => {
      timerSeconds--;
      updateTimerUI();
      if (timerSeconds <= 0) {
        clearInterval(timerInterval);
        timerRunning = false;
        updateTimerUI();
        toast('⏰ Session completed! Time for a well-deserved break.', 'success');
      }
    }, 1000);
  }
  updateTimerUI();
}

function setTimerDuration(seconds) {
  clearInterval(timerInterval);
  timerRunning = false;
  timerSeconds = seconds;
  updateTimerUI();
}

function resetTimerState() {
  clearInterval(timerInterval);
  timerRunning = false;
  timerSeconds = 25 * 60;
  updateTimerUI();
}

/* --- Note Upload Form --- */
function renderUpload() {
  const panel = $('uploadPanel');
  if (!panel) return;

  panel.innerHTML = `
    <div class="card" style="max-width: 640px; margin: 0 auto;">
      <h3 style="margin-bottom: 0.25rem;">📤 Contribute Study Notes</h3>
      <p class="text-muted" style="margin-bottom: 1.25rem;">Share your handwritten formulas, unit summaries, or exam notes with peers.</p>
      
      <form id="uploadForm" onsubmit="handleUploadSubmit(event)">
        <div class="form-group">
          <label for="upTitle">Note Title *</label>
          <input class="form-control" id="upTitle" placeholder="e.g. Thermodynamics – Steam Power & Carnot Notes" required>
        </div>

        <div class="form-group">
          <label for="upSubject">Subject / Course Name *</label>
          <input class="form-control" id="upSubject" placeholder="e.g. Applied Thermodynamics / Fluid Mechanics" required>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
          <div class="form-group">
            <label for="upBranch">Engineering Branch *</label>
            <select class="form-control" id="upBranch" required>
              <option value="">Select Branch</option>
              <option value="CSE">Computer Science (CSE)</option>
              <option value="ME">Mechanical Engineering (ME)</option>
              <option value="ECE">Electronics (ECE)</option>
              <option value="CE">Civil Engineering (CE)</option>
              <option value="Common">1st Year Common</option>
            </select>
          </div>
          <div class="form-group">
            <label for="upYear">Academic Year *</label>
            <select class="form-control" id="upYear" required>
              <option value="">Select Year</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
            </select>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
          <div class="form-group">
            <label for="upSem">Semester</label>
            <select class="form-control" id="upSem">
              <option value="">Select Semester</option>
              <option value="1st">1st Semester</option>
              <option value="2nd">2nd Semester</option>
              <option value="3rd">3rd Semester</option>
              <option value="4th">4th Semester</option>
              <option value="5th">5th Semester</option>
              <option value="6th">6th Semester</option>
              <option value="7th">7th Semester</option>
              <option value="8th">8th Semester</option>
            </select>
          </div>
          <div class="form-group">
            <label for="upTags">Search Tags (comma-separated)</label>
            <input class="form-control" id="upTags" placeholder="e.g. rankine, steam, entropy">
          </div>
        </div>

        <div class="form-group">
          <label for="upContent">Note Content *</label>
          <textarea class="form-control" id="upContent" rows="8" placeholder="Type or paste your notes here. You can use standard text or HTML headings (<h3>, <p>, <ul>, <li>, <table>, etc.)" required style="resize: vertical;"></textarea>
        </div>

        <button type="submit" class="btn btn-primary w-full">📤 Publish Note</button>
      </form>
    </div>
  `;
}

function handleUploadSubmit(e) {
  e.preventDefault();
  if (!currentUser) {
    toast('Please log in first to upload notes.', 'error');
    return;
  }

  const title   = $('upTitle')   ? $('upTitle').value.trim()   : '';
  const subject = $('upSubject') ? $('upSubject').value.trim() : '';
  const branch  = $('upBranch')  ? $('upBranch').value        : '';
  const year    = $('upYear')    ? $('upYear').value          : '';
  const sem     = $('upSem')     ? $('upSem').value           : '';
  const tagsRaw = $('upTags')    ? $('upTags').value          : '';
  const content = $('upContent') ? $('upContent').value.trim() : '';

  if (!title || !subject || !branch || !year || !content) {
    toast('Please complete all required fields.', 'error');
    return;
  }

  const tags = tagsRaw
    .split(',')
    .map(t => t.trim().toLowerCase())
    .filter(Boolean);

  const formattedContent = content.startsWith('<')
    ? content
    : content.split('\n\n').map(p => `<p>${escapeHTML(p).replace(/\n/g, '<br>')}</p>`).join('');

  const uploads = getUserUploads();
  const newNote = {
    id: 'upload-' + Date.now(),
    title,
    subject,
    branch,
    year,
    semester: sem,
    tags,
    content: formattedContent,
    uploadedBy: currentUser.email,
    uploader: currentUser.name,
    uploadDate: new Date().toISOString()
  };

  uploads.unshift(newNote);
  saveUserUploads(uploads);

  // Increment upload counter for student record
  const users = getRegisteredUsers();
  const userIdx = users.findIndex(u => u.email.toLowerCase() === currentUser.email.toLowerCase());
  if (userIdx !== -1) {
    users[userIdx].uploadCount = (users[userIdx].uploadCount || 0) + 1;
    saveRegisteredUsers(users);
  }

  toast('Note uploaded successfully! Visible in Notes Hub and My Uploads 🎉', 'success');
  $('uploadForm').reset();
  switchDashTab('myuploads');
}

/* --- My Uploads Section (Where user views their own uploaded notes) --- */
function renderMyUploads() {
  const panel = $('myuploadsPanel');
  if (!panel) return;

  if (!currentUser) {
    panel.innerHTML = '<div class="text-center card" style="padding: 2.5rem;"><p class="text-muted">Please sign in to view your uploaded notes.</p></div>';
    return;
  }

  const allUploads = getUserUploads();
  // Filter notes that belong to current logged-in user
  const myUploadedNotes = allUploads.filter(n => n.uploadedBy.toLowerCase() === currentUser.email.toLowerCase());

  // If user is Admin Priya Singh, also include admin notes
  const adminContributed = currentUser.isAdmin
    ? BTECH_NOTES.filter(n => n.uploadedBy.toLowerCase() === ADMIN_EMAIL.toLowerCase())
    : [];

  const combinedNotes = [...adminContributed, ...myUploadedNotes];

  if (combinedNotes.length === 0) {
    panel.innerHTML = `
      <div class="my-uploads-empty card">
        <div class="empty-icon">📂</div>
        <h3>No Uploads Yet</h3>
        <p class="text-muted">You haven't uploaded any notes yet. Share your study material to help fellow students!</p>
        <button class="btn btn-primary mt-4" onclick="switchDashTab('upload')">📤 Upload Your First Note</button>
      </div>
    `;
    return;
  }

  const cards = combinedNotes.map(n => {
    const isDeletable = n.id.startsWith('upload-');
    return `
      <div class="note-card">
        <div>
          <span class="badge badge-blue">${escapeHTML(n.branch)}</span>
          <span class="badge badge-green" style="margin-left: 0.35rem;">My Upload</span>
        </div>
        <div class="note-title">${escapeHTML(n.title)}</div>
        <div class="note-meta">
          <span>📖 ${escapeHTML(n.subject)}</span>
          <span>🎓 ${escapeHTML(n.year)}</span>
          ${n.uploadDate ? `<span>📅 ${new Date(n.uploadDate).toLocaleDateString()}</span>` : ''}
        </div>
        <div class="note-actions">
          <button class="btn btn-primary btn-sm" onclick="openNoteReader('${n.id}')">📄 Read Note</button>
          ${isDeletable ? `<button class="btn btn-danger btn-sm" onclick="deleteMyUpload('${n.id}')">🗑 Delete</button>` : ''}
        </div>
      </div>
    `;
  }).join('');

  panel.innerHTML = `
    <div style="margin-bottom: 1.25rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
      <div>
        <h3 style="font-size: 1.25rem; margin-bottom: 0.2rem;">My Uploaded Notes</h3>
        <p class="text-muted">Manage the study materials you have shared (${combinedNotes.length} total).</p>
      </div>
      <button class="btn btn-primary btn-sm" onclick="switchDashTab('upload')">📤 Upload New Note</button>
    </div>
    <div class="notes-grid">${cards}</div>
  `;
}

function deleteMyUpload(noteId) {
  if (!confirm('Are you sure you want to remove this uploaded note?')) return;
  const uploads = getUserUploads().filter(n => n.id !== noteId);
  saveUserUploads(uploads);
  toast('Note removed successfully.', 'warn');
  renderMyUploads();
}

/* --- Admin Panel (Exclusive for Admin Priya Singh) --- */
function renderAdminPanel() {
  const panel = $('adminPanel');
  if (!panel) return;

  if (!currentUser || !currentUser.isAdmin) {
    panel.innerHTML = `
      <div class="card text-center" style="padding: 2.5rem;">
        <h3 class="text-danger">Access Restricted</h3>
        <p class="text-muted">Only the Main Administrator (Priya Singh) has access to registered user records.</p>
      </div>
    `;
    return;
  }

  const users = getRegisteredUsers();
  const uploads = getUserUploads();

  const statsHTML = `
    <div class="admin-stats">
      <div class="admin-stat">
        <div class="num">${users.length}</div>
        <div class="lbl">Registered Students</div>
      </div>
      <div class="admin-stat">
        <div class="num">${uploads.length}</div>
        <div class="lbl">Community Uploads</div>
      </div>
      <div class="admin-stat">
        <div class="num">${BTECH_NOTES.length}</div>
        <div class="lbl">Core Admin Modules</div>
      </div>
      <div class="admin-stat">
        <div class="num">${users.length + 1}</div>
        <div class="lbl">Total Active Accounts</div>
      </div>
    </div>
  `;

  const rowsHTML = users.length > 0
    ? users.map((u, i) => `
        <tr>
          <td>${i + 1}</td>
          <td><strong>${escapeHTML(u.name)}</strong></td>
          <td>${escapeHTML(u.email)}</td>
          <td><span class="badge badge-blue">${escapeHTML(u.branch)}</span></td>
          <td>${escapeHTML(u.year)}</td>
          <td>${u.joinDate ? new Date(u.joinDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Recent'}</td>
          <td>${u.uploadCount || 0}</td>
          <td>
            <button class="btn btn-danger btn-sm" onclick="adminRemoveUser('${escapeHTML(u.email)}')">Remove</button>
          </td>
        </tr>
      `).join('')
    : `<tr><td colspan="8" class="text-center text-muted" style="padding: 2rem;">No student registrations yet. When users register, they will appear here.</td></tr>`;

  panel.innerHTML = `
    <div style="margin-bottom: 1.25rem;">
      <h3 style="font-size: 1.25rem; margin-bottom: 0.25rem;">👑 Main Admin Control Center – Priya Singh</h3>
      <p class="text-muted">Full administrative oversight of all registered members and platform resources.</p>
    </div>

    ${statsHTML}

    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
      <h4>Registered User Directory (${users.length})</h4>
      <button class="btn btn-secondary btn-sm" onclick="renderAdminPanel()">🔄 Refresh Table</button>
    </div>

    <div class="data-table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Full Name</th>
            <th>Registered Email</th>
            <th>Branch</th>
            <th>Year</th>
            <th>Date Registered</th>
            <th>Uploads</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHTML}
        </tbody>
      </table>
    </div>
  `;
}

function adminRemoveUser(email) {
  if (!confirm(`Are you sure you want to remove user "${email}" from the system?`)) return;
  const users = getRegisteredUsers().filter(u => u.email.toLowerCase() !== email.toLowerCase());
  saveRegisteredUsers(users);
  toast(`User ${email} removed by Admin Priya Singh.`, 'warn');
  renderAdminPanel();
}

/* --- Initialization --- */
function initializeApp() {
  // Restore logged-in session if present
  try {
    const savedUser = localStorage.getItem(LS_USER);
    if (savedUser) {
      currentUser = JSON.parse(savedUser);
    }
  } catch {
    currentUser = null;
  }

  if (currentUser) {
    showDashboard('notes');
  } else {
    showHome();
  }

  // Keyboard shortcut: Escape key closes active reader modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeNoteReader();
    }
  });
}

document.addEventListener('DOMContentLoaded', initializeApp);
