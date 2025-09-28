import { useState, useEffect, useRef } from "react";
import questions from "./data/questions";
import QuestionCard from "./components/QuestionCard";
import "./styles/App.css";

function App() {
  //for info page, before starting questions
  const [start, setStart] = useState(false);
  //for questions
  const [currentIndex, setCurrentIndex] = useState(0);
  //for timer per question (30 seconds)
  const [timeLeft, setTimeLeft] = useState(30);
  //for options to be appeared after 4 seconds
  const [showOptions, setShowOptions] = useState(false);
  //for answers to be choosen
  const [answers, setAnswers] = useState([]); // {questionIndex, answer, status}
  //for finishing questions
  const [isFinished, setIsFinished] = useState(false);

  //to keep which question is answered: (otherwise 1 quesiton will be skipped for empty answer)
  const answeredRef = useRef(new Set());

  useEffect(() => {
    if (start && !isFinished) {
      setTimeLeft(30);
      setShowOptions(false);

      //after 4 seconds, show choises
      const showTimer = setTimeout(() => setShowOptions(true), 4000);

      //countdown started
      const countdown = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === 0) {
            clearInterval(countdown);
            handleAnswer(null); //time is up, answer is empty
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        clearTimeout(showTimer);
        clearInterval(countdown);
      };
    }
  }, [start, currentIndex, isFinished]);

  const handleAnswer = (selected) => {
    //If the answer had been marked as answered, the function should not continue. This is critical, because in case of empty answer, code will skip next question because function will be called twice, which is a feature of React's double render problem.
    if (answeredRef.current.has(currentIndex)) {
      return;
    }
    answeredRef.current.add(currentIndex);

    const currentQuestion = questions[currentIndex];
    let status = "empty";

    if (selected !== null) {
      status = selected === currentQuestion.answer ? "correct" : "wrong";
    }

    setAnswers((prev) => [
      ...prev,
      { questionIndex: currentIndex, answer: selected, status },
    ]);

    // next question
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  //calculating results
  const correctAnswers = answers.filter((x) => x.status === "correct").length;
  const wrongAnswers = answers.filter((x) => x.status === "wrong").length;
  const emptyAnswers = answers.filter((x) => x.status === "empty").length;

  return (
    <div className="app-container">
      {!start ? (
        // Info page
        <div className="welcome-screen">
          <h1>Bilgi Yarışmasına Hoşgeldiniz!</h1>
          <p>
            Bu testte birbirinden ilginç ve eğlenceli sorular sizi bekliyor. Her
            soru için 30 saniyeniz var. Hazır olduğunuzda başlayabilirsiniz.
          </p>
          <button className="start-btn" onClick={() => setStart(true)}>
            Teste Başla
          </button>
        </div>
      ) : !isFinished ? (
        // Questions screen
        <>
          <div className="progress">
            Soru {currentIndex + 1} / {questions.length} - Kalan Süre:{" "}
            {timeLeft} s
          </div>
          <QuestionCard
            question={questions[currentIndex]}
            onAnswer={handleAnswer}
            showOptions={showOptions}
          />
        </>
      ) : (
        // Results screen
        <div className="result-screen">
          <h2>Sorular Bitti</h2>
          <p>Toplam Soru: {questions.length}</p>
          <p>Doğru: {correctAnswers} </p>
          <p>Yanlış: {wrongAnswers} </p>
          <p>Boş: {emptyAnswers} </p>

          <h3>Detaylı Sonuçlar:</h3>
          <ul>
            {questions.map((q, idx) => {
              const userAnswer = answers.find((a) => a.questionIndex === idx);
              return (
                <li key={idx}>
                  <strong>{q.question}</strong>
                  <br />
                  Doğru cevap: {q.answer}
                  <br />
                  Senin cevabın: {userAnswer?.answer ? userAnswer.answer : "—"}
                  {" ("}
                  {userAnswer?.status === "correct"
                    ? "Doğru"
                    : userAnswer?.status === "wrong"
                    ? "Yanlış"
                    : "Boş"}
                  {")"}
                  <hr />
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
