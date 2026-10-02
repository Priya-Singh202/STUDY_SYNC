/**
 * StudySync Storage Manager
 * Handles local storage persistence for notes, user actions, saved bookmarks,
 * upvotes, comments, study stats, and theme preference.
 */

const STORAGE_KEYS = {
    NOTES: 'studysync_notes_v1',
    SAVED_NOTES: 'studysync_saved_v1',
    UPVOTES: 'studysync_upvotes_v1',
    USER_PROFILE: 'studysync_user_profile_v1',
    COMMENTS: 'studysync_comments_v1',
    STUDY_STATS: 'studysync_study_stats_v1',
    THEME: 'studysync_theme_v1'
};

const StorageManager = {
    // Initialize storage with defaults if empty
    init() {
        if (!localStorage.getItem(STORAGE_KEYS.NOTES)) {
            localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(DEFAULT_NOTES));
        }
        if (!localStorage.getItem(STORAGE_KEYS.SAVED_NOTES)) {
            // Pre-bookmark one note as a welcome example
            localStorage.setItem(STORAGE_KEYS.SAVED_NOTES, JSON.stringify(["note-cs-201"]));
        }
        if (!localStorage.getItem(STORAGE_KEYS.UPVOTES)) {
            localStorage.setItem(STORAGE_KEYS.UPVOTES, JSON.stringify(["note-cs-201"]));
        }
        if (!localStorage.getItem(STORAGE_KEYS.COMMENTS)) {
            localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(DEFAULT_COMMENTS));
        }
        if (!localStorage.getItem(STORAGE_KEYS.USER_PROFILE)) {
            const defaultUser = {
                name: "Alex Rivera",
                role: "Computer Science & Math Student",
                university: "Stanford University",
                avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
                reputationPoints: 480,
                streakDays: 7,
                uploadsCount: 1,
                notesReadCount: 19,
                flashcardsMastered: 24
            };
            localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(defaultUser));
        }
        if (!localStorage.getItem(STORAGE_KEYS.STUDY_STATS)) {
            const defaultStats = {
                quizzesTaken: 8,
                cardsFlipped: 46,
                downloadsCount: 12
            };
            localStorage.setItem(STORAGE_KEYS.STUDY_STATS, JSON.stringify(defaultStats));
        }
    },

    // Reset everything to defaults
    resetAll() {
        localStorage.removeItem(STORAGE_KEYS.NOTES);
        localStorage.removeItem(STORAGE_KEYS.SAVED_NOTES);
        localStorage.removeItem(STORAGE_KEYS.UPVOTES);
        localStorage.removeItem(STORAGE_KEYS.COMMENTS);
        localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
        localStorage.removeItem(STORAGE_KEYS.STUDY_STATS);
        this.init();
    },

    // Notes CRUD
    getNotes() {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.NOTES);
            return data ? JSON.parse(data) : DEFAULT_NOTES;
        } catch (e) {
            console.error("Error reading notes from localStorage", e);
            return DEFAULT_NOTES;
        }
    },

    saveNotes(notes) {
        localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
    },

    getNoteById(id) {
        const notes = this.getNotes();
        return notes.find(n => n.id === id) || null;
    },

    addNote(newNote) {
        const notes = this.getNotes();
        notes.unshift(newNote);
        this.saveNotes(notes);
        
        // Increment user uploads & reputation
        const user = this.getUserProfile();
        user.uploadsCount = (user.uploadsCount || 0) + 1;
        user.reputationPoints = (user.reputationPoints || 0) + 50; // +50 points for uploading
        this.saveUserProfile(user);

        return newNote;
    },

    deleteNote(id) {
        let notes = this.getNotes();
        notes = notes.filter(n => n.id !== id);
        this.saveNotes(notes);
    },

    // Saved / Bookmarked Notes
    getSavedNoteIds() {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.SAVED_NOTES);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    },

    isNoteSaved(id) {
        return this.getSavedNoteIds().includes(id);
    },

    toggleSaveNote(id) {
        const saved = this.getSavedNoteIds();
        const index = saved.indexOf(id);
        let isSaved = false;
        if (index > -1) {
            saved.splice(index, 1);
            isSaved = false;
        } else {
            saved.push(id);
            isSaved = true;
        }
        localStorage.setItem(STORAGE_KEYS.SAVED_NOTES, JSON.stringify(saved));
        return isSaved;
    },

    // Upvotes
    getUpvotedIds() {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.UPVOTES);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    },

    isNoteUpvoted(id) {
        return this.getUpvotedIds().includes(id);
    },

    toggleUpvoteNote(id) {
        const upvotes = this.getUpvotedIds();
        const index = upvotes.indexOf(id);
        const notes = this.getNotes();
        const note = notes.find(n => n.id === id);
        let upvoted = false;

        if (index > -1) {
            upvotes.splice(index, 1);
            if (note) note.upvotes = Math.max(0, (note.upvotes || 1) - 1);
            upvoted = false;
        } else {
            upvotes.push(id);
            if (note) note.upvotes = (note.upvotes || 0) + 1;
            upvoted = true;
        }

        localStorage.setItem(STORAGE_KEYS.UPVOTES, JSON.stringify(upvotes));
        this.saveNotes(notes);
        return { upvoted, newCount: note ? note.upvotes : 0 };
    },

    incrementDownload(id) {
        const notes = this.getNotes();
        const note = notes.find(n => n.id === id);
        if (note) {
            note.downloads = (note.downloads || 0) + 1;
            this.saveNotes(notes);
        }
        const stats = this.getStudyStats();
        stats.downloadsCount = (stats.downloadsCount || 0) + 1;
        localStorage.setItem(STORAGE_KEYS.STUDY_STATS, JSON.stringify(stats));
    },

    // Comments
    getComments(noteId) {
        try {
            const allComments = JSON.parse(localStorage.getItem(STORAGE_KEYS.COMMENTS) || '{}');
            return allComments[noteId] || [];
        } catch (e) {
            return [];
        }
    },

    addComment(noteId, commentText, authorName, authorUni) {
        const allComments = JSON.parse(localStorage.getItem(STORAGE_KEYS.COMMENTS) || '{}');
        if (!allComments[noteId]) {
            allComments[noteId] = [];
        }
        const newComment = {
            id: 'c-' + Date.now(),
            author: authorName || 'Alex Rivera',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80',
            university: authorUni || 'Stanford University',
            date: 'Just now',
            content: commentText,
            likes: 0
        };
        allComments[noteId].unshift(newComment);
        localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(allComments));
        return newComment;
    },

    // User Profile
    getUserProfile() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_PROFILE));
        } catch (e) {
            return null;
        }
    },

    saveUserProfile(profile) {
        localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
    },

    // Stats
    getStudyStats() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.STUDY_STATS) || '{}');
        } catch (e) {
            return { quizzesTaken: 0, cardsFlipped: 0, downloadsCount: 0 };
        }
    },

    recordStat(statKey, increment = 1) {
        const stats = this.getStudyStats();
        stats[statKey] = (stats[statKey] || 0) + increment;
        localStorage.setItem(STORAGE_KEYS.STUDY_STATS, JSON.stringify(stats));
    }
};

// Initialize right away
StorageManager.init();
