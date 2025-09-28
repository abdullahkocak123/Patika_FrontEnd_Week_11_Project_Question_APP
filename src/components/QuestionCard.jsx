import "../styles/QuestionCard.css";

function QuestionCard({ question, onAnswer, showOptions }) {
  return (
    <div className="question-card">
      <h2 className="question-text">{question.question}</h2>

      <img
        src={`/assets/${question.media}`}
        alt="question"
        className="question-image"
      />

      {!showOptions ? (
        <p className="wait-msg">Şıklar hazırlanıyor... ⏳</p>
      ) : (
        <div className="options">
          {question.options.map((option, index) => (
            <button
              key={index}
              className="option-btn"
              onClick={() => onAnswer(option)}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default QuestionCard;
