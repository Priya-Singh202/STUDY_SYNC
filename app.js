/**
 * StudySync Main Application Logic
 * Navigation, Search, Filtering, Reader Modal, Upload Workflow, Bookmarks, Upvotes & Toasts.
 */

// Application State
const AppState = {
    currentTab: 'explore',
    searchQuery: '',
    selectedCategory: 'All',
    selectedResourceType: 'All',
    sortBy: 'popular',
    activeNoteId: null,
    readerFontSize: 16,
    readerTheme: 'paper'
};

// Global Toast function
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-medium transition-all transform duration-300 translate-y-4 opacity-0 ${
        type === 'success' ? 'bg-emerald-600 text-white' : 
        type === 'error' ? 'bg-rose-600 text-white' : 
        'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
    }`;

    let icon = '🔔';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '⚠️';

    toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
    toastContainer.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
        toast.classList.remove('translate-y-4', 'opacity-0');
    });

    setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-2');
        setTimeout(() => toast.remove(), 300);
    }, 3200);
}

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initUserProfile();
    initEventListeners();
    StudyEngine.init();
    renderNotesGrid();
    renderCommunityThreads();
});

// Theme Management
function initTheme() {
    const savedTheme = localStorage.getItem('studysync_theme') || 'light';
    if (savedTheme === 'dark' || (!('studysync_theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}

function toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('studysync_theme', isDark ? 'dark' : 'light');
    showToast(isDark ? '🌙 Dark Mode Activated' : '☀️ Light Mode Activated');
}

// User Profile Rendering
function initUserProfile() {
    const user = StorageManager.getUserProfile();
    if (!user) return;

    const nameElem = document.getElementById('userProfileName');
    const pointsElem = document.getElementById('userRepPoints');
    const streakElem = document.getElementById('userStreakDays');
    const avatarElem = document.getElementById('userAvatarImg');

    if (nameElem) nameElem.innerText = user.name;
    if (pointsElem) pointsElem.innerText = `${user.reputationPoints} pts`;
    if (streakElem) streakElem.innerText = `${user.streakDays}d`;
    if (avatarElem && user.avatar) avatarElem.src = user.avatar;
}

// Event Listeners
function initEventListeners() {
    // Search input
    const searchInput = document.getElementById('globalSearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            AppState.searchQuery = e.target.value.toLowerCase().trim();
            renderNotesGrid();
        });
    }

    // Hero quick search
    const heroSearchInput = document.getElementById('heroSearchInput');
    if (heroSearchInput) {
        heroSearchInput.addEventListener('input', (e) => {
            AppState.searchQuery = e.target.value.toLowerCase().trim();
            if (searchInput) searchInput.value = e.target.value;
            renderNotesGrid();
        });
    }

    // Sort select
    const sortSelect = document.getElementById('sortBySelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            AppState.sortBy = e.target.value;
            renderNotesGrid();
        });
    }

    // Resource Type select
    const resourceTypeSelect = document.getElementById('resourceTypeSelect');
    if (resourceTypeSelect) {
        resourceTypeSelect.addEventListener('change', (e) => {
            AppState.selectedResourceType = e.target.value;
            renderNotesGrid();
        });
    }

    // Category filter chips
    const categoryChips = document.querySelectorAll('.category-chip');
    categoryChips.forEach(chip => {
        chip.addEventListener('click', () => {
            categoryChips.forEach(c => c.classList.remove('active', 'bg-indigo-600', 'text-white'));
            chip.classList.add('active', 'bg-indigo-600', 'text-white');
            AppState.selectedCategory = chip.getAttribute('data-category');
            renderNotesGrid();
        });
    });

    // Deck select change in study hub
    const deckSelect = document.getElementById('deckSelect');
    if (deckSelect) {
        deckSelect.addEventListener('change', (e) => {
            StudyEngine.loadDeckForNote(e.target.value);
            StudyEngine.startQuiz(e.target.value);
        });
    }
}

// Navigation Tab Switcher
function switchTab(tabId) {
    AppState.currentTab = tabId;

    // Update Nav buttons state
    document.querySelectorAll('.nav-btn').forEach(btn => {
        const target = btn.getAttribute('data-tab');
        if (target === tabId) {
            btn.classList.add('text-indigo-600', 'dark:text-indigo-400', 'border-indigo-600', 'font-semibold');
            btn.classList.remove('text-slate-600', 'dark:text-slate-400', 'border-transparent');
        } else {
            btn.classList.remove('text-indigo-600', 'dark:text-indigo-400', 'border-indigo-600', 'font-semibold');
            btn.classList.add('text-slate-600', 'dark:text-slate-400', 'border-transparent');
        }
    });

    // Toggle main sections
    const sections = ['exploreSection', 'librarySection', 'studyHubSection', 'communitySection'];
    sections.forEach(sec => {
        const elem = document.getElementById(sec);
        if (elem) elem.classList.add('hidden');
    });

    const activeSec = document.getElementById(tabId + 'Section');
    if (activeSec) {
        activeSec.classList.remove('hidden');
    }

    // Specific tab activations
    if (tabId === 'library') {
        renderLibrary();
    } else if (tabId === 'studyHub') {
        StudyEngine.loadDeckForNote('all');
        StudyEngine.startQuiz('all');
    } else if (tabId === 'explore') {
        renderNotesGrid();
    }
}

// Render Notes Grid (Explore Feed)
function renderNotesGrid() {
    const grid = document.getElementById('notesGrid');
    const emptyState = document.getElementById('notesEmptyState');
    const countBadge = document.getElementById('resultsCountBadge');
    if (!grid) return;

    let notes = StorageManager.getNotes();

    // 1. Filter by Search Query
    if (AppState.searchQuery) {
        notes = notes.filter(n => 
            n.title.toLowerCase().includes(AppState.searchQuery) ||
            n.subject.toLowerCase().includes(AppState.searchQuery) ||
            (n.courseCode && n.courseCode.toLowerCase().includes(AppState.searchQuery)) ||
            n.university.toLowerCase().includes(AppState.searchQuery) ||
            n.author.name.toLowerCase().includes(AppState.searchQuery) ||
            (n.tags && n.tags.some(t => t.toLowerCase().includes(AppState.searchQuery))) ||
            (n.content && n.content.toLowerCase().includes(AppState.searchQuery))
        );
    }

    // 2. Filter by Category
    if (AppState.selectedCategory && AppState.selectedCategory !== 'All') {
        notes = notes.filter(n => n.category === AppState.selectedCategory);
    }

    // 3. Filter by Resource Type
    if (AppState.selectedResourceType && AppState.selectedResourceType !== 'All') {
        notes = notes.filter(n => n.resourceType === AppState.selectedResourceType);
    }

    // 4. Sorting
    notes.sort((a, b) => {
        if (AppState.sortBy === 'popular') return (b.upvotes || 0) - (a.upvotes || 0);
        if (AppState.sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        if (AppState.sortBy === 'newest') return new Date(b.date) - new Date(a.date);
        if (AppState.sortBy === 'downloads') return (b.downloads || 0) - (a.downloads || 0);
        return 0;
    });

    if (countBadge) {
        countBadge.innerText = `${notes.length} resource${notes.length === 1 ? '' : 's'} found`;
    }

    if (notes.length === 0) {
        grid.innerHTML = '';
        if (emptyState) emptyState.classList.remove('hidden');
        return;
    }

    if (emptyState) emptyState.classList.add('hidden');

    grid.innerHTML = notes.map(note => createNoteCardHtml(note)).join('');
}

// Generate Note Card HTML
function createNoteCardHtml(note) {
    const isSaved = StorageManager.isNoteSaved(note.id);
    const isUpvoted = StorageManager.isNoteUpvoted(note.id);

    // Subject color mapping
    const subjectColors = {
        'Computer Science': 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800',
        'Mathematics': 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
        'Biology': 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800',
        'Chemistry': 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
        'Physics': 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800',
        'Economics': 'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/60 dark:text-cyan-300 dark:border-cyan-800',
        'History': 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/60 dark:text-orange-300 dark:border-orange-800'
    };
    const badgeStyle = subjectColors[note.subject] || 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300';

    const tagsHtml = (note.tags || []).slice(0, 3).map(tag => 
        `<span class="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">#${tag}</span>`
    ).join('');

    return `
        <div class="note-card bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700/80 p-5 flex flex-col justify-between shadow-sm relative overflow-hidden group">
            
            <!-- Top Header & Badges -->
            <div>
                <div class="flex items-center justify-between gap-2 mb-3">
                    <div class="flex items-center gap-2 flex-wrap">
                        <span class="text-xs font-semibold px-2.5 py-1 rounded-full border ${badgeStyle}">
                            ${note.courseCode ? `${note.courseCode} • ` : ''}${note.subject}
                        </span>
                        <span class="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                            ${note.resourceType || 'Notes'}
                        </span>
                    </div>

                    <!-- Bookmark button -->
                    <button onclick="handleBookmark('${note.id}', this)" title="${isSaved ? 'Remove from Saved' : 'Save note'}" 
                        class="w-8 h-8 rounded-full flex items-center justify-center transition hover:bg-slate-100 dark:hover:bg-slate-700 ${isSaved ? 'text-amber-500' : 'text-slate-400 dark:text-slate-500'}">
                        <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M5 3v18l7-4 7 4V3H5z"/></svg>
                    </button>
                </div>

                <!-- Title -->
                <h3 onclick="openNoteReader('${note.id}')" class="font-bold text-base md:text-lg text-slate-900 dark:text-white leading-snug cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors line-clamp-2 mb-2">
                    ${note.title}
                </h3>

                <!-- Description Preview -->
                <p class="text-xs md:text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4">
                    ${note.description}
                </p>

                <!-- Tags -->
                <div class="flex items-center gap-1.5 flex-wrap mb-4">
                    ${tagsHtml}
                </div>
            </div>

            <!-- Author & Metadata Footer -->
            <div>
                <div class="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700/60 mb-3">
                    <div class="flex items-center gap-2">
                        <img src="${note.author.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60'}" class="w-6 h-6 rounded-full object-cover" alt="${note.author.name}" />
                        <div>
                            <div class="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                                ${note.author.name}
                                ${note.author.verified ? '<span class="text-blue-500 text-[10px]" title="Verified Student">✓</span>' : ''}
                            </div>
                            <div class="text-[10px] text-slate-500 truncate max-w-[120px]">${note.university}</div>
                        </div>
                    </div>

                    <!-- Rating and Pages -->
                    <div class="text-right">
                        <div class="flex items-center gap-1 text-xs font-bold text-amber-500">
                            <span>★</span>
                            <span class="text-slate-800 dark:text-slate-200">${note.rating || '4.9'}</span>
                            <span class="text-[10px] font-normal text-slate-400">(${note.reviewsCount || 42})</span>
                        </div>
                        <div class="text-[10px] text-slate-400">${note.pages || 1} pages</div>
                    </div>
                </div>

                <!-- Action Bar -->
                <div class="flex items-center justify-between gap-2 pt-2">
                    <!-- Upvote Button -->
                    <button onclick="handleUpvote('${note.id}', this)" class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition ${isUpvoted ? 'border-indigo-500 bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-indigo-400'}">
                        <span>▲</span>
                        <span class="upvote-count">${note.upvotes || 0}</span>
                    </button>

                    <!-- Preview & Read Button -->
                    <div class="flex items-center gap-1.5">
                        <button onclick="openNoteReader('${note.id}')" class="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition">
                            Read Notes
                        </button>
                        <button onclick="downloadNote('${note.id}')" title="Download Document" class="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Upvote Handler
function handleUpvote(noteId, buttonElement) {
    const result = StorageManager.toggleUpvoteNote(noteId);
    const countElem = buttonElement.querySelector('.upvote-count');
    if (countElem) {
        countElem.innerText = result.newCount;
    }
    if (result.upvoted) {
        buttonElement.classList.add('border-indigo-500', 'bg-indigo-50', 'text-indigo-600', 'dark:bg-indigo-950/60', 'dark:text-indigo-400');
        showToast('🔺 Upvoted notes!', 'success');
    } else {
        buttonElement.classList.remove('border-indigo-500', 'bg-indigo-50', 'text-indigo-600', 'dark:bg-indigo-950/60', 'dark:text-indigo-400');
    }
}

// Bookmark Handler
function handleBookmark(noteId, buttonElement) {
    const isSaved = StorageManager.toggleSaveNote(noteId);
    if (isSaved) {
        buttonElement.classList.add('text-amber-500');
        buttonElement.classList.remove('text-slate-400', 'dark:text-slate-500');
        showToast('📌 Note saved to your Library!', 'success');
    } else {
        buttonElement.classList.remove('text-amber-500');
        buttonElement.classList.add('text-slate-400', 'dark:text-slate-500');
        showToast('Removed from saved notes.');
    }

    if (AppState.currentTab === 'library') {
        renderLibrary();
    }
}

// Download Note Handler
function downloadNote(noteId) {
    const note = StorageManager.getNoteById(noteId);
    if (!note) return;

    StorageManager.incrementDownload(noteId);
    
    // Create text file download for user
    const element = document.createElement('a');
    const fileContent = `StudySync Verified Academic Note\n=================================\nTitle: ${note.title}\nCourse: ${note.courseCode} - ${note.subject}\nUniversity: ${note.university}\nAuthor: ${note.author.name}\nDate: ${note.date}\n\n=================================\nCONTENT:\n${note.content || note.description}\n`;
    const file = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `${note.title.replace(/[^a-zA-Z0-9_-]/g, '_')}_StudySync.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    showToast(`📥 Downloading "${note.title.substring(0, 25)}..."`, 'success');
}

// ----------------------------------------------------
// NOTE READER MODAL LOGIC
// ----------------------------------------------------
function openNoteReader(noteId) {
    const note = StorageManager.getNoteById(noteId);
    if (!note) return;

    AppState.activeNoteId = noteId;

    // Track read stat
    const user = StorageManager.getUserProfile();
    user.notesReadCount = (user.notesReadCount || 0) + 1;
    StorageManager.saveUserProfile(user);

    // Populate Reader Elements
    document.getElementById('readerNoteTitle').innerText = note.title;
    document.getElementById('readerSubjectBadge').innerText = `${note.courseCode || ''} ${note.subject}`;
    document.getElementById('readerAuthorName').innerText = note.author.name;
    document.getElementById('readerAuthorUni').innerText = note.university;
    document.getElementById('readerAuthorAvatar').src = note.author.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60';
    document.getElementById('readerDate').innerText = `Uploaded on ${note.date}`;
    document.getElementById('readerRating').innerText = `${note.rating || '4.9'} (${note.reviewsCount || 42} reviews)`;
    document.getElementById('readerDownloads').innerText = `${note.downloads || 120} downloads`;

    // Render formatted body
    const bodyElem = document.getElementById('readerContentBody');
    if (bodyElem) {
        bodyElem.innerHTML = renderMarkdown(note.content || note.description);
        bodyElem.style.fontSize = `${AppState.readerFontSize}px`;
    }

    // Render Comments
    renderReaderComments(noteId);

    // Update study deck launcher button
    const studyLauncher = document.getElementById('readerLaunchStudyBtn');
    if (studyLauncher) {
        studyLauncher.onclick = () => {
            closeNoteReader();
            switchTab('studyHub');
            const deckSelect = document.getElementById('deckSelect');
            if (deckSelect) deckSelect.value = noteId;
            StudyEngine.loadDeckForNote(noteId);
            StudyEngine.startQuiz(noteId);
        };
    }

    // Open Modal
    const modal = document.getElementById('noteReaderModal');
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

function closeNoteReader() {
    const modal = document.getElementById('noteReaderModal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
}

// Markdown Parser Helper
function renderMarkdown(rawText) {
    if (!rawText) return '<p>No written content provided.</p>';

    let html = rawText
        // Headers
        .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold mt-4 mb-2 text-indigo-500 dark:text-indigo-400">$1</h3>')
        .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-6 mb-3 border-b pb-2 dark:border-slate-700">$1</h2>')
        .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-extrabold mt-4 mb-3">$1</h1>')
        // Bold & Italic
        .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/gim, '<em>$1</em>')
        // Code blocks
        .replace(/```python([\s\S]*?)```/gim, '<pre class="bg-slate-900 text-emerald-400 p-4 rounded-xl text-xs overflow-x-auto my-3 font-mono"><code>$1</code></pre>')
        .replace(/```([\s\S]*?)```/gim, '<pre class="bg-slate-900 text-slate-100 p-4 rounded-xl text-xs overflow-x-auto my-3 font-mono"><code>$1</code></pre>')
        .replace(/`([^`]+)`/gim, '<code class="bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-300 px-1.5 py-0.5 rounded text-xs font-mono">$1</code>')
        // Blockquotes
        .replace(/^\> (.*$)/gim, '<blockquote class="border-l-4 border-indigo-500 pl-4 py-1 italic my-3 text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 rounded-r-lg">$1</blockquote>')
        // Lists
        .replace(/^\- (.*$)/gim, '<li class="ml-4 list-disc">$1</li>')
        // Newlines
        .replace(/\n\n/gim, '</p><p class="my-3">');

    return `<div class="note-body">${html}</div>`;
}

// Reader Font Sizing
function changeReaderFontSize(delta) {
    AppState.readerFontSize = Math.max(12, Math.min(26, AppState.readerFontSize + delta));
    const bodyElem = document.getElementById('readerContentBody');
    if (bodyElem) {
        bodyElem.style.fontSize = `${AppState.readerFontSize}px`;
    }
}

function resetReaderFontSize() {
    AppState.readerFontSize = 16;
    const bodyElem = document.getElementById('readerContentBody');
    if (bodyElem) {
        bodyElem.style.fontSize = '16px';
    }
}

// Reader Theme Presets
function setReaderTheme(theme) {
    AppState.readerTheme = theme;
    const container = document.getElementById('readerPaperContainer');
    if (!container) return;

    container.classList.remove('reader-theme-paper', 'reader-theme-dark', 'reader-theme-sepia', 'reader-theme-sage');
    container.classList.add(`reader-theme-${theme}`);
}

// Reader Comments
function renderReaderComments(noteId) {
    const list = document.getElementById('readerCommentsList');
    if (!list) return;

    const comments = StorageManager.getComments(noteId);
    if (comments.length === 0) {
        list.innerHTML = `<p class="text-xs text-slate-400 py-3 italic">No comments yet. Start the academic discussion!</p>`;
        return;
    }

    list.innerHTML = comments.map(c => `
        <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-1.5">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <img src="${c.avatar}" class="w-5 h-5 rounded-full object-cover" />
                    <span class="text-xs font-semibold text-slate-800 dark:text-slate-200">${c.author}</span>
                    <span class="text-[10px] text-slate-400">• ${c.university || 'Scholar'}</span>
                </div>
                <span class="text-[10px] text-slate-400">${c.date}</span>
            </div>
            <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">${c.content}</p>
        </div>
    `).join('');
}

function postReaderComment() {
    const input = document.getElementById('readerCommentInput');
    if (!input || !input.value.trim() || !AppState.activeNoteId) return;

    const user = StorageManager.getUserProfile();
    StorageManager.addComment(AppState.activeNoteId, input.value.trim(), user.name, user.university);
    input.value = '';
    renderReaderComments(AppState.activeNoteId);
    showToast('💬 Comment posted!', 'success');
}

// ----------------------------------------------------
// UPLOAD NOTES MODAL LOGIC
// ----------------------------------------------------
function openUploadModal() {
    const modal = document.getElementById('uploadNoteModal');
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

function closeUploadModal() {
    const modal = document.getElementById('uploadNoteModal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
}

function handleUploadFormSubmit(event) {
    event.preventDefault();

    const title = document.getElementById('uploadTitle').value.trim();
    const courseCode = document.getElementById('uploadCourseCode').value.trim();
    const subject = document.getElementById('uploadSubject').value;
    const resourceType = document.getElementById('uploadResourceType').value;
    const university = document.getElementById('uploadUniversity').value.trim();
    const tagsString = document.getElementById('uploadTags').value.trim();
    const description = document.getElementById('uploadDescription').value.trim();
    const content = document.getElementById('uploadContent').value.trim();

    if (!title || !subject || !description) {
        showToast('Please fill in required fields.', 'error');
        return;
    }

    const tags = tagsString 
        ? tagsString.split(',').map(t => t.trim().replace(/^#/, '')).filter(Boolean)
        : [subject.toLowerCase().replace(/\s+/g, '-')];

    const user = StorageManager.getUserProfile();

    // Auto-create a sample flashcard from user notes if possible
    const sampleFlashcards = [
        {
            question: `What is the primary thesis / core concept of "${title}"?`,
            answer: description.substring(0, 200) + '...'
        }
    ];

    const sampleQuiz = [
        {
            question: `Which field of study does "${title}" cover?`,
            options: [subject, "Music Theory", "Modern Culinary Arts", "Astrology"],
            correctIndex: 0,
            explanation: `This document is specifically categorized under ${subject}.`
        }
    ];

    const newNote = {
        id: 'note-custom-' + Date.now(),
        title,
        subject,
        category: subject,
        courseCode: courseCode || subject.substring(0, 4).toUpperCase() + ' 101',
        university: university || user.university || 'General Academic',
        author: {
            name: user.name || 'Alex Rivera',
            avatar: user.avatar,
            verified: true,
            role: 'Author'
        },
        description,
        date: new Date().toISOString().split('T')[0],
        rating: 5.0,
        reviewsCount: 1,
        upvotes: 1,
        downloads: 0,
        pages: Math.max(1, Math.ceil((content.length || description.length) / 800)),
        fileType: 'Document',
        resourceType: resourceType || 'Lecture Notes',
        tags,
        content: content || description,
        flashcards: sampleFlashcards,
        quiz: sampleQuiz
    };

    StorageManager.addNote(newNote);
    initUserProfile(); // update streak / points
    closeUploadModal();
    document.getElementById('uploadNoteForm').reset();

    showToast('🎉 Note uploaded successfully! +50 Rep Points', 'success');

    // Switch to explore and re-render
    AppState.selectedCategory = 'All';
    switchTab('explore');
    renderNotesGrid();
}

// ----------------------------------------------------
// MY LIBRARY RENDERING
// ----------------------------------------------------
function renderLibrary() {
    const savedList = document.getElementById('savedNotesList');
    const myUploadsList = document.getElementById('myUploadsList');
    const notes = StorageManager.getNotes();
    const savedIds = StorageManager.getSavedNoteIds();
    const user = StorageManager.getUserProfile();

    // Saved Notes
    const savedNotes = notes.filter(n => savedIds.includes(n.id));
    if (savedList) {
        if (savedNotes.length === 0) {
            savedList.innerHTML = `
                <div class="col-span-full text-center py-10 p-6 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                    <p class="text-sm text-slate-500 mb-3">No saved notes yet. Bookmark notes while exploring!</p>
                    <button onclick="switchTab('explore')" class="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold">Explore Feed</button>
                </div>
            `;
        } else {
            savedList.innerHTML = savedNotes.map(n => createNoteCardHtml(n)).join('');
        }
    }

    // My Uploads
    const myUploads = notes.filter(n => n.author.name === user.name || n.id.startsWith('note-custom'));
    if (myUploadsList) {
        if (myUploads.length === 0) {
            myUploadsList.innerHTML = `
                <div class="col-span-full text-center py-10 p-6 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                    <p class="text-sm text-slate-500 mb-3">You haven't uploaded any notes yet. Share your study material to earn reputation!</p>
                    <button onclick="openUploadModal()" class="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold">+ Upload Your First Note</button>
                </div>
            `;
        } else {
            myUploadsList.innerHTML = myUploads.map(n => createNoteCardHtml(n)).join('');
        }
    }

    // Library Stats
    const stats = StorageManager.getStudyStats();
    const readCounter = document.getElementById('libNotesReadCount');
    const cardsCounter = document.getElementById('libCardsFlippedCount');
    const downloadsCounter = document.getElementById('libDownloadsCount');
    const repCounter = document.getElementById('libRepPoints');

    if (readCounter) readCounter.innerText = user.notesReadCount || 19;
    if (cardsCounter) cardsCounter.innerText = stats.cardsFlipped || 46;
    if (downloadsCounter) downloadsCounter.innerText = stats.downloadsCount || 12;
    if (repCounter) repCounter.innerText = user.reputationPoints || 480;
}

// ----------------------------------------------------
// COMMUNITY THREADS
// ----------------------------------------------------
function renderCommunityThreads() {
    const container = document.getElementById('communityThreadsContainer');
    if (!container) return;

    container.innerHTML = DEFAULT_COMMUNITY_THREADS.map(thread => `
        <div class="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:border-indigo-400 transition-all flex items-start justify-between gap-4">
            <div class="space-y-2">
                <div class="flex items-center gap-2 text-xs text-slate-500">
                    <span class="font-semibold text-slate-800 dark:text-slate-200">${thread.author}</span>
                    <span>•</span>
                    <span>${thread.university}</span>
                    <span>•</span>
                    <span>${thread.timeAgo}</span>
                </div>
                <h4 class="font-bold text-slate-900 dark:text-white hover:text-indigo-600 cursor-pointer transition text-sm md:text-base">
                    ${thread.title}
                </h4>
                <div class="flex items-center gap-2">
                    ${thread.tags.map(t => `<span class="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400">#${t}</span>`).join('')}
                </div>
            </div>

            <div class="flex flex-col items-center gap-2">
                <button onclick="showToast('Upvoted community thread!')" class="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-400 text-xs font-semibold flex items-center gap-1.5 transition">
                    <span>▲</span>
                    <span>${thread.upvotes}</span>
                </button>
                <span class="text-xs text-slate-400 flex items-center gap-1">
                    💬 ${thread.repliesCount}
                </span>
            </div>
        </div>
    `).join('');
}

function postCommunityQuestion() {
    const input = document.getElementById('newThreadQuestionInput');
    if (!input || !input.value.trim()) return;

    const user = StorageManager.getUserProfile();
    const newThread = {
        id: 'thread-' + Date.now(),
        title: input.value.trim(),
        author: user.name,
        university: user.university,
        repliesCount: 0,
        tags: ["general", "study-sync"],
        timeAgo: "Just now",
        upvotes: 1
    };

    DEFAULT_COMMUNITY_THREADS.unshift(newThread);
    input.value = '';
    renderCommunityThreads();
    showToast('🚀 Question submitted to community!', 'success');
}
