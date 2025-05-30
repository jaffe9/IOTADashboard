import { FC, ReactNode, useEffect, useRef, useState } from 'react'

type Bubble = {
  id: number
  x: number
  y: number
  size: number
  dx: number
  dy: number
  color: string
  collided: boolean
}

type ProtectedCardProps = {
  password: string
  children: ReactNode
  className?: string
}

const COLORS = ['#6EC1E4', '#FF6F91', '#FFC75F', '#D65DB1', '#FF9671']

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
    const initialBubbles: Bubble[] = []
    for (let i = 0; i < 20; i++) {
      initialBubbles.push({
        id: i,
        x: Math.random() * 300 + 50,
        y: Math.random() * 200 + 50,
        size: 20 + Math.random() * 20,
        dx: (Math.random() - 0.5) * 0.3,
        dy: (Math.random() - 0.5) * 0.3,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        collided: false,
      })
    }
    setBubbles(initialBubbles)
  }, [])

  // Animate bubbles movement and collision detection
  useEffect(() => {
    let animationFrameId: number

    const animate = () => {
      setBubbles((prevBubbles) => {
        const width = containerRef.current?.clientWidth || 400
        const height = containerRef.current?.clientHeight || 300

        const newBubbles = prevBubbles.map((bubble) => {
          let newX = bubble.x + bubble.dx
          let newY = bubble.y + bubble.dy
          let newDx = bubble.dx
          let newDy = bubble.dy

          // Bounce off edges inside card
          if (newX < bubble.size / 2) newDx = Math.abs(newDx)
          if (newX > width - bubble.size / 2) newDx = -Math.abs(newDx)
          if (newY < bubble.size / 2) newDy = Math.abs(newDy)
          if (newY > height - bubble.size / 2) newDy = -Math.abs(newDy)

          return { ...bubble, x: newX, y: newY, dx: newDx, dy: newDy, collided: false }
        })

        // Collision detection
        for (let i = 0; i < newBubbles.length; i++) {
          for (let j = i + 1; j < newBubbles.length; j++) {
            const b1 = newBubbles[i]
            const b2 = newBubbles[j]
            const dist = Math.hypot(b1.x - b2.x, b1.y - b2.y)
            if (dist < (b1.size + b2.size) / 2) {
              newBubbles[i].collided = true
              newBubbles[j].collided = true
            }
          }
        }

        return newBubbles.map((bubble) => ({
          ...bubble,
          color: bubble.collided ? '#FFFFFF' : bubble.color,
        }))
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()
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
      }, 30000) // Unlock for 30 seconds
    }
    return () => clearTimeout(timer)
  }, [authenticated])

  // Close prompt if clicking outside prompt
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
          display: inline-block; /* shrink to content */
          overflow: hidden;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.2);
          cursor: pointer;
          user-select: none;
          background: white;
          max-width: 447px;  /* limit max width */
          max-height: 220px; /* limit max height */
          width: 100%;       /* take full width of parent */
          height: 100%;      /* take full height of parent */
          box-sizing: border-box;
        }

        .card-content {
          position: relative;
          z-index: 1;
          padding: 1rem;
          transition: filter 0.3s ease;
          filter: ${isBlurred ? 'blur(6px)' : 'none'};
          height: 100%;
          overflow: auto; /* allow scroll if content bigger */
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
          border-radius: 12px;
        }

        .bubble {
          position: absolute;
          border-radius: 50%;
          opacity: 0.9;
          transition: background-color 0.3s, box-shadow 0.3s;
          box-shadow: 0 0 15px 5px; /* default glow */
        }

        .bubble[color="#FFFFFF"] {
          opacity: 1 !important;
          box-shadow: 0 0 25px 10px #fff !important; /* stronger white glow */
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
          width: 280px;
          max-width: 90vw;
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
                  boxShadow: color === '#FFFFFF' 
                    ? '0 0 25px 10px #fff' 
                    : `0 0 15px 5px ${color}`,
                  opacity: color === '#FFFFFF' ? 1 : 0.9,
                }}
                data-color={color}
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
