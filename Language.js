<script>
    let currentUser = localStorage.getItem("user") || null;
    const loginSection = document.getElementById("loginSection");
    const mainContent = document.getElementById("mainContent");

    if (currentUser) {
      loginSection.style.display = "none";
      mainContent.style.display = "block";
    }

    function login() {
      const name = document.getElementById("username").value;
      if (name.trim()) {
        localStorage.setItem("user", name);
        loginSection.style.display = "none";
        mainContent.style.display = "block";
      }
    }

    function logout() {
      localStorage.removeItem("user");
      localStorage.removeItem("score");
      localStorage.removeItem("total");
      location.reload();
    }

    function toggleMode() {
      document.body.classList.toggle("dark");
    }

    function speak(text, lang) {
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = lang || 'en';
      speechSynthesis.speak(utter);
    }

    function displayLanguage() {
      const lang = document.getElementById("language").value;
      const section = document.getElementById("content");
      const quizDiv = document.getElementById("quizSection");
      section.innerHTML = quizDiv.innerHTML = '';
      score = total = 0;
      document.getElementById("celebration").style.display = "none";
      updateScore();
      if (!lang || !data[lang]) return;
      const info = data[lang];
      section.innerHTML += `<h2>Alphabets</h2><p>${info.alphabets}</p>`;
      section.innerHTML += `<h2>Basic Words</h2>`;
      info.words.forEach(([en, local]) => {
        section.innerHTML += `<div class="word">${en} - ${local} <button onclick="speak('${local}')">🔊</button></div>`;
      });
      generateQuiz(lang);
    }

    let score = parseInt(localStorage.getItem("score")) || 0;
    let total = parseInt(localStorage.getItem("total")) || 0;
    let questions = 2;
    let timer;
    let timeLeft = 30;

    function generateQuiz(lang) {
      const quiz = document.getElementById("quizSection");
      const words = data[lang].words;
      startTimer();
      for (let i = 0; i < questions; i++) {
        const correctIndex = Math.floor(Math.random() * words.length);
        const options = [...words];
        options.sort(() => 0.5 - Math.random());
        const question = words[correctIndex];
        const questionDiv = document.createElement("div");
        questionDiv.className = "quiz-question";
        questionDiv.innerHTML = `<strong>What is the ${question[0]} in ${lang}?</strong>`;
        const btnsDiv = document.createElement("div");
        btnsDiv.className = "quiz-options";
        options.slice(0, 4).forEach(opt => {
          const btn = document.createElement("button");
          btn.textContent = opt[1];
          btn.onclick = () => {
            total++;
            if (opt[1] === question[1]) {
              btn.classList.add("correct");
              score++;
              speak(`Correct! ${question[0]} in ${lang} is ${question[1]}`, lang);
            } else {
              btn.classList.add("wrong");
              speak(`Wrong! The correct answer is ${question[1]}`, lang);
            }
            Array.from(btnsDiv.children).forEach(b => b.disabled = true);
            updateScore();
          };
          btnsDiv.appendChild(btn);
        });
        questionDiv.appendChild(btnsDiv);
        quiz.appendChild(questionDiv);
      }
    }

    function updateScore() {
      document.getElementById("scoreBoard").textContent = `Score: ${score} / ${total}`;
      localStorage.setItem("score", score);
      localStorage.setItem("total", total);
      if (total === questions) {
        document.getElementById("celebration").style.display = "block";
        clearInterval(timer);
      }
    }

    function startTimer() {
      timeLeft = 30;
      document.getElementById("timer").textContent = `⏱️ Time left: ${timeLeft}s`;
      clearInterval(timer);
      timer = setInterval(() => {
        timeLeft--;
        document.getElementById("timer").textContent = `⏱️ Time left: ${timeLeft}s`;
        if (timeLeft <= 0) {
          clearInterval(timer);
          document.getElementById("quizSection").innerHTML += '<p><strong>Time is up!</strong></p>';
          Array.from(document.querySelectorAll(".quiz-options button")).forEach(b => b.disabled = true);
        }
      }, 1000);
    }

    const data = {
      english: {
        alphabets: "A B C D E F G H I J K L M N O P Q R S T U V W X Y Z",
        words: [["Hello", "Hello"], ["Thank you", "Thank you"], ["Yes", "Yes"], ["No", "No"], ["Please", "Please"], ["Sorry", "Sorry"], ["Goodbye", "Goodbye"], ["Morning", "Morning"], ["Night", "Night"], ["Food", "Food"]]
      },
      spanish: {
        alphabets: "A B C D E F G H I J K L LL M N Ñ O P Q R S T U V W X Y Z",
        words: [["Hello", "Hola"], ["Thank you", "Gracias"], ["Yes", "Sí"], ["No", "No"], ["Please", "Por favor"], ["Sorry", "Lo siento"], ["Goodbye", "Adiós"], ["Morning", "Mañana"], ["Night", "Noche"], ["Food", "Comida"]]
      },
      french: {
        alphabets: "A B C D E F G H I J K L M N O P Q R S T U V W X Y Z",
        words: [["Hello", "Bonjour"], ["Thank you", "Merci"], ["Yes", "Oui"], ["No", "Non"], ["Please", "S'il vous plaît"], ["Sorry", "Pardon"], ["Goodbye", "Au revoir"], ["Morning", "Matin"], ["Night", "Nuit"], ["Food", "Nourriture"]]
      },
      tamil: {
        alphabets: "அ ஆ இ ஈ உ ஊ எ ஏ ஐ ஒ ஓ ஔ ங ச ஜ ட ண த ந ப ம ய ர ல வ ழ ள ற ன",
        words: [["Hello", "வணக்கம்"], ["Thank you", "நன்றி"], ["Yes", "ஆம்"], ["No", "இல்லை"], ["Please", "தயவு செய்து"], ["Sorry", "மன்னிக்கவும்"], ["Goodbye", "போய் வருகிறேன்"], ["Morning", "காலை"], ["Night", "இரவு"], ["Food", "உணவு"]]
      },
      hindi: {
        alphabets: "अ आ इ ई उ ऊ ए ऐ ओ औ क ख ग घ च छ ज झ ट ठ ड ढ त थ द ध न प फ ब भ म य र ल व श ष स ह",
        words: [["Hello", "नमस्ते"], ["Thank you", "धन्यवाद"], ["Yes", "हाँ"], ["No", "नहीं"], ["Please", "कृपया"], ["Sorry", "माफ़ कीजिए"], ["Goodbye", "अलविदा"], ["Morning", "सुबह"], ["Night", "रात"], ["Food", "भोजन"]]
      },
      russian: {
        alphabets: "А Б В Г Д Е Ё Ж З И Й К Л М Н О П Р С Т У Ф Х Ц Ч Ш Щ Ъ Ы Ь Э Ю Я",
        words: [["Hello", "Здравствуйте"], ["Thank you", "Спасибо"], ["Yes", "Да"], ["No", "Нет"], ["Please", "Пожалуйста"], ["Sorry", "Извините"], ["Goodbye", "До свидания"], ["Morning", "Утро"], ["Night", "Ночь"], ["Food", "Еда"]]
      },
      arabic: {
        alphabets: "ا ب ت ث ج ح خ د ذ ر ز س ش ص ض ط ظ ع غ ف ق ك ل م ن ه و ي",
        words: [["Hello", "مرحبا"], ["Thank you", "شكرا"], ["Yes", "نعم"], ["No", "لا"], ["Please", "من فضلك"], ["Sorry", "آسف"], ["Goodbye", "مع السلامة"], ["Morning", "صباح"], ["Night", "ليل"], ["Food", "طعام"]]
      },
      german: {
        alphabets: "A Ä B C D E F G H I J K L M N O Ö P Q R S T U Ü V W X Y Z",
        words: [["Hello", "Hallo"], ["Thank you", "Danke"], ["Yes", "Ja"], ["No", "Nein"], ["Please", "Bitte"], ["Sorry", "Entschuldigung"], ["Goodbye", "Auf Wiedersehen"], ["Morning", "Morgen"], ["Night", "Nacht"], ["Food", "Essen"]]
      }
    };
    </script>