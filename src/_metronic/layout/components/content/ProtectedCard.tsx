import { FC, ReactNode, useEffect, useRef, useState } from 'react'

type Bubble = {
  id: number
  x: number
  y: number
  size: number
  dx: number
  dy: number
  color: string
}

type ProtectedCardProps = {
  password: string
  children: ReactNode
  className?: string
}

const COLORS = ['#6EC1E4', '#FF6F91', '#FFC75F', '#D65DB1', '#FF9671']

let bubbleIdCounter = 0

const createRandomBubble = (width: number, height: number): Bubble => ({
  id: bubbleIdCounter++,
  x: Math.random() * width,
  y: Math.random() * height,
  size: 20 + Math.random() * 20,
  dx: (Math.random() - 0.5) * 0.6,
  dy: (Math.random() - 0.5) * 0.6,
  color: COLORS[Math.floor(Math.random() * COLORS.length)],
})

const ProtectedCard: FC<ProtectedCardProps> = ({ password, children, className = '' }) => {
  const [isBlurred, setIsBlurred] = useState(true)
  const [showPrompt, setShowPrompt] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const [userInput, setUserInput] = useState('')
  const [bubbles, setBubbles] = useState<Bubble[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const promptRef = useRef<HTMLDivElement>(null)

  // Initialize bubbles
  useEffect(() => {
    const width = containerRef.current?.clientWidth || 400
    const height = containerRef.current?.clientHeight || 300
    const initialBubbles = Array.from({ length: 20 }, () => createRandomBubble(width, height))
    setBubbles(initialBubbles)
  }, [])

  // Animate movement + handle collisions with explosion effect
  useEffect(() => {
    let animationFrameId: number

    const animate = () => {
      const width = containerRef.current?.clientWidth || 400
      const height = containerRef.current?.clientHeight || 300

      setBubbles(prev => {
        const updated: Bubble[] = []

        const positions = [...prev]

        for (let i = 0; i < positions.length; i++) {
          const b1 = positions[i]
          let hasCollided = false

          for (let j = i + 1; j < positions.length; j++) {
            const b2 = positions[j]
            const dist = Math.hypot(b1.x - b2.x, b1.y - b2.y)
            if (dist < (b1.size + b2.size) / 2) {
              hasCollided = true
              positions.splice(j, 1) // remove collided b2
              break
            }
          }

          if (hasCollided) {
            updated.push(createRandomBubble(width, height))
            updated.push(createRandomBubble(width, height))
            continue // skip adding b1 (destroyed)
          }

          // Move and bounce
          let newX = b1.x + b1.dx
          let newY = b1.y + b1.dy
          let newDx = b1.dx
          let newDy = b1.dy

          if (newX < b1.size / 2 || newX > width - b1.size / 2) newDx *= -1
          if (newY < b1.size / 2 || newY > height - b1.size / 2) newDy *= -1

          updated.push({ ...b1, x: newX, y: newY, dx: newDx, dy: newDy })
        }

        return updated
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    animationFrameId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrameId)
  }, [])

  // Auto lock logic
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (authenticated) {
      setIsBlurred(false)
      timer = setTimeout(() => {
        setIsBlurred(true)
        setAuthenticated(false)
      }, 30000)
    }
    return () => clearTimeout(timer)
  }, [authenticated])

  // Close prompt when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showPrompt &&
        promptRef.current &&
        !promptRef.current.contains(event.target as Node)
      ) {
        setShowPrompt(false)
        setUserInput('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showPrompt])

  const handleCardClick = () => {
    if (isBlurred && !authenticated) setShowPrompt(true)
  }

  const handlePasswordSubmit = () => {
    if (userInput === password) {
      setAuthenticated(true)
      setShowPrompt(false)
      setUserInput('')
    } else {
      alert('Incorrect Password')
    }
  }

  return (
    <>
      <style>{`
        .card-container {
          position: relative;
          display: inline-block;
          overflow: hidden;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.2);
          cursor: pointer;
          background: white;
          max-width: 447px;  /* limit max width */
          max-height: 220px; /* limit max height */
          width: 100%;       /* take full width of parent */
          height: 100%;      /* take full height of parent */
        }

        .card-content {
          position: relative;
          z-index: 1;
          padding: 1rem;
          transition: filter 0.3s ease;
          filter: ${isBlurred ? 'blur(6px)' : 'none'};
        }

        .bubble-layer {
          pointer-events: none;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 2;
        }

        .bubble {
          position: absolute;
          border-radius: 50%;
          opacity: 0.9;
          transition: background-color 0.3s;
        }

        .password-prompt-overlay {
          pointer-events: auto;
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          background-color: rgba(0, 0, 0, 0.75);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 10;
          border-radius: 12px;
        }

        .password-prompt-box {
          background: white;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.3);
        }
      `}</style>

      <div className={`card-container ${className}`} ref={containerRef} onClick={handleCardClick}>
        <div className="card-content">
          {children}
        </div>

        {isBlurred && (
          <div className="bubble-layer">
            {bubbles.map(({ id, x, y, size, color }) => (
              <div
                key={id}
                className="bubble"
                style={{
                  left: x - size / 2,
                  top: y - size / 2,
                  width: size,
                  height: size,
                  backgroundColor: color,
                  boxShadow: `0 0 15px 5px ${color}`,
                }}
              />
            ))}
          </div>
        )}

        {showPrompt && !authenticated && (
          <div className="password-prompt-overlay">
            <div
              className="password-prompt-box"
              ref={promptRef}
              onClick={(e) => e.stopPropagation()}
            >
              <h5>Enter Password</h5>
              <input
                type="password"
                className="form-control mb-3"
                placeholder="Enter password"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                autoFocus
              />
              <button className="btn btn-primary w-100" onClick={handlePasswordSubmit}>
                Submit
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default ProtectedCard
