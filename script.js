
  // Firebase Configuration

const firebaseConfig = {
  apiKey: "AIzaSyDkjqExSrQ9jfE5yV8ZclUoyScOMlhhoEE",
  authDomain: "brainrush-c81b5.firebaseapp.com",
  projectId: "brainrush-c81b5",
  storageBucket: "brainrush-c81b5.firebasestorage.app",
  messagingSenderId: "513162384553",
  appId: "1:513162384553:web:b51be84a5cb3411d1d45b8"
};

// Gemini API Key

const GEMINI_API_KEY = 'AIzaSyCpori7r98dZfVWOtvB7DFze9JRDbBYskM'; // Replace with your actual key (secure in production, e.g., Firebase Config)

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// DOM elements
const screens = {
  auth: document.getElementById('auth'),
  welcome: document.getElementById('welcome'),
  dashboard: document.getElementById('dashboard'),
  courseUpload: document.getElementById('course-upload'),
  game: document.getElementById('game'),
  assessment: document.getElementById('assessment')
};

const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');
const authStatus = document.getElementById('auth-status');
const playNowBtn = document.getElementById('play-now-btn');
const assessmentBtn = document.getElementById('assessment-btn');
const createCourseBtn = document.getElementById('create-course-btn');
const courseForm = document.getElementById('course-form');
const currentCourseName = document.getElementById('current-course-name');
const moduleUploadForm = document.getElementById('module-upload-form');
const moduleStatus = document.getElementById('module-status');
const modulesList = document.getElementById('modules-list');
const backToDashboard = document.getElementById('back-to-dashboard');
const gameContainer = document.getElementById('game-container');
const gameQuestion = document.getElementById('game-question');
const gameOptions = document.getElementById('game-options');
const gameFeedback = document.getElementById('game-feedback');
const gameScore = document.getElementById('game-score');
const gameTimer = document.getElementById('game-timer');
const nextQuestionBtn = document.getElementById('next-question');
const endGameBtn = document.getElementById('end-game');
const backToDashboardGame = document.getElementById('back-to-dashboard-game');
const assessmentForm = document.getElementById('assessment-form');
const assessmentCourse = document.getElementById('assessment-course');
const assessmentModule = document.getElementById('assessment-module');
const testOutput = document.getElementById('test-output');
const backToDashboardAssess = document.getElementById('back-to-dashboard-assess');
const logoutBtn = document.getElementById('logout-btn');
const friendsList = document.getElementById('friends-list');
const coursesList = document.getElementById('courses-list');
const assessmentsList = document.getElementById('assessments-list');

// Game state
let currentUser = null;
let currentCourse = null;
let userData = { courses: [], assessments: [], friends: [] };
let currentGame = { questions: [], currentIndex: 0, score: 0, timer: null };

// Screen navigation
function showScreen(screenId) {
  Object.values(screens).forEach(screen => screen.style.display = 'none');
  screens[screenId].style.display = 'flex';
}

// Auth listeners
auth.onAuthStateChanged((user) => {
  if (user) {
    currentUser = user;
    loadUserData();
    showScreen('welcome');
  } else {
    currentUser = null;
    showScreen('auth');
  }
});

// Register form
registerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('reg-email').value;
  const password = document.getElementById('reg-password').value;
  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      authStatus.textContent = 'Account created successfully!';
      db.collection('users').doc(userCredential.user.uid).set({
        email: email,
        courses: [],
        assessments: [],
        friends: [], // Mock empty friends list
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    })
    .catch((error) => {
      authStatus.textContent = `Error: ${error.message}`;
    });
});

// Login form
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  auth.signInWithEmailAndPassword(email, password)
    .catch((error) => {
      authStatus.textContent = `Error: ${error.message}`;
    });
});

// Load user data
async function loadUserData() {
  if (!currentUser) return;
  try {
    const doc = await db.collection('users').doc(currentUser.uid).get();
    if (doc.exists) {
      userData = { ...doc.data(), uid: currentUser.uid };
      renderDashboard();
      updateSelects();
    }
  } catch (error) {
    console.error('Error loading user data:', error);
  }
}

// Render dashboard
function renderDashboard() {
  friendsList.innerHTML = userData.friends.length ? userData.friends.map(f => `<li>${f.name} - Progress: ${f.progress}%</li>`).join('') : '<li>No friends yet</li>';
  coursesList.innerHTML = userData.courses.length ? userData.courses.map(c => `
    <div class="course-item">
      <h4>${c.name}</h4>
      <ul>${c.modules.map(m => `<li>${m.name} - Progress: <div class="progress-bar"><div class="progress-fill" style="width: ${m.progress || 0}%"></div></div></li>`).join('')}</ul>
    </div>
  `).join('') : '<p>No courses yet</p>';
  assessmentsList.innerHTML = userData.assessments.length ? userData.assessments.map(a => `
    <div class="assessment-item">
      <p>${a.module} - Score: ${a.score}/100 - Date: ${a.date}</p>
    </div>
  `).join('') : '<p>No assessments yet</p>';
}

// Update course/module selects
function updateSelects() {
  const courseSelect = document.getElementById('course-select');
  const moduleSelect = document.getElementById('module-select');
  courseSelect.innerHTML = '<option value="" disabled selected>Choose a course</option>' + userData.courses.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
  assessmentCourse.innerHTML = courseSelect.innerHTML;

  courseSelect.addEventListener('change', (e) => {
    const course = userData.courses.find(c => c.id === e.target.value);
    moduleSelect.innerHTML = '<option value="" disabled selected>Choose a module</option>' + (course ? course.modules.map(m => `<option value="${m.id}">${m.name}</option>`).join('') : '');
  });

  assessmentCourse.addEventListener('change', (e) => {
    const course = userData.courses.find(c => c.id === e.target.value);
    assessmentModule.innerHTML = '<option value="" disabled selected>Choose a module</option>' + (course ? course.modules.map(m => `<option value="${m.id}">${m.name}</option>`).join('') : '');
  });
}

// Create course
createCourseBtn.addEventListener('click', () => showScreen('course-upload'));

courseForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const courseName = document.getElementById('course-name').value;
  if (currentUser && courseName) {
    const courseId = db.collection('users').doc(currentUser.uid).collection('courses').doc().id;
    await db.collection('users').doc(currentUser.uid).update({
      courses: firebase.firestore.FieldValue.arrayUnion({ id: courseId, name: courseName, modules: [] })
    });
    currentCourse = { id: courseId, name: courseName, modules: [] };
    currentCourseName.textContent = courseName;
    document.getElementById('course-form').style.display = 'none';
    document.getElementById('course-modules').style.display = 'block';
    loadUserData();
  }
});

// Upload module
moduleUploadForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const file = document.getElementById('module-upload').files[0];
  const moduleName = document.getElementById('module-name').value;

  if (file && moduleName && currentCourse) {
    moduleStatus.textContent = `Processing ${file.name}...`;
    try {
     
      // Example: Deploy a Cloud Function or use a third-party service like pdf2json
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('https://your-backend-endpoint/parse-pdf', { // Replace with your actual endpoint
        method: 'POST',
        body: formData
      });
      if (!response.ok) throw new Error('Failed to parse PDF');
      const { extractedText } = await response.json();

      // Generate study cards with Gemini
      const prompt = `Generate exactly 10 concise question-answer pairs for a study quiz based on this text from a module on "${moduleName}". 
Make questions challenging but fair for exam prep. Return ONLY valid JSON in this exact format, no extra text: 
{
  "studyCards": [
    { "question": "Your question here?", "answer": "Concise answer here." },
    // ... repeat for 10 pairs
  ]
}`;

      const geminiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt + '\n\nSource text: ' + extractedText.substring(0, 10000),
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 2048,
            },
            safetySettings: [
              {
                category: 'HARM_CATEGORY_HARASSMENT',
                threshold: 'BLOCK_MEDIUM_AND_ABOVE',
              },
              {
                category: 'HARM_CATEGORY_HATE_SPEECH',
                threshold: 'BLOCK_MEDIUM_AND_ABOVE',
              },
              {
                category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                threshold: 'BLOCK_MEDIUM_AND_ABOVE',
              },
              {
                category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
                threshold: 'BLOCK_MEDIUM_AND_ABOVE',
              },
            ],
          }),
        }
      );

      if (!geminiResponse.ok) {
        throw new Error(`Gemini API error: ${geminiResponse.status} - ${await geminiResponse.text()}`);
      }

      const geminiData = await geminiResponse.json();
      if (!geminiData.candidates || !geminiData.candidates[0]?.content?.parts[0]?.text) {
        throw new Error('Invalid response from Gemini');
      }

      let responseText = geminiData.candidates[0].content.parts[0].text;
      let studyCards;
      try {
        const jsonMatch = responseText.match(/\{.*\}/s);
        studyCards = JSON.parse(jsonMatch ? jsonMatch[0] : responseText).studyCards;
      } catch (parseError) {
        throw new Error(`Failed to parse JSON from Gemini: ${parseError.message}. Raw: ${responseText}`);
      }

      const moduleId = db.collection('users').doc(currentUser.uid).collection('courses').doc(currentCourse.id).collection('modules').doc().id;

      await db.collection('users').doc(currentUser.uid).update({
        courses: firebase.firestore.FieldValue.arrayRemove(currentCourse),
        courses: firebase.firestore.FieldValue.arrayUnion({
          ...currentCourse,
          modules: [...currentCourse.modules, { id: moduleId, name: moduleName, cards: studyCards, progress: 0 }]
        })
      });

      modulesList.innerHTML += `<li>${moduleName} - Generated ${studyCards.length} cards</li>`;
      moduleStatus.textContent = 'Module uploaded successfully!';
      loadUserData();
    } catch (error) {
      moduleStatus.textContent = `Error: ${error.message}`;
      console.error('Module upload error:', error);
    }
  }
});

// Game logic
playNowBtn.addEventListener('click', () => {
  showScreen('game');
  gameContainer.innerHTML = `
    <form id="game-setup-form">
      <label for="course-select">Select Course:</label>
      <select id="course-select" required>
        <option value="" disabled selected>Choose a course</option>
      </select>
      <label for="module-select">Select Topic (Module):</label>
      <select id="module-select" required>
        <option value="" disabled selected>Choose a module</option>
      </select>
      <label for="question-count">Number of Questions:</label>
      <input type="number" id="question-count" min="1" max="50" value="10" required>
      <button type="submit">Start Game</button>
    </form>
  `;
  updateSelects();
});

document.addEventListener('submit', (e) => {
  if (e.target.id === 'game-setup-form') {
    e.preventDefault();
    const courseId = document.getElementById('course-select').value;
    const moduleId = document.getElementById('module-select').value;
    const questionCount = parseInt(document.getElementById('question-count').value);

    if (courseId && moduleId && questionCount) {
      const course = userData.courses.find(c => c.id === courseId);
      const module = course.modules.find(m => m.id === moduleId);
      if (module && module.cards.length >= questionCount) {
        currentGame.questions = shuffle(module.cards.slice(0, questionCount)).map(q => ({
          ...q,
          options: [q.answer, ...generateWrongAnswers(q.answer, module.cards)]
        }));
        currentGame.currentIndex = 0;
        currentGame.score = 0;
        startGame();
      } else {
        gameFeedback.textContent = 'Insufficient cards.';
      }
    }
  }
});

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function generateWrongAnswers(correctAnswer, cards) {
  const wrong = [];
  const allAnswers = cards.map(c => c.answer).filter(a => a !== correctAnswer);
  while (wrong.length < 3 && allAnswers.length > 0) {
    const idx = Math.floor(Math.random() * allAnswers.length);
    wrong.push(allAnswers.splice(idx, 1)[0]);
  }
  return shuffle(wrong).slice(0, 3);
}

function startGame() {
  gameContainer.style.display = 'block';
  nextQuestionBtn.style.display = 'inline-block';
  endGameBtn.style.display = 'inline-block';
  displayQuestion();
  startTimer();
}

function displayQuestion() {
  const q = currentGame.questions[currentGame.currentIndex];
  gameQuestion.textContent = q.question;
  gameOptions.innerHTML = shuffle([q.answer, ...q.options]).map(opt => `
    <div class="game-option" data-answer="${opt === q.answer}">${opt}</div>
  `).join('');
  gameScore.textContent = `Score: ${currentGame.score}`;
  gameFeedback.textContent = '';
  gameOptions.querySelectorAll('.game-option').forEach(opt => {
    opt.addEventListener('click', handleAnswer);
  });
}

function handleAnswer(e) {
  const isCorrect = e.target.dataset.answer === 'true';
  gameFeedback.textContent = isCorrect ? 'Correct!' : 'Incorrect!';
  if (isCorrect) currentGame.score++;
  gameScore.textContent = `Score: ${currentGame.score}`;
  gameOptions.querySelectorAll('.game-option').forEach(opt => opt.removeEventListener('click', handleAnswer));
  clearInterval(currentGame.timer);
}

function startTimer() {
  let time = 30;
  gameTimer.textContent = `Time: ${time}s`;
  currentGame.timer = setInterval(() => {
    time--;
    gameTimer.textContent = `Time: ${time}s`;
    if (time <= 0) {
      clearInterval(currentGame.timer);
      gameFeedback.textContent = 'Time’s up!';
      gameOptions.querySelectorAll('.game-option').forEach(opt => opt.removeEventListener('click', handleAnswer));
    }
  }, 1000);
}

nextQuestionBtn.addEventListener('click', () => {
  currentGame.currentIndex++;
  if (currentGame.currentIndex < currentGame.questions.length) {
    displayQuestion();
    startTimer();
  } else {
    endGame();
  }
});

endGameBtn.addEventListener('click', endGame);

async function endGame() {
  clearInterval(currentGame.timer);
  const courseId = document.getElementById('course-select').value;
  const moduleId = document.getElementById('module-select').value;
  const progress = Math.round((currentGame.score / currentGame.questions.length) * 100);
  gameContainer.innerHTML = `<p>Game Over! Final Score: ${currentGame.score}/${currentGame.questions.length} (${progress}%)</p>`;
  await updateProgress(courseId, moduleId, progress);
}

async function updateProgress(courseId, moduleId, progress) {
  const course = userData.courses.find(c => c.id === courseId);
  const updatedModules = course.modules.map(m => m.id === moduleId ? { ...m, progress } : m);
  await db.collection('users').doc(currentUser.uid).update({
    courses: firebase.firestore.FieldValue.arrayRemove(course),
    courses: firebase.firestore.FieldValue.arrayUnion({ ...course, modules: updatedModules })
  });
  loadUserData();
}

backToDashboardGame.addEventListener('click', () => showScreen('dashboard'));

// Assessment
assessmentBtn.addEventListener('click', () => {
  showScreen('assessment');
  updateSelects();
});

assessmentForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const courseId = assessmentCourse.value;
  const moduleId = assessmentModule.value;
  const numQuestions = parseInt(document.getElementById('test-questions').value);

  if (courseId && moduleId && numQuestions) {
    const course = userData.courses.find(c => c.id === courseId);
    const module = course.modules.find(m => m.id === moduleId);
    if (module.cards.length >= numQuestions) {
      const testQuestions = shuffle(module.cards.slice(0, numQuestions));
      testOutput.innerHTML = testQuestions.map((q, i) => `
        <div class="test-question">
          <p><strong>Q${i+1}:</strong> ${q.question}</p>
          <input type="text" placeholder="Your answer" data-answer="${q.answer}">
        </div>
      `).join('') + '<button id="submit-test">Submit Test</button>';

      document.getElementById('submit-test').addEventListener('click', async () => {
        let score = 0;
        testOutput.querySelectorAll('input').forEach(input => {
          if (input.value.toLowerCase().includes(input.dataset.answer.toLowerCase())) score++;
        });
        const finalScore = Math.round((score / numQuestions) * 100);
        const assessId = Date.now();
        await db.collection('users').doc(currentUser.uid).update({
          assessments: firebase.firestore.FieldValue.arrayUnion({
            id: assessId,
            module: module.name,
            score: finalScore,
            date: new Date().toLocaleDateString()
          })
        });
        testOutput.innerHTML += `<p><strong>Score: ${finalScore}/100</strong></p>`;
        loadUserData();
      });
    } else {
      testOutput.innerHTML = '<p>Insufficient cards for test.</p>';
    }
  }
});

backToDashboardAssess.addEventListener('click', () => showScreen('dashboard'));

// Logout
logoutBtn.addEventListener('click', () => auth.signOut());

// Floating animations
document.querySelectorAll('.welcome-catchphrase span, .slogan span').forEach((element, index) => {
  element.style.animationDelay = `${index * 0.3}s`;
});