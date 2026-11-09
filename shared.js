/* ============================================================
   BIPE — shared.js
   Bureau Intelligent pour Entrepreneur
   Votre ERP Personnel Simplifié
   Fichier commun chargé par toutes les pages
   Version 1.5 — Ajout credits, lastMonthlyEmail, onboarding
                 + export/import backup complet
                 + bannière mensuelle landing
                 + filtres de dates réutilisables
   ============================================================ */

const BIPE = (function() {

  /* ============================================================
     CONSTANTES OFFICIELLES
     ============================================================ */
  const LOGO = "B!PE";
  const NOM = "Bureau Intelligent pour Entrepreneur";
  const TAGLINE = "Votre ERP Personnel Simplifié";
  const VERSION = "1.5";

  /* ============================================================
     COULEURS PAR GROUPE
     ============================================================ */
  const COULEURS = {
    structure: '#d4af37',   // Or
    g1: '#b19cd9',          // Parme
    g2: '#7cc4e8',          // Bleu ciel
    g3: '#6b9a5a',          // Vert doux
    g4: '#c9a040',          // Ambre
    g5: '#d98ca8',          // Rose doux
    g6: '#8a9bb5',          // Gris-bleu
    g7: '#a78bfa'           // Violet
  };

  /* ============================================================
     CLÉS LOCALSTORAGE
     ============================================================ */
  const KEYS = {
    session: 'bipe_session',
    users: 'bipe_users',
    parametres: 'bipe_parametres',
    ventes: 'bipe_ventes',
    achats: 'bipe_achats',
    clients: 'bipe_clients',
    fournisseurs: 'bipe_fournisseurs',
    stock: 'bipe_stock',
    tresorerie: 'bipe_tresorerie',
    caisse: 'bipe_caisse',
    charges: 'bipe_charges',
    compta: 'bipe_compta',
    banque: 'bipe_banque',
    rh: 'bipe_rh',
    culture: 'bipe_culture',
    planning: 'bipe_planning',
    rappels: 'bipe_rappels',
    objectifs: 'bipe_objectifs',
    campagnes: 'bipe_campagnes',
    prospects: 'bipe_prospects',
    relances: 'bipe_relances',
    devis: 'bipe_devis',
    produits: 'bipe_produits',
    documents: 'bipe_documents',
    lastBackup: 'bipe_last_backup',
    // ⬇ v1.5
    credits: 'bipe_credits',
    lastMonthlyEmail: 'bipe_last_monthly_email',
    onboarding: 'bipe_onboarding'
  };

  /* ============================================================
     STORAGE — Accès simplifié au localStorage
     ============================================================ */
  const storage = {
    get(key, defaut = null) {
      try {
        const raw = localStorage.getItem(key);
        if (!raw) return defaut;
        return JSON.parse(raw);
      } catch (e) {
        console.error('BIPE.storage.get error:', key, e);
        return defaut;
      }
    },
    set(key, val) {
      try {
        localStorage.setItem(key, JSON.stringify(val));
        return true;
      } catch (e) {
        console.error('BIPE.storage.set error:', key, e);
        return false;
      }
    },
    remove(key) {
      try {
        localStorage.removeItem(key);
        return true;
      } catch (e) {
        return false;
      }
    },
    clear() {
      try {
        Object.values(KEYS).forEach(k => localStorage.removeItem(k));
        return true;
      } catch (e) {
        return false;
      }
    }
  };

  /* ============================================================
     SESSION — Gestion utilisateur
     ============================================================ */
  function getUser() {
    const session = storage.get(KEYS.session);
    if (!session || !session.userId) return null;
    return session;
  }

  function isConnected() {
    return getUser() !== null;
  }

  function checkSession(redirectTo = 'f-acces.html') {
    if (!isConnected()) {
      window.location.href = redirectTo;
      return false;
    }
    return true;
  }

  function logout() {
    storage.remove(KEYS.session);
    window.location.href = 'f-acces.html';
  }

  /* ============================================================
     PARAMÈTRES
     ============================================================ */
  function getParams() {
    return storage.get(KEYS.parametres, {}) || {};
  }

  /* ============================================================
     COULEUR PAR GROUPE
     ============================================================ */
  function getCouleur(groupe) {
    return COULEURS[groupe] || COULEURS.structure;
  }

  function setCouleur(groupe) {
    const couleur = getCouleur(groupe);
    document.documentElement.style.setProperty('--groupe-couleur', couleur);
    return couleur;
  }

  /* ============================================================
     FORMATAGE
     ============================================================ */
  function fmt(n) {
    return (Number(n) || 0).toLocaleString('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
  }

  function fmtDate(d) {
    if (!d) return '—';
    const dt = new Date(d);
    if (isNaN(dt)) return d;
    return dt.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  function fmtDateLong(d) {
    if (!d) return '—';
    const dt = new Date(d);
    if (isNaN(dt)) return d;
    return dt.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }

  function esc(s) {
    return String(s || '').replace(/[&<>"']/g, m => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[m]));
  }

  /* ============================================================
     RESPONSIVE FLUIDE — Injecte les règles CSS globales
     ============================================================ */
  function applyResponsive() {
    if (document.getElementById('bipe-responsive')) return;

    const style = document.createElement('style');
    style.id = 'bipe-responsive';
    style.textContent = `
      html {
        -webkit-text-size-adjust: 100%;
        -moz-text-size-adjust: 100%;
        text-size-adjust: 100%;
      }

      body {
        font-size: clamp(16px, 1.1vw + 14px, 20px);
        line-height: 1.6;
        overflow-x: hidden;
      }

      .app,
      .container,
      .wrap {
        width: 100%;
        max-width: min(1100px, 92vw);
        margin: 0 auto;
        padding-left: clamp(16px, 3vw, 32px);
        padding-right: clamp(16px, 3vw, 32px);
      }

      h1 { font-size: clamp(1.5rem, 3vw + 1rem, 2.5rem); }
      h2 { font-size: clamp(1.2rem, 2vw + 0.8rem, 1.8rem); }
      h3 { font-size: clamp(1rem, 1.5vw + 0.8rem, 1.4rem); }

      @media (min-width: 1440px) {
        .app, .container, .wrap {
          max-width: min(1200px, 88vw);
        }
      }

      @media (max-width: 600px) {
        body { font-size: 16px; }
        .app, .container, .wrap {
          padding-left: 16px;
          padding-right: 16px;
        }
      }

      @media (max-width: 380px) {
        body { font-size: 15px; }
      }

      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          transition-duration: 0.01ms !important;
        }
      }

      img, video, svg {
        max-width: 100%;
        height: auto;
      }

      table {
        max-width: 100%;
        overflow-x: auto;
        display: block;
      }
    `;
    document.head.appendChild(style);
  }

  /* ============================================================
     SHEET STYLES — Correctif global pour les bottom sheets
     ============================================================ */
  function applySheetStyles() {
    if (document.getElementById('bipe-sheet-styles')) return;

    const style = document.createElement('style');
    style.id = 'bipe-sheet-styles';
    style.textContent = `
      .bipe-sheet {
        transform: translateY(100%);
        transition: transform .3s cubic-bezier(.32,.72,0,1);
      }
      .bipe-sheet.show {
        transform: translateY(0) !important;
      }
      #bipe-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,.7);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        z-index: 1000;
        opacity: 0;
        pointer-events: none;
        transition: opacity .3s;
      }
      #bipe-overlay.show {
        opacity: 1 !important;
        pointer-events: auto !important;
      }
    `;
    document.head.appendChild(style);
  }

  /* ============================================================
     UI — Toast
     ============================================================ */
  function toast(msg, bad = false) {
    let t = document.getElementById('bipe-toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'bipe-toast';
      t.style.cssText = `
        position:fixed;
        bottom:100px;
        left:50%;
        transform:translateX(-50%) translateY(20px);
        background:linear-gradient(135deg, #0c0c10, #121218);
        color:#f0d060;
        padding:16px 28px;
        border-radius:999px;
        font-family:'Baloo Bhaijaan 2', sans-serif;
        font-size:1.05rem;
        font-weight:700;
        opacity:0;
        transition:.3s;
        pointer-events:none;
        border:2px solid #d4af37;
        box-shadow:0 8px 32px rgba(0,0,0,.8), 0 0 24px rgba(212,175,55,.3);
        z-index:9999;
        white-space:nowrap;
        max-width:calc(100vw - 40px);
        overflow:hidden;
        text-overflow:ellipsis;
      `;
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.style.borderColor = bad ? '#b84040' : '#d4af37';
    t.style.color = bad ? '#e0a0a0' : '#f0d060';
    t.style.opacity = '1';
    t.style.transform = 'translateX(-50%) translateY(0)';
    clearTimeout(t._timeout);
    t._timeout = setTimeout(() => {
      t.style.opacity = '0';
      t.style.transform = 'translateX(-50%) translateY(20px)';
    }, 2400);
  }

  /* ============================================================
     UI — Bottom Sheet
     ============================================================ */
  function ensureOverlay() {
    let overlay = document.getElementById('bipe-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'bipe-overlay';
      overlay.onclick = closeAllSheets;
      document.body.appendChild(overlay);
    }
    return overlay;
  }

  function openSheet(id) {
    applySheetStyles();
    const overlay = ensureOverlay();
    closeAllSheets();
    const sheet = document.getElementById(id);
    if (!sheet) {
      console.warn('BIPE.openSheet: sheet introuvable —', id);
      return;
    }
    overlay.classList.add('show');
    sheet.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function closeAllSheets() {
    const overlay = document.getElementById('bipe-overlay');
    if (overlay) overlay.classList.remove('show');
    document.querySelectorAll('.bipe-sheet').forEach(s => s.classList.remove('show'));
    document.body.style.overflow = '';
  }

  /* ============================================================
     EXPORT — JSON (module simple)
     ============================================================ */
  function exportJSON(module, data) {
    const payload = {
      module: module,
      standard: 'BIPE-v1',
      date: new Date().toISOString(),
      data: data
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `bipe_${module}_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    toast('Export réussi ✅');
  }

  /* ============================================================
     EXPORT — PDF
     ============================================================ */
  function exportPDF(titre, contenuHTML) {
    const params = getParams();
    const date = new Date().toLocaleString('fr-FR', {
      day: '2-digit', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });

    const html = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
      <meta charset="UTF-8">
      <title>${esc(titre)} — B!PE</title>
      <style>
        @page { margin: 20mm; }
        body {
          font-family: 'Georgia', serif;
          color: #1a1a1a;
          line-height: 1.6;
          padding: 40px;
          max-width: 800px;
          margin: 0 auto;
        }
        .header {
          border-bottom: 3px solid #d4af37;
          padding-bottom: 20px;
          margin-bottom: 30px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }
        .header .logo {
          font-size: 2rem;
          font-weight: 700;
          color: #1a1a1a;
          letter-spacing: .05em;
        }
        .header .logo .excl {
          color: #d4af37;
          font-size: 2.6rem;
          vertical-align: middle;
        }
        .header .subtitle {
          font-size: .85rem;
          color: #666;
          margin-top: 4px;
          font-family: Arial, sans-serif;
        }
        .header .date {
          font-size: .85rem;
          color: #666;
          text-align: right;
        }
        .title {
          font-size: 1.6rem;
          color: #4a2c8c;
          margin-bottom: 20px;
          font-weight: 700;
        }
        .contenu {
          font-family: 'Georgia', serif;
          font-size: .95rem;
          line-height: 1.7;
        }
        .footer {
          margin-top: 50px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          text-align: center;
          font-size: .8rem;
          color: #888;
          font-family: Arial, sans-serif;
        }
        .footer .brand {
          color: #d4af37;
          font-weight: 700;
          font-size: 1rem;
        }
      </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo">B<span class="excl">!</span>PE</div>
            <div class="subtitle">Bureau Intelligent pour Entrepreneur</div>
            <div class="subtitle">Votre ERP Personnel Simplifié</div>
          </div>
          <div class="date">${date}</div>
        </div>
        <h1 class="title">${esc(titre)}</h1>
        <div class="contenu">${contenuHTML}</div>
        <div class="footer">
          <div class="brand">B!PE by MCE</div>
          <div>Document généré le ${date}</div>
          <div>${esc(params.nom || '')}</div>
        </div>
      </body>
      </html>
    `;

    const win = window.open('', '_blank');
    if (win) {
      win.document.write(html);
      win.document.close();
      win.focus();
      setTimeout(() => win.print(), 500);
      toast('📄 Fenêtre d\'impression ouverte');
    } else {
      toast('⚠ Popup bloquée — autorise les popups', true);
    }
  }

  /* ============================================================
     NAVIGATION
     ============================================================ */
  function nav() {
    return {
      groupes: [
        { num: '01', ico: '🛒', nom: 'Commercial', url: 'groupe-commercial.html', groupe: 'g1' },
        { num: '02', ico: '💧', nom: 'Flux', url: 'groupe-flux.html', groupe: 'g2' },
        { num: '03', ico: '🎯', nom: 'Pilotage', url: 'groupe-pilotage.html', groupe: 'g3' },
        { num: '04', ico: '📒', nom: 'Comptabilité', url: 'groupe-comptabilite.html', groupe: 'g4' },
        { num: '05', ico: '👥', nom: 'RH & Culture', url: 'groupe-rh-culture.html', groupe: 'g5' },
        { num: '06', ico: '🛡', nom: 'Administration', url: 'groupe-admin.html', groupe: 'g6' },
        { num: '07', ico: '📣', nom: 'Marketing', url: 'groupe-marketing.html', groupe: 'g7' }
      ],
      outils: [
        { ico: '📊', nom: 'Tableau de bord',       url: 'dashboard.html' },
        { ico: '⚙️', nom: 'Paramètres',            url: 'parametres.html' },
        { ico: '💾', nom: 'Sauvegarde',            url: 'sauvegarde.html' },
        { ico: '📖', nom: 'Manuel de procédures',  url: 'manuel.html' },
        { ico: '🩺', nom: 'Diagnostic',            url: 'diagnostic.html' },
        { ico: '🏠', nom: 'Présentation',          url: 'landing.html' }
      ]
    };
  }

  /* ============================================================
     HEADER
     ============================================================ */
  function renderHeader(titre, options = {}) {
    const user = getUser();
    const nom = user ? user.nom : 'Invité';
    const showBack = options.showBack !== false;
    const backUrl = options.backUrl || 'index.html';

    return `
      <div class="header" style="
        position:sticky;top:0;z-index:50;
        background:rgba(0,0,0,.92);
        backdrop-filter:blur(20px);
        border-bottom:1px solid #1f1f1f;
        padding:16px 20px;
        display:flex;align-items:center;gap:16px;
      ">
        ${showBack ? `
          <a href="${backUrl}" style="
            width:48px;height:48px;border-radius:14px;
            background:#141414;border:1px solid #2a2a2a;
            color:#e8c96a;font-size:1.6rem;
            display:flex;align-items:center;justify-content:center;
            cursor:pointer;flex-shrink:0;text-decoration:none;
            transition:transform .15s;
          ">←</a>
        ` : ''}
        <div style="flex:1;min-width:0;">
          <div style="
            font-family:'Fredoka',sans-serif;
            font-size:1.8rem;font-weight:700;
            color:#f0d060;line-height:1.2;
            letter-spacing:.02em;
          ">
            <span style="color:#f5f0e1">B</span><span style="color:#d4af37;font-size:1.3em">!</span><span style="color:#f5f0e1">PE</span>
          </div>
          <div style="
            font-size:.7rem;color:#9a9384;font-weight:600;
            letter-spacing:.14em;text-transform:uppercase;
          ">
            ${esc(titre)}
          </div>
        </div>
        <button onclick="BIPE.openMenu()" style="
          width:48px;height:48px;border-radius:14px;
          background:#141414;border:1px solid #2a2a2a;
          color:#e8c96a;font-size:1.4rem;
          display:flex;align-items:center;justify-content:center;
          cursor:pointer;flex-shrink:0;
        ">⋮</button>
      </div>
    `;
  }

  /* ============================================================
     MENU
     ============================================================ */
  function openMenu() {
    let menu = document.getElementById('bipe-menu-sheet');
    if (!menu) {
      const navData = nav();
      menu = document.createElement('div');
      menu.id = 'bipe-menu-sheet';
      menu.className = 'bipe-sheet';
      menu.style.cssText = `
        position:fixed;left:0;right:0;bottom:0;
        background:#0a0a0a;
        border-radius:24px 24px 0 0;
        border-top:2px solid #5a4a1f;
        z-index:1001;
        max-height:92vh;
        display:flex;flex-direction:column;
        transform:translateY(100%);
        transition:transform .3s cubic-bezier(.32,.72,0,1);
        max-width:720px;margin:0 auto;
      `;
      menu.innerHTML = `
        <div style="width:48px;height:5px;background:#2a2a2a;border-radius:3px;margin:12px auto 8px;flex-shrink:0;"></div>
        <div style="padding:8px 24px 16px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #1f1f1f;">
          <h3 style="font-family:'Fredoka',sans-serif;font-size:1.5rem;color:#e8c96a;font-weight:700;">Menu</h3>
          <button onclick="BIPE.closeAllSheets()" style="
            width:44px;height:44px;border-radius:12px;
            background:#141414;border:1px solid #2a2a2a;
            color:#f5f0e1;font-size:1.4rem;
            display:flex;align-items:center;justify-content:center;
            cursor:pointer;
          ">✕</button>
        </div>
        <div style="padding:24px;overflow-y:auto;flex:1;">
          ${navData.groupes.map(g => `
            <a href="${g.url}" style="
              display:flex;align-items:center;gap:10px;
              width:100%;margin-bottom:12px;padding:0 24px;height:56px;
              border-radius:12px;background:#141414;
              border:2px solid #2a2a2a;color:#f5f0e1;
              font-family:'Baloo Bhaijaan 2',sans-serif;
              font-size:1.05rem;font-weight:600;
              text-decoration:none;
            ">
              <span>${g.ico}</span>
              <span>${g.nom}</span>
            </a>
          `).join('')}
          <div style="height:1px;background:#1f1f1f;margin:16px 0;"></div>
          ${navData.outils.map(o => `
            <a href="${o.url}" style="
              display:flex;align-items:center;gap:10px;
              width:100%;margin-bottom:12px;padding:0 24px;height:56px;
              border-radius:12px;background:#141414;
              border:2px solid #2a2a2a;color:#f5f0e1;
              font-family:'Baloo Bhaijaan 2',sans-serif;
              font-size:1.05rem;font-weight:600;
              text-decoration:none;
            ">
              <span>${o.ico}</span>
              <span>${o.nom}</span>
            </a>
          `).join('')}
          <button onclick="BIPE.logout()" style="
            display:flex;align-items:center;gap:10px;
            width:100%;padding:0 24px;height:56px;
            border-radius:12px;background:#141414;
            border:2px solid #b84040;color:#e0a0a0;
            font-family:'Baloo Bhaijaan 2',sans-serif;
            font-size:1.05rem;font-weight:600;
            cursor:pointer;
          ">
            <span>🚪</span>
            <span>Déconnexion</span>
          </button>
        </div>
      `;
      document.body.appendChild(menu);
      ensureOverlay();
    }

    setTimeout(() => {
      const overlay = document.getElementById('bipe-overlay');
      if (overlay) {
        overlay.classList.add('show');
      }
      menu.classList.add('show');
      document.body.style.overflow = 'hidden';
    }, 10);
  }

  /* ============================================================
     ⬇⬇⬇ v1.5 — SAUVEGARDE COMPLÈTE (export / import) ⬇⬇⬇
     ============================================================ */

  /**
   * Construit l'objet de sauvegarde complet.
   * Exclut les clés techniques de suivi (lastBackup, lastMonthlyEmail)
   * qui n'ont pas vocation à être restaurées (sinon la restauration
   * marquerait un backup vieux de X mois comme tout juste fait).
   */
  function buildBackupPayload() {
    const data = {};
    Object.values(KEYS).forEach(k => {
      // On saute les marqueurs temporels : ils seront régénérés localement
      if (k === KEYS.lastBackup || k === KEYS.lastMonthlyEmail) return;
      const val = localStorage.getItem(k);
      if (val !== null) {
        try { data[k] = JSON.parse(val); }
        catch (e) { data[k] = val; }
      }
    });
    return {
      standard: 'BIPE-backup-v1',
      version: VERSION,
      date: new Date().toISOString(),
      data: data
    };
  }

  /**
   * Télécharge le fichier de sauvegarde complet et met à jour lastBackup.
   * Retourne { ok:true, filename, size } ou { ok:false, error }.
   */
  function exportFullBackup() {
    try {
      const payload = buildBackupPayload();
      const json = JSON.stringify(payload, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const filename = `bipe_sauvegarde_${new Date().toISOString().slice(0, 10)}.json`;
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);

      storage.set(KEYS.lastBackup, new Date().toISOString());
      toast('Sauvegarde exportée ✅');
      return { ok: true, filename, size: blob.size };
    } catch (e) {
      console.error('BIPE.exportFullBackup:', e);
      toast('⚠ Export échoué', true);
      return { ok: false, error: e.message };
    }
  }

  /**
   * Importe une sauvegarde (File object) après confirmation.
   * Retourne une Promise<{ ok, count?, error?, cancelled? }>.
   * ⚠ Écrase TOUTES les données actuelles.
   */
  function importFullBackup(file) {
    return new Promise((resolve) => {
      if (!file) {
        resolve({ ok: false, error: 'Aucun fichier' });
        return;
      }

      const reader = new FileReader();
      reader.onerror = () => resolve({ ok: false, error: 'Lecture du fichier échouée' });
      reader.onload = (ev) => {
        let payload;
        try {
          payload = JSON.parse(ev.target.result);
        } catch (e) {
          resolve({ ok: false, error: 'Fichier JSON invalide' });
          return;
        }

        if (!payload || payload.standard !== 'BIPE-backup-v1' || typeof payload.data !== 'object') {
          resolve({ ok: false, error: 'Format non reconnu (attendu : BIPE-backup-v1)' });
          return;
        }

        const count = Object.keys(payload.data).length;
        const date = payload.date ? new Date(payload.date).toLocaleString('fr-FR') : 'date inconnue';

        const msg =
          `⚠ Restauration d'une sauvegarde\n\n` +
          `Sauvegarde du : ${date}\n` +
          `Contenu : ${count} clé(s)\n\n` +
          `Toutes les données actuelles seront ÉCRASÉES.\n\n` +
          `Confirmer ?`;

        if (!window.confirm(msg)) {
          resolve({ ok: false, cancelled: true });
          return;
        }

        try {
          // On écrase uniquement les clés présentes dans la sauvegarde
          Object.entries(payload.data).forEach(([k, v]) => {
            try { localStorage.setItem(k, JSON.stringify(v)); }
            catch (e) { console.error('import set error:', k, e); }
          });
          storage.set(KEYS.lastBackup, new Date().toISOString());
          toast(`Restauration OK — ${count} clé(s) ✅`);
          resolve({ ok: true, count });
        } catch (e) {
          console.error('BIPE.importFullBackup:', e);
          resolve({ ok: false, error: e.message });
        }
      };
      reader.readAsText(file);
    });
  }

  /* ============================================================
     ⬇⬇⬇ v1.5 — ENVOI MENSUEL PAR MAIL (bannière landing) ⬇⬇⬇
     ============================================================ */

  /**
   * true si la bannière "envoie ta sauvegarde du mois" doit s'afficher.
   * Déclencheur : aucune date lastMonthlyEmail OU date < début du mois courant.
   */
  function checkMonthlyEmail() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const last = storage.get(KEYS.lastMonthlyEmail);
    return !last || last < startOfMonth;
  }

  function markMonthlyEmailSent() {
    storage.set(KEYS.lastMonthlyEmail, new Date().toISOString());
  }

  /**
   * Construit le lien mailto: pour l'envoi mensuel.
   * Retourne { mailto, filename, subject }.
   * Le fichier doit être téléchargé séparément via exportFullBackup().
   */
  function buildMonthlyMailto() {
    const user = getUser();
    const email = (user && user.email) ? user.email : '';
    const params = getParams();
    const nom = params.nom || (user && user.nom) || 'BIPE';
    const now = new Date();
    const mois = now.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
    const filename = `bipe_sauvegarde_${now.toISOString().slice(0, 10)}.json`;

    const subject = `[BIPE] Sauvegarde du ${mois}`;
    const body =
      `Bonjour,\n\n` +
      `Voici ma sauvegarde BIPE du mois de ${mois}.\n\n` +
      `Entreprise : ${nom}\n` +
      `Fichier à joindre : ${filename}\n\n` +
      `(Le fichier a été téléchargé sur mon appareil. ` +
      `Je le glisse-dépose en pièce jointe de ce mail, puis je m'envoie ce message à moi-même.)\n\n` +
      `— Envoyé depuis BIPE ${VERSION}`;

    const mailto =
      `mailto:${encodeURIComponent(email)}` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;

    return { mailto, filename, subject, email };
  }

  /**
   * Nombre de jours depuis la dernière sauvegarde (null si jamais).
   */
  function checkBackupAge() {
    const last = storage.get(KEYS.lastBackup);
    if (!last) return null;
    const ms = Date.now() - new Date(last).getTime();
    if (isNaN(ms) || ms < 0) return null;
    return Math.floor(ms / (1000 * 60 * 60 * 24));
  }

  /* ============================================================
     ⬇⬇⬇ v1.5 — FILTRES DE DATES RÉUTILISABLES ⬇⬇⬇
     Utilisation typique :
       BIPE.renderDateFilters('mes-filtres', (filter) => {
         const items = BIPE.filterByDate(allVentes, 'date', filter);
         render(items);
       });
     filter = { mode: 'all'|'month'|'week'|'year'|'range', from?, to? }
     ============================================================ */

  const FILTER_LABELS = [
    { mode: 'all',   label: 'Tous' },
    { mode: 'month', label: 'Ce mois' },
    { mode: 'week',  label: 'Cette semaine' },
    { mode: 'year',  label: 'Cette année' },
    { mode: 'range', label: 'Période' }
  ];

  function renderDateFilters(containerId, onChange) {
    const el = document.getElementById(containerId);
    if (!el) { console.warn('renderDateFilters: container introuvable', containerId); return; }

    let current = { mode: 'all', from: '', to: '' };

    const build = () => {
      el.innerHTML = `
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin:12px 0;">
          ${FILTER_LABELS.map(f => `
            <button data-mode="${f.mode}" style="
              padding:10px 16px;border-radius:999px;
              background:${current.mode === f.mode ? '#d4af37' : '#141414'};
              color:${current.mode === f.mode ? '#000' : '#f5f0e1'};
              border:1px solid ${current.mode === f.mode ? '#d4af37' : '#2a2a2a'};
              font-family:'Baloo Bhaijaan 2',sans-serif;
              font-weight:600;font-size:.95rem;cursor:pointer;
            ">${f.label}</button>
          `).join('')}
        </div>
        ${current.mode === 'range' ? `
          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;">
            <input type="date" id="${containerId}-from" value="${current.from}" style="
              padding:10px;border-radius:10px;background:#141414;color:#f5f0e1;
              border:1px solid #2a2a2a;font-family:inherit;
            ">
            <input type="date" id="${containerId}-to" value="${current.to}" style="
              padding:10px;border-radius:10px;background:#141414;color:#f5f0e1;
              border:1px solid #2a2a2a;font-family:inherit;
            ">
          </div>
        ` : ''}
      `;

      el.querySelectorAll('button[data-mode]').forEach(b => {
        b.onclick = () => {
          current.mode = b.dataset.mode;
          if (current.mode !== 'range') { current.from = ''; current.to = ''; }
          build();
          if (typeof onChange === 'function') onChange({ ...current });
        };
      });

      if (current.mode === 'range') {
        const fromEl = document.getElementById(`${containerId}-from`);
        const toEl   = document.getElementById(`${containerId}-to`);
        const emit = () => {
          current.from = fromEl.value;
          current.to   = toEl.value;
          if (typeof onChange === 'function') onChange({ ...current });
        };
        if (fromEl) fromEl.onchange = emit;
        if (toEl)   toEl.onchange   = emit;
      }
    };

    build();
    // Premier déclenchement pour synchroniser l'écran
    if (typeof onChange === 'function') onChange({ ...current });
  }

  /**
   * Applique un filtre de dates à un tableau d'items.
   * @param items  tableau
   * @param field  nom du champ date (ex: 'date')
   * @param filter { mode, from?, to? }
   */
  function filterByDate(items, field, filter) {
    if (!Array.isArray(items)) return [];
    if (!filter || filter.mode === 'all') return items.slice();

    const now = new Date();
    let start, end;

    if (filter.mode === 'month') {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end   = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    } else if (filter.mode === 'week') {
      const day = now.getDay() || 7; // lundi = 1 ... dimanche = 7
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - day + 1);
      end   = new Date(start);
      end.setDate(end.getDate() + 7);
    } else if (filter.mode === 'year') {
      start = new Date(now.getFullYear(), 0, 1);
      end   = new Date(now.getFullYear() + 1, 0, 1);
    } else if (filter.mode === 'range') {
      if (!filter.from && !filter.to) return items.slice();
      start = filter.from ? new Date(filter.from) : null;
      end   = filter.to   ? new Date(filter.to)   : null;
      if (end) end.setHours(23, 59, 59, 999);
    } else {
      return items.slice();
    }

    return items.filter(it => {
      const raw = it && it[field];
      if (!raw) return false;
      const d = new Date(raw);
      if (isNaN(d)) return false;
      if (start && d < start) return false;
      if (end && d >= end) return false;
      return true;
    });
  }

  /* ============================================================
     API PUBLIQUE
     ============================================================ */
  return {
    LOGO,
    NOM,
    TAGLINE,
    VERSION,
    COULEURS,
    KEYS,
    storage,
    getUser,
    isConnected,
    checkSession,
    logout,
    getParams,
    getCouleur,
    setCouleur,
    fmt,
    fmtDate,
    fmtDateLong,
    esc,
    applyResponsive,
    applySheetStyles,
    toast,
    openSheet,
    closeAllSheets,
    openMenu,
    renderHeader,
    exportJSON,
    exportPDF,
    nav,
    // ⬇ v1.5
    buildBackupPayload,
    exportFullBackup,
    importFullBackup,
    checkMonthlyEmail,
    markMonthlyEmailSent,
    buildMonthlyMailto,
    checkBackupAge,
    renderDateFilters,
    filterByDate
  };

})();

/* ============================================================
   INITIALISATION AUTOMATIQUE
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  // 1. Appliquer le responsive fluide
  BIPE.applyResponsive();

  // 2. Injecter les styles des sheets
  BIPE.applySheetStyles();

  // 3. Appliquer la couleur du groupe si définie
  const groupe = document.body.dataset.groupe;
  if (groupe) {
    BIPE.setCouleur(groupe);
  }

  // 4. Vérifier la session (sauf pages publiques)
  const page = window.location.pathname.split('/').pop();
  const pagesPubliques = [
    'f-acces.html',
    'landing.html',
    'presentation.html',
    'bipe.html',
    'cbi.html',
    ''
  ];
  if (!pagesPubliques.includes(page)) {
    // BIPE.checkSession(); // Décommenter pour activer la protection
  }
});