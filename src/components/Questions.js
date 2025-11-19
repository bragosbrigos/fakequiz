import React, { useState } from 'react'
import './Questions.css'

export default function Questions() {
  const questions = [
    {
      title:
        'Uma manchete sensacionalista como "ISSO VAI EXPLODIR SUA MENTE!" é um sinal de alerta para fake news?',
      correctAnswer: "A",
      alternativa1: "Sim, pois apela para o emocional e não à razão.",
      alternativa2: "Não, pois é comum em notícias reais.",
      explanation: "Manchetes sensacionalistas são um sinal de alerta porque apelam para emoções em vez de fatos, uma característica comum de fake news.",
    },
    {
      title:
        'Notícias falsas frequentemente usam URLs que imitam sites confiáveis (ex.: "g1.com.br" vs "g1-noticias.com"). Isso é verdadeiro?',
      correctAnswer: "A",
      alternativa1: "Verdadeiro.",
      alternativa2: "Falso.",
      explanation: "Criadores de fake news frequentemente usam URLs similares a sites confiáveis para enganar os leitores e parecerem legítimos.",
    },
    {
      title:
        'Se uma notícia cita "um estudo de Harvard", mas não linka o estudo, você deve:',
      correctAnswer: "B",
      alternativa1: "Confiar, pois Harvard é confiável.",
      alternativa2: "Desconfiar e buscar a fonte original.",
      alternativa3: "Compartilhar imediatamente.",
      explanation: "Mesmo que a fonte seja confiável, sempre devemos verificar se o estudo realmente existe e se foi citado corretamente. Sem link, não há como confirmar.",
    },
    {
      title:
        'Um perfil anônimo no Twitter posta uma notícia bombástica. Você:',
      correctAnswer: "B",
      alternativa1: "Confia, pois viralizou.",
      alternativa2: "Verifica em sites oficiais antes de compartilhar.",
      alternativa3: "Compartilha porque concorda com o conteúdo.",
      explanation: "Perfis anônimos não têm credibilidade e viralização não significa veracidade. Sempre verifique em fontes oficiais antes de compartilhar.",
    },
    {
      title:
        'Vídeos que mostram "supostos ataques" sem data, local ou fonte visível são:',
      correctAnswer: "B",
      alternativa1: "Sempre confiáveis.",
      alternativa2: "Potencialmente manipulados ou fora de contexto.",
      alternativa3: "Raros na internet.",
      explanation: "Vídeos sem contexto (data, local, fonte) são frequentemente manipulados ou tirados de contexto para enganar. Sempre desconfie de conteúdo sem informações claras.",
    },
    {
      title:
        'Fake news frequentemente apelam para:',
      correctAnswer: "A",
      alternativa1: "Emoções como medo e raiva.",
      alternativa2: "Fatos científicos complexos.",
      alternativa3: "Linguagem técnica e neutra.",
      explanation: "Fake news exploram emoções fortes como medo e raiva para fazer as pessoas compartilharem sem verificar. Notícias verdadeiras usam linguagem mais neutra e factual.",
    },
    {
      title:
        'Denunciar fake news nas redes sociais ajuda a:',
      correctAnswer: "B",
      alternativa1: "Nada, pois não tem efeito.",
      alternativa2: "Reduzir a disseminação e alertar plataformas.",
      alternativa3: "Aumentar o engajamento da notícia.",
      explanation: "Denunciar fake news ajuda as plataformas a identificarem e removerem conteúdo falso, reduzindo sua disseminação e protegendo outros usuários.",
    },
    {
      title:
        'Notícias falsas sempre têm erros de português.',
      correctAnswer: "B",
      alternativa1: "Verdadeiro.",
      alternativa2: "Falso.",
      explanation: "Muitas fake news são bem escritas e sem erros de português. Não use isso como critério único para identificar fake news.",
    },
    {
      title:
        'WhatsApp é uma fonte confiável de notícias.',
      correctAnswer: "B",
      alternativa1: "Verdadeiro.",
      alternativa2: "Falso.",
      explanation: "WhatsApp é uma plataforma de mensagens, não uma fonte de notícias. Qualquer pessoa pode compartilhar informações lá, incluindo fake news.",
    },
    {
      title:
        'Notícias antigas compartilhadas como recentes são uma forma de desinformação.',
      correctAnswer: "A",
      alternativa1: "Verdadeiro.",
      alternativa2: "Falso.",
      explanation: "Compartilhar notícias antigas como se fossem recentes é uma tática comum de desinformação para manipular a opinião pública sobre eventos atuais.",
    },
  ]

  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [showScore, setShowScore] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showFeedback, setShowFeedback] = useState(false)

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer)
    setShowFeedback(true)

    const isCorrect = answer === questions[index].correctAnswer
    if (isCorrect) {
      setScore(score + 1)
    }
  }

  const handleNextQuestion = () => {
    if (index < questions.length - 1) {
      setIndex(index + 1)
      setSelectedAnswer(null)
      setShowFeedback(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      setShowScore(true)
    }
  }

  const handleReset = () => {
    setIndex(0)
    setScore(0)
    setShowScore(false)
    setSelectedAnswer(null)
    setShowFeedback(false)
  }

  const handleBackHome = () => {
    window.history.pushState({}, '', '/')
    window.dispatchEvent(new Event('navigation'))
  }

  if (showScore) {
    const percentage = Math.round((score / questions.length) * 100)
    
    return (
      <div className="quiz-container">
        <div className="result-card">
          <div className="result-icon">
            {percentage >= 70 ? '🎉' : percentage >= 50 ? '👍' : '💡'}
          </div>
          <h2 className="result-title">Resultado</h2>
          <p className="result-text">
            Você acertou <strong>{score}</strong> de <strong>{questions.length}</strong> questões.
          </p>
          <div className="result-percentage">
            {percentage}% de acerto
          </div>
          <div className="result-buttons">
            <button className="btn btn-primary" onClick={handleReset}>
              Reiniciar Quiz
            </button>
            <button className="btn btn-secondary" onClick={handleBackHome}>
              Voltar ao Início
            </button>
          </div>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[index]

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <div className="quiz-progress-bar">
          <div 
            className="quiz-progress-fill" 
            style={{ width: `${((index + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
        <p className="quiz-progress">
          Pergunta {index + 1} de {questions.length}
        </p>
      </div>

      <div className="quiz-content">
        <h2 className="quiz-title">{currentQuestion.title}</h2>

        <div className="quiz-options">
          <button
            className={`option-btn ${showFeedback 
              ? (selectedAnswer === "A" 
                ? (currentQuestion.correctAnswer === "A" ? "correct" : "incorrect")
                : (currentQuestion.correctAnswer === "A" ? "show-correct" : ""))
              : ""}`}
            onClick={() => handleAnswer("A")}
            disabled={showFeedback}
          >
            <span className="option-letter">A</span>
            <span className="option-text">{currentQuestion.alternativa1}</span>
          </button>

          <button
            className={`option-btn ${showFeedback 
              ? (selectedAnswer === "B" 
                ? (currentQuestion.correctAnswer === "B" ? "correct" : "incorrect")
                : (currentQuestion.correctAnswer === "B" ? "show-correct" : ""))
              : ""}`}
            onClick={() => handleAnswer("B")}
            disabled={showFeedback}
          >
            <span className="option-letter">B</span>
            <span className="option-text">{currentQuestion.alternativa2}</span>
          </button>

          {currentQuestion.alternativa3 && (
            <button
              className={`option-btn ${showFeedback 
                ? (selectedAnswer === "C" 
                  ? (currentQuestion.correctAnswer === "C" ? "correct" : "incorrect")
                  : (currentQuestion.correctAnswer === "C" ? "show-correct" : ""))
                : ""}`}
              onClick={() => handleAnswer("C")}
              disabled={showFeedback}
            >
              <span className="option-letter">C</span>
              <span className="option-text">{currentQuestion.alternativa3}</span>
            </button>
          )}
        </div>

        {showFeedback && (
          <>
            <div className={`feedback ${selectedAnswer === currentQuestion.correctAnswer ? "feedback-correct" : "feedback-incorrect"}`}>
              {selectedAnswer === currentQuestion.correctAnswer ? (
                <>
                  <span className="feedback-icon">✓</span>
                  <span className="feedback-text">Resposta correta!</span>
                </>
              ) : (
                <>
                  <span className="feedback-icon">✗</span>
                  <div className="feedback-content">
                    <span className="feedback-text">Resposta incorreta.</span>
                    {currentQuestion.explanation && (
                      <p className="feedback-explanation">{currentQuestion.explanation}</p>
                    )}
                  </div>
                </>
              )}
            </div>
            <button className="btn-next" onClick={handleNextQuestion}>
              {index < questions.length - 1 ? "Próxima Pergunta" : "Ver Resultado"}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

