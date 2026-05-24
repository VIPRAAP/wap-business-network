/* ============================================================
   WAP COMMON APPLICATION ENGINE (app.js)
============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Setup global elements: Header, Toast Container, Settings Modal, Loading Overlay
  setupGlobalLayout();

  // 2. Track Session & Profile updates
  updateSessionUI();

  // 3. Close loadings with fade transition
  hidePageLoader();
});

// A. Global Layout injection (Header Navigation & Toast Container & Supabase Settings)
function setupGlobalLayout() {
  // Check if we are on a page that needs standard navigation
  const body = document.body;
  const isAuthPage = document.getElementById('authPage') !== null;

  // Insert Toast Container if missing
  if (!document.getElementById('toastContainer')) {
    const toastContainer = document.createElement('div');
    toastContainer.id = 'toastContainer';
    toastContainer.className = 'toast-container-custom';
    body.appendChild(toastContainer);
  }

  // Insert Supabase Settings Modal if missing
  if (!document.getElementById('supabaseSettingsOverlay')) {
    const settingsHtml = `
      <div class="post-modal-overlay" id="supabaseSettingsOverlay">
        <div class="post-modal" style="max-width: 500px;">
          <div class="post-modal-header">
            <div>
              <h6 class="fw-700 mb-0" style="color:var(--navy)"><i class="bi bi-database-fill-gear text-gold"></i> Supabase Connectivity Settings</h6>
              <small style="color:var(--text-light)">Connect your own live backend instantly</small>
            </div>
            <button class="btn-close-custom" onclick="toggleSettingsModal(false)"><i class="bi bi-x-lg"></i></button>
          </div>
          <div class="post-modal-body">
            <div class="mb-3">
              <label class="form-label">Supabase Project URL</label>
              <input type="text" class="form-control" id="settingsSupaUrl" placeholder="https://your-project.supabase.co" />
            </div>
            <div class="mb-4">
              <label class="form-label">Supabase Anon API Key</label>
              <input type="password" class="form-control" id="settingsSupaKey" placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." />
            </div>
            <div class="alert alert-warning" style="font-size: 12px; background: rgba(201,168,76,0.15); border: 1px solid var(--gold); color: var(--navy);">
              <i class="bi bi-info-circle-fill text-gold"></i> Make sure to execute the queries in <strong>SQL_SETUP.md</strong> in your Supabase SQL Editor to initialize all tables!
            </div>
            <div class="d-flex justify-content-end gap-2">
              <button class="btn-price-cta btn-price-cta-navy" style="width:auto; padding:10px 20px;" onclick="toggleSettingsModal(false)">Cancel</button>
              <button class="btn-price-cta btn-price-cta-gold" style="width:auto; padding:10px 24px;" onclick="saveSettings()">Save & Connect</button>
            </div>
          </div>
        </div>
      </div>
    `;
    body.insertAdjacentHTML('beforeend', settingsHtml);
  }

  // Inject main nav if not present
  if (!document.getElementById('mainNav') && !isAuthPage) {
    const isLanding = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/');
    const userSession = JSON.parse(localStorage.getItem('wap_session_user'));

    let navHtml = '';

    if (userSession) {
      // LOGGED IN NAVBAR
      navHtml = `
        <nav id="mainNav">
          <div class="container">
            <div class="d-flex align-items-center justify-content-between">
              <a href="dashboard.html" class="navbar-brand">
                <div class="brand-logo">WAP</div>
                <div class="brand-text">
                  <span>WAP</span>
                  <span>We Are Professionals</span>
                </div>
              </a>
              <div class="d-flex gap-2 align-items-center">
                <a href="dashboard.html" class="auth-nav-item ${isActiveTab('dashboard.html')}" title="Dashboard Feed"><i class="bi bi-blockquote-left"></i> <span class="d-none d-md-inline">Feed</span></a>
                <a href="members.html" class="auth-nav-item ${isActiveTab('members.html')}" title="Members Directory"><i class="bi bi-people-fill"></i> <span class="d-none d-md-inline">Members</span></a>
                <a href="events.html" class="auth-nav-item ${isActiveTab('events.html')}" title="Events & RSVPs"><i class="bi bi-calendar-event-fill"></i> <span class="d-none d-md-inline">Events</span></a>
                <button class="settings-gear-btn ms-2" onclick="toggleSettingsModal(true)" title="Supabase Database Settings"><i class="bi bi-gear-fill"></i></button>
                <a href="profile.html?id=${userSession.id}" class="user-avatar-sm ms-2" id="navUserAvatar" title="My Profile">${userSession.full_name.charAt(0)}</a>
                <button class="nav-btn nav-btn-outline ms-2 d-none d-sm-inline-flex" onclick="logoutUser()">Sign Out</button>
              </div>
            </div>
          </div>
        </nav>
      `;
    } else {
      // LOGGED OUT NAVBAR
      navHtml = `
        <nav id="mainNav">
          <div class="container">
            <div class="d-flex align-items-center justify-content-between">
              <a href="index.html" class="navbar-brand">
                <div class="brand-logo">WAP</div>
                <div class="brand-text">
                  <span>WAP</span>
                  <span>We Are Professionals</span>
                </div>
              </a>
              <div class="d-flex gap-2 align-items-center">
                <a href="index.html#features" class="auth-nav-item d-none d-md-inline-flex">Features</a>
                <a href="index.html#how" class="auth-nav-item d-none d-md-inline-flex">How It Works</a>
                <button class="settings-gear-btn" onclick="toggleSettingsModal(true)" title="Supabase Database Settings"><i class="bi bi-gear-fill"></i></button>
                <a href="auth.html?mode=login" class="nav-btn nav-btn-outline ms-2">Sign In</a>
                <a href="auth.html?mode=register" class="nav-btn nav-btn-filled ms-1 d-none d-sm-inline-flex">Join WAP</a>
              </div>
            </div>
          </div>
        </nav>
      `;
    }

    // Insert navbar at the beginning of body
    body.insertAdjacentHTML('afterbegin', navHtml);
  }
}

// B. Check active tab helper
function isActiveTab(pageName) {
  const currentPath = window.location.pathname;
  return currentPath.endsWith(pageName) ? 'active-tab' : '';
}

// C. UI Sessions Syncing
function updateSessionUI() {
  const user = JSON.parse(localStorage.getItem('wap_session_user'));
  if (user) {
    // Populate dynamic avatar visuals on load
    const avatars = document.querySelectorAll('#navUserAvatar');
    avatars.forEach(avatar => {
      avatar.textContent = user.full_name.charAt(0).toUpperCase();
      if (user.avatar_url) {
        avatar.innerHTML = `<img src="${user.avatar_url}" alt="${user.full_name}" />`;
      }
    });
  }
}

// D. Logout System
function logoutUser() {
  localStorage.removeItem('wap_session_user');
  showToast("Logged out successfully!", "success");
  setTimeout(() => {
    window.location.href = "index.html";
  }, 1000);
}

// E. Toggle Settings Modal
function toggleSettingsModal(show) {
  const overlay = document.getElementById('supabaseSettingsOverlay');
  if (overlay) {
    if (show) {
      // Pre-fill inputs with active values
      document.getElementById('settingsSupaUrl').value = localStorage.getItem('wap_supabase_url') || '';
      document.getElementById('settingsSupaKey').value = localStorage.getItem('wap_supabase_key') || '';
      overlay.classList.add('open');
    } else {
      overlay.classList.remove('open');
    }
  }
}

// F. Save Settings
function saveSettings() {
  const url = document.getElementById('settingsSupaUrl').value.trim();
  const key = document.getElementById('settingsSupaKey').value.trim();

  // Save via DB Service
  const res = window.WapDB.saveSupabaseConfig(url, key);
  
  if (res.success) {
    showToast(res.message, "success");
    toggleSettingsModal(false);
    // Reload only if not on the auth page to preserve form field inputs!
    if (!window.location.pathname.endsWith('auth.html')) {
      setTimeout(() => {
        window.location.reload();
      }, 1200);
    }
  } else {
    showToast(res.message, "error");
  }
}

// G. Toast System
function showToast(message, type = "success") {
  const toastContainer = document.getElementById('toastContainer');
  if (!toastContainer) return;

  const toast = document.createElement('div');
  toast.className = `toast-msg ${type}`;
  toast.innerHTML = `
    <i class="bi ${type === 'success' ? 'bi-check-circle-fill text-success' : 'bi-exclamation-triangle-fill text-danger'}"></i>
    <span>${message}</span>
  `;

  toastContainer.appendChild(toast);

  // Auto remove toast
  setTimeout(() => {
    toast.style.animation = "slideIn 0.3s ease reverse forwards";
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3500);
}

// H. Loader Helpers
function showPageLoader() {
  const loader = document.getElementById('loadingOverlay');
  if (loader) {
    loader.classList.remove('hidden');
    loader.style.display = 'flex';
  }
}

function hidePageLoader() {
  const loader = document.getElementById('loadingOverlay');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('hidden');
      setTimeout(() => {
        loader.style.display = 'none';
      }, 300);
    }, 400);
  }
}

// Bind close and settings to window for inline HTML onclick handlers
window.toggleSettingsModal = toggleSettingsModal;
window.saveSettings = saveSettings;
window.logoutUser = logoutUser;
window.showToast = showToast;
window.showPageLoader = showPageLoader;
window.hidePageLoader = hidePageLoader;
