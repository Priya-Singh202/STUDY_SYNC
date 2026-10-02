# 🎓 StudySync — Modern Collaborative Notes Sharing Platform

**StudySync** is a modern, student-centric academic notes sharing and study acceleration platform. It empowers students to upload, discover, search, review, and master course materials from universities around the globe.

---

## ✨ Features Overview

### 1. 🔍 Explore & Global Search
- **Instant Live Search**: Search across courses, subjects, topics, tags, and document contents.
- **Discipline Filter Chips**: Computer Science, Mathematics, Biology & Pre-Med, Chemistry, Physics, Economics & Business, Humanities & History.
- **Resource Categories**: Filter by Comprehensive Notes, Cheat Sheets, Formula Sheets, Exam Summaries, and Lecture Notes.
- **Flexible Sorting**: Sort by Most Popular (Upvotes), Highest Rated, Newest, or Most Downloaded.

### 2. 📖 Distraction-Free Note Reader Modal
- **Rich Document Presentation**: Formatted markdown headings, bulleted concepts, Big-O tables, formula blocks, and code syntax highlighting.
- **Customizable Reading Themes**: Clean Paper, Warm Sepia, Night Dark, and Eye-Care Sage modes.
- **Font Size Adjustments**: Dynamic zoom controls (`A-`, `100%`, `A+`) for comfortable reading.
- **Direct Actions**: Download document as clean text/markdown or trigger clean browser printing (`window.print()`).
- **Interactive Discussion Thread**: Post comments, feedback, or ask questions directly underneath any note.

### 3. 🧠 AI Study Hub (Flashcards & Quiz Engine)
- **3D Flip Flashcards**: Realistic 3D card-flip animations with smooth CSS transforms (`perspective-1000`).
- **Deck Selector**: Study flashcards filtered by individual note topics or combined across all subjects.
- **Spaced Repetition Tracking**: "Still Learning" vs. "Mastered" with visual progress bar and reputation point awards.
- **Interactive AI Quiz Mode**: Instant multiple-choice quizzes with immediate visual feedback (correct green / incorrect red) and conceptual explanations.

### 4. 📤 Easy Notes Sharing & Uploads
- **Streamlined Upload Modal**: Title, Subject, Resource Type, Course Code, University, Tags, and Summary.
- **Markdown & Note Editor**: Paste course notes with live character counter.
- **Instant Publication & Reward**: Uploading automatically adds 50 reputation points to your student profile and displays the note on the feed.

### 5. 📚 My Library & Personal Dashboard
- **Saved Bookmarks**: Quick access to bookmarked notes.
- **My Uploads**: View and manage notes you have contributed.
- **Study Metrics**: Track total notes read, flashcards reviewed, downloads, and reputation points.

### 6. 💬 Community Discussion & Q&A
- Exchange requests for missing course notes, exam prep tips, and study group invitations.

### 7. 🌓 Dark / Light Mode & Local Persistence
- Full dark mode support using Tailwind CSS with seamless toggle.
- All uploads, bookmarks, upvotes, comments, study stats, and theme choices are automatically persisted in `localStorage`.

---

## 🚀 How to Run

### Method 1: Instant Browser Launch (Recommended)
You can directly open `index.html` in any modern web browser (Chrome, Edge, Firefox, Brave, Safari):
- Double click `index.html` in Windows Explorer or open it in your browser.

### Method 2: Python Local Server
Run the included `serve.py` script:
```powershell
python serve.py
```
This automatically starts a local server at `http://localhost:8000` and launches it in your default web browser.

---

## 📁 Project Structure

```
study-sync/
├── index.html         # Main semantic HTML5 interface
├── css/
│   └── styles.css     # 3D animations, glassmorphism, reader themes, scrollbars
├── js/
│   ├── data.js        # Realistic seeded courses, notes, flashcards, quizzes & comments
│   ├── storage.js     # LocalStorage state manager (CRUD, upvotes, bookmarks, stats)
│   ├── flashcards.js  # 3D Flashcard and AI Quiz interactive study engine
│   └── app.js         # Navigation, search, filtering, reader modal, and upload logic
├── serve.py           # One-click Python local server with auto-browser launch
└── README.md          # Documentation and feature guide
```
