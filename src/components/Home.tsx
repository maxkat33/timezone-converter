import { useState, useEffect } from 'react'
import { getRandomCoords } from '../utils'
import Time from './Time'

const MELBOURNE: [number, number] = [-37.8140, 144.9633]
const LONDON: [number, number] = [51.4500, 0.0500]

const Home = () => {
  const [now, setNow] = useState<number>(Date.now())
  const [isNow, setIsNow] = useState<boolean>(true)
  const [chosenTime, setChosenTime] = useState<string>("00:00")
  const [chosenCoords, setChosenCoords] = useState<[number, number]>(MELBOURNE)
  const [locationStatus, setLocationStatus] = useState("")
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
    <main className="flex flex-col justify-center items-center p-10 gap-6 h-full bg-white">
      <div className='flex w-full h-1/12'>
        <div className='flex w-full gap-20'>
          <button 
            className="w-1/7 py-2 px-4 rounded bg-indigo-600 hover:bg-indigo-800 text-xl text-white font-bold" 
            onClick={() => {
              setIsNow(true)
              setNow(Date.now())
            }}>
              Reset Time to Now
          </button>
          <button
            className="w-1/7 py-2 px-4 rounded bg-indigo-600 hover:bg-indigo-800 text-xl text-white font-bold"
            onClick={() => setClocks(prev => [...prev, getRandomCoords()])}
            >
            Add New Clock
          </button>
        </div>
        <button
          className="w-1/10 py-2 px-4 rounded bg-purple-600 hover:bg-purple-800 text-xl text-white font-bold tracking-widest"
          onClick={() => setIsTwentyFourHour(!isTwentyFourHour)}
        >
          {isTwentyFourHour ? 'AM / PM' : '24H'} 
        </button>
      </div>
      <div className='flex flex-wrap gap-20 justify-evenly items-center w-full h-full'>
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
          onCoordsChange={(newCoords) => {
            setClocks(prev => {
              const updated = [...prev]
              updated[idx] = newCoords
              return updated
            })
          }}
          onRemove={() => {
            setClocks(prev => {
              const updated = prev.filter((coordinates)=> coordinates !== coords)
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