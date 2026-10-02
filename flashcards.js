/**
 * StudySync Flashcards & Quiz Engine
 * Interactive study tools supporting 3D card flipping, mastery tracking, and instant quiz feedback.
 */

const StudyEngine = {
    currentDeck: [],
    currentCardIndex: 0,
    masteredCards: new Set(),
    activeNoteId: null,

    // Quiz state
    quizQuestions: [],
    currentQuizIndex: 0,
    quizScore: 0,
    answeredQuestions: {},

    init() {
        this.bindEvents();
    },

    bindEvents() {
        // Flashcard flip trigger
        const flashcardElement = document.getElementById('activeFlashcard');
        if (flashcardElement) {
            flashcardElement.addEventListener('click', () => {
                flashcardElement.classList.toggle('flipped');
                StorageManager.recordStat('cardsFlipped', 1);
            });
        }
    },

    loadDeckForNote(noteId) {
        const notes = StorageManager.getNotes();
        let targetNotes = [];
        
        if (noteId && noteId !== 'all') {
            const single = notes.find(n => n.id === noteId);
            if (single && single.flashcards && single.flashcards.length > 0) {
                targetNotes = [single];
                this.activeNoteId = noteId;
            }
        }

        // If 'all' or empty, pool flashcards across all notes
        if (targetNotes.length === 0) {
            targetNotes = notes.filter(n => n.flashcards && n.flashcards.length > 0);
            this.activeNoteId = 'all';
        }

        let deck = [];
        targetNotes.forEach(note => {
            (note.flashcards || []).forEach(fc => {
                deck.push({
                    question: fc.question,
                    answer: fc.answer,
                    subject: note.subject,
                    noteTitle: note.title
                });
            });
        });

        this.currentDeck = deck;
        this.currentCardIndex = 0;
        this.masteredCards.clear();
        this.renderCard();
        this.updateDeckSelector(notes);
    },

    updateDeckSelector(notes) {
        const select = document.getElementById('deckSelect');
        if (!select) return;
        
        let html = `<option value="all">All Subjects (${this.getTotalCardsAcrossAll(notes)} Cards)</option>`;
        notes.forEach(note => {
            if (note.flashcards && note.flashcards.length > 0) {
                const selected = this.activeNoteId === note.id ? 'selected' : '';
                html += `<option value="${note.id}" ${selected}>${note.courseCode || note.subject}: ${note.title.substring(0, 35)}... (${note.flashcards.length})</option>`;
            }
        });
        select.innerHTML = html;
    },

    getTotalCardsAcrossAll(notes) {
        return notes.reduce((sum, n) => sum + (n.flashcards ? n.flashcards.length : 0), 0);
    },

    renderCard() {
        const cardElem = document.getElementById('activeFlashcard');
        const questionElem = document.getElementById('flashcardQuestion');
        const answerElem = document.getElementById('flashcardAnswer');
        const badgeElem = document.getElementById('flashcardSubjectBadge');
        const counterElem = document.getElementById('flashcardCounter');
        const progressElem = document.getElementById('flashcardProgress');

        if (!cardElem || this.currentDeck.length === 0) {
            if (questionElem) questionElem.innerText = "No flashcards found for this selection.";
            if (answerElem) answerElem.innerText = "Upload notes with flashcards or select another deck!";
            return;
        }

        // Reset flip state
        cardElem.classList.remove('flipped');

        const card = this.currentDeck[this.currentCardIndex];
        if (questionElem) questionElem.innerText = card.question;
        if (answerElem) answerElem.innerText = card.answer;
        if (badgeElem) badgeElem.innerText = card.subject || "StudySync Deck";
        if (counterElem) counterElem.innerText = `Card ${this.currentCardIndex + 1} of ${this.currentDeck.length}`;

        if (progressElem) {
            const percent = ((this.masteredCards.size) / this.currentDeck.length) * 100;
            progressElem.style.width = `${Math.min(100, Math.max(5, percent))}%`;
        }

        const masteredCounter = document.getElementById('masteredCounter');
        if (masteredCounter) {
            masteredCounter.innerText = `${this.masteredCards.size} Mastered`;
        }
    },

    nextCard() {
        if (this.currentDeck.length === 0) return;
        this.currentCardIndex = (this.currentCardIndex + 1) % this.currentDeck.length;
        this.renderCard();
    },

    prevCard() {
        if (this.currentDeck.length === 0) return;
        this.currentCardIndex = (this.currentCardIndex - 1 + this.currentDeck.length) % this.currentDeck.length;
        this.renderCard();
    },

    shuffleDeck() {
        for (let i = this.currentDeck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.currentDeck[i], this.currentDeck[j]] = [this.currentDeck[j], this.currentDeck[i]];
        }
        this.currentCardIndex = 0;
        this.renderCard();
        if (typeof showToast === 'function') {
            showToast('🔀 Flashcards shuffled!');
        }
    },

    markMastered() {
        if (this.currentDeck.length === 0) return;
        this.masteredCards.add(this.currentCardIndex);
        
        // Add points
        const user = StorageManager.getUserProfile();
        user.flashcardsMastered = (user.flashcardsMastered || 0) + 1;
        user.reputationPoints = (user.reputationPoints || 0) + 5;
        StorageManager.saveUserProfile(user);

        if (typeof showToast === 'function') {
            showToast('✨ Mastered! +5 Rep Points');
        }

        this.nextCard();
    },

    markReview() {
        if (this.currentDeck.length === 0) return;
        this.masteredCards.delete(this.currentCardIndex);
        this.nextCard();
    },

    // ----------------------------------------------------
    // QUIZ ENGINE
    // ----------------------------------------------------
    startQuiz(noteId) {
        const notes = StorageManager.getNotes();
        let questions = [];

        if (noteId && noteId !== 'all') {
            const note = notes.find(n => n.id === noteId);
            if (note && note.quiz) {
                questions = note.quiz.map(q => ({ ...q, subject: note.subject }));
            }
        }

        if (questions.length === 0) {
            // Aggregate all questions
            notes.forEach(n => {
                if (n.quiz) {
                    n.quiz.forEach(q => questions.push({ ...q, subject: n.subject }));
                }
            });
        }

        this.quizQuestions = questions;
        this.currentQuizIndex = 0;
        this.quizScore = 0;
        this.answeredQuestions = {};
        this.renderQuizQuestion();
    },

    renderQuizQuestion() {
        const container = document.getElementById('quizContainer');
        if (!container) return;

        if (this.quizQuestions.length === 0) {
            container.innerHTML = `
                <div class="text-center py-12">
                    <p class="text-slate-500 dark:text-slate-400">No quiz questions available for this topic yet.</p>
                </div>
            `;
            return;
        }

        // Quiz complete check
        if (this.currentQuizIndex >= this.quizQuestions.length) {
            this.renderQuizResults(container);
            return;
        }

        const q = this.quizQuestions[this.currentQuizIndex];
        const isAnswered = this.answeredQuestions.hasOwnProperty(this.currentQuizIndex);
        const selectedOption = this.answeredQuestions[this.currentQuizIndex];

        let optionsHtml = q.options.map((opt, idx) => {
            let btnClass = "border border-slate-200 dark:border-slate-700 hover:border-indigo-500 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200";
            let icon = `<span class="w-6 h-6 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center text-xs font-semibold mr-3">${String.fromCharCode(65 + idx)}</span>`;
            
            if (isAnswered) {
                if (idx === q.correctIndex) {
                    btnClass = "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-semibold";
                    icon = `<span class="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs mr-3">✓</span>`;
                } else if (idx === selectedOption) {
                    btnClass = "border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 font-semibold";
                    icon = `<span class="w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs mr-3">✕</span>`;
                } else {
                    btnClass = "opacity-50 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500";
                }
            }

            return `
                <button 
                    onclick="StudyEngine.selectQuizAnswer(${idx})" 
                    ${isAnswered ? 'disabled' : ''}
                    class="w-full text-left p-4 rounded-xl flex items-center transition-all ${btnClass}">
                    ${icon}
                    <span class="text-sm md:text-base">${opt}</span>
                </button>
            `;
        }).join('');

        let feedbackHtml = '';
        if (isAnswered) {
            const isCorrect = selectedOption === q.correctIndex;
            feedbackHtml = `
                <div class="mt-5 p-4 rounded-xl ${isCorrect ? 'bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 text-emerald-900 dark:text-emerald-200' : 'bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/50 text-rose-900 dark:text-rose-200'}">
                    <div class="flex items-center font-bold text-sm mb-1">
                        ${isCorrect ? '🎉 Correct!' : '💡 Explanation:'}
                    </div>
                    <p class="text-xs md:text-sm opacity-90">${q.explanation || 'Review the notes for deeper conceptual mastery.'}</p>
                </div>
            `;
        }

        container.innerHTML = `
            <div class="space-y-4">
                <div class="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <span class="px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/50">
                        ${q.subject || 'General Knowledge'}
                    </span>
                    <span>Question ${this.currentQuizIndex + 1} of ${this.quizQuestions.length}</span>
                </div>

                <h3 class="text-lg md:text-xl font-bold text-slate-900 dark:text-white leading-snug">
                    ${q.question}
                </h3>

                <div class="space-y-3 pt-2">
                    ${optionsHtml}
                </div>

                ${feedbackHtml}

                <div class="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                    <span class="text-xs text-slate-500 font-medium">Score: ${this.quizScore} / ${this.quizQuestions.length}</span>
                    ${isAnswered ? `
                        <button onclick="StudyEngine.nextQuizQuestion()" class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-indigo-500/20 transition-all flex items-center gap-2">
                            <span>${this.currentQuizIndex + 1 === this.quizQuestions.length ? 'View Results' : 'Next Question'}</span>
                            <span>→</span>
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    },

    selectQuizAnswer(index) {
        if (this.answeredQuestions.hasOwnProperty(this.currentQuizIndex)) return;

        this.answeredQuestions[this.currentQuizIndex] = index;
        const currentQ = this.quizQuestions[this.currentQuizIndex];
        if (index === currentQ.correctIndex) {
            this.quizScore++;
            const user = StorageManager.getUserProfile();
            user.reputationPoints = (user.reputationPoints || 0) + 10;
            StorageManager.saveUserProfile(user);
        }

        this.renderQuizQuestion();
    },

    nextQuizQuestion() {
        this.currentQuizIndex++;
        this.renderQuizQuestion();
    },

    renderQuizResults(container) {
        const percent = Math.round((this.quizScore / this.quizQuestions.length) * 100);
        let title = "Outstanding Job! 🏆";
        let message = "You've demonstrated a sharp grasp of these core concepts!";
        if (percent < 60) {
            title = "Keep Practicing! 📚";
            message = "Review the corresponding notes to reinforce these concepts and try again.";
        }

        StorageManager.recordStat('quizzesTaken', 1);

        container.innerHTML = `
            <div class="text-center py-8 space-y-4">
                <div class="w-20 h-20 mx-auto rounded-full bg-indigo-100 dark:bg-indigo-950/80 flex items-center justify-center text-4xl shadow-inner">
                    ${percent >= 80 ? '🌟' : (percent >= 60 ? '🎯' : '💡')}
                </div>
                <h3 class="text-2xl font-extrabold text-slate-900 dark:text-white">${title}</h3>
                <p class="text-slate-600 dark:text-slate-400 text-sm max-w-md mx-auto">${message}</p>

                <div class="inline-block p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                    <div class="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">${this.quizScore} / ${this.quizQuestions.length}</div>
                    <div class="text-xs uppercase tracking-wider text-slate-500 font-semibold mt-1">${percent}% Accuracy</div>
                </div>

                <div class="pt-4 flex flex-wrap items-center justify-center gap-3">
                    <button onclick="StudyEngine.startQuiz('${this.activeNoteId}')" class="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md transition">
                        Retake Quiz
                    </button>
                    <button onclick="document.getElementById('flashcardTabBtn').click()" class="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                        Study Flashcards
                    </button>
                </div>
            </div>
        `;
    }
};
