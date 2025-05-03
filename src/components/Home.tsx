import { useState, useEffect } from 'react'
import { getRandomCoords } from '../utils'
import Time from './Time'

const MELBOURNE: [number, number] = [-37.8140, 144.9633]
const LONDON: [number, number] = [51.4500, 0.0500]

const Home = () => {
  const [now, setNow] = useState<number>(Date.now())
  const [isNow, setIsNow] = useState<boolean>(true)
  const [chosenTime, setChosenTime] = useState<string>('00:00')
  const [chosenCoords, setChosenCoords] = useState<[number, number]>(MELBOURNE)
  const [locationStatus, setLocationStatus] = useState('')
  const [userCoords, setUserCoords] = useState<[number, number] | null>(null)
  const [clocks, setClocks] = useState<Array<[number, number]>>([userCoords ?? MELBOURNE, LONDON])
  const [isTwentyFourHour, setIsTwentyFourHour] = useState<boolean>(true)

  // continually update now when isNow is true
  useEffect(() => {
      if (!isNow) return

      const interval = setInterval(() => {
        setNow(Date.now())
      }, 1000)

      return () => clearInterval(interval)
    }, [isNow])

  // determine user has allowed geolocation
  useEffect(()=> {

    navigator.permissions.query({ name: 'geolocation' })
    .then((result) => {
      
      setLocationStatus(result.state)
    
      if (result.state === 'granted' || result.state === 'prompt') {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserCoords([position.coords.latitude, position.coords.longitude])
        },
        (error) => {
          console.error(`Geolocation error ${error.code}: ${error.message}`)
        }
      )
    }

      // Listen for changes
      result.onchange = () => {
        setLocationStatus(result.state)
      }

    })
  }, [])

  // update coordinates to user location if permission is granted
  useEffect(()=> {
    if (locationStatus === 'granted') {
      navigator.geolocation.getCurrentPosition((position) => {
        setUserCoords([position.coords.latitude, position.coords.longitude])
      })
    }
  }, [locationStatus])

  useEffect(() => {
    if (userCoords) {
      setClocks((prevClocks) => {
        const newClocks = [...prevClocks]
        newClocks[0] = userCoords          
        return newClocks              
      })
    }
  }, [userCoords])

  return (
    <main 
      className='
      border border-red-400 
      flex-grow 
      flex flex-col
      bg-white
    '>
      <div 
        className='
        btns
        w-full
        p-2
        flex justify-between
      '>
        <div className='
          blue-btns
          flex gap-3
          tracking-wide
        '>
          <button 
            className='
            px-2 py-1
            bg-indigo-600 
            rounded 
            text-white font-medium
            hover:bg-indigo-800 
            ' 
            onClick={() => {
              setIsNow(true)
              setNow(Date.now())
            }}>
              Reset to Now
          </button>
          <button
            className='
            px-2 py-1
            bg-indigo-600 
            rounded 
            text-white font-medium
            hover:bg-indigo-800 
            ' 
            onClick={() => setClocks(prev => [...prev, getRandomCoords()])}
            >
            Add Clock
          </button>
        </div>
        <button
          className='
          AM/PM-btn
          px-2 py-1
          bg-purple-600 
          rounded 
          text-white font-medium tracking-widest
          hover:bg-purple-800 
          '
          onClick={() => setIsTwentyFourHour(!isTwentyFourHour)}
        >
          {isTwentyFourHour ? 'AM / PM' : '24H'} 
        </button>
      </div>
      <div className='
        clocks
        border border-black
        p-4
        flex-grow 
        flex flex-wrap justify-center items-center gap-8 
        content-center
      '>
        {clocks.map((coords, idx) => (
          <Time
          key={idx}
          now={now}
          isNow={isNow}
          setIsNow={setIsNow}
          chosenTime={chosenTime}
          setChosenTime={setChosenTime}
          isTwentyFourHour={isTwentyFourHour}
          coords={coords}
          chosenCoords={chosenCoords}
          setChosenCoords={setChosenCoords}
          numClocks={clocks.length}
          onRemove={() => {
            setClocks(prev => {
              const updated = prev.filter((coordinates)=> coordinates !== coords)
              return updated
            })
          }}
          onCoordsChange={(newCoords) => {
            setClocks(prev => {
              const updated = [...prev]
              updated[idx] = newCoords
              return updated
            })
          }}
          />
        ))}
      </div>
    </main>
  )
}

export default Home