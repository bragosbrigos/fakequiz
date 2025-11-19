import React from 'react'
import { FaLightbulb } from 'react-icons/fa'
import './HomePage.css'

const HomePage = () => {
  const handleStartQuiz = () => {
    window.history.pushState({}, '', '/quiz')
    window.dispatchEvent(new Event('navigation'))
  }

  return (
    <div className="home-container">
      <div className="home-content">
        <div className="logo">
          <div className="logo-icon">
            <FaLightbulb />
          </div>
          <h1>Fake Quiz</h1>
        </div>

        <h2 className="title">
          Você consegue identificar
          <span className="highlight"> Fake News</span>?
        </h2>

        <p className="description">
          Teste seus conhecimentos e aprenda a distinguir informações verdadeiras 
          de notícias falsas.
        </p>

        <button className="start-button" onClick={handleStartQuiz}>
          Começar Quiz
        </button>
      </div>
    </div>
  )
}

export default HomePage

