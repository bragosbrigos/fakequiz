import React, { useState, useEffect } from 'react'
import HomePage from './components/HomePage'
import Questions from './components/Questions'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState(() => {
    const path = window.location.pathname
    return (path === '/quiz' || path === '/quiz/') ? 'quiz' : 'home'
  })

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname
      setCurrentPage((path === '/quiz' || path === '/quiz/') ? 'quiz' : 'home')
    }

    const handleNavigation = () => {
      const path = window.location.pathname
      setCurrentPage((path === '/quiz' || path === '/quiz/') ? 'quiz' : 'home')
    }

    window.addEventListener('popstate', handlePopState)
    window.addEventListener('navigation', handleNavigation)

    return () => {
      window.removeEventListener('popstate', handlePopState)
      window.removeEventListener('navigation', handleNavigation)
    }
  }, [])

  if (currentPage === 'quiz') {
    return <Questions />
  }

  return <HomePage />
}

export default App

