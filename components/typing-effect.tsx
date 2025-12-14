"use client"

import { useState, useEffect } from "react"

interface TypingEffectProps {
  words: string[]
  speed?: number
  deleteSpeed?: number
  pauseTime?: number
  className?: string
}

export function TypingEffect({ 
  words, 
  speed = 150, 
  deleteSpeed = 80,
  pauseTime = 2000,
  className = ""
}: TypingEffectProps) {
  const [text, setText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [loopNum, setLoopNum] = useState(0)
  const [typingSpeed, setTypingSpeed] = useState(speed)

  useEffect(() => {
    const i = loopNum % words.length
    const fullText = words[i]

    const handleTyping = () => {
      setText(isDeleting 
        ? fullText.substring(0, text.length - 1) 
        : fullText.substring(0, text.length + 1)
      )

      setTypingSpeed(isDeleting ? deleteSpeed : speed)

      if (!isDeleting && text === fullText) {
        setTypingSpeed(pauseTime)
        setIsDeleting(true)
      } else if (isDeleting && text === "") {
        setIsDeleting(false)
        setLoopNum(loopNum + 1)
      }
    }

    const timer = setTimeout(handleTyping, typingSpeed)
    return () => clearTimeout(timer)
  }, [text, isDeleting, loopNum, words, speed, deleteSpeed, pauseTime])

  return (
    <span className={className}>
      {text}
      <span className="animate-pulse ml-1 text-lime-400">_</span>
    </span>
  )
}