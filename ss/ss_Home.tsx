import { useState, useEffect } from 'react'
import Time from './Time'

const Home = () => {
  const [now, setNow] = useState<number>(Date.now())
  const [isNow, setIsNow] = useState<boolean>(true)
  const [chosenTime, setChosenTime] = useState<string>("00:00")
  const [locationStatus, setLocationStatus] = useState("")
  // I think I dont want userCoords to be a state and rather just an object to pass to one instance of Time if needed
  const [userCoords, setUserCoords] = useState<[number, number] | null>(null)

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

  return (
    <main className="flex flex-col justify-center items-center gap-10 h-full bg-white">
      <Time now={now} isNow={isNow} setIsNow={setIsNow} chosenTime={chosenTime} setChosenTime={setChosenTime} userCoords={userCoords}/>
      {/* <Time now={now} isNow={isNow} setIsNow={setIsNow} chosenTime={chosenTime} setChosenTime={setChosenTime} userCoords={null}/> */}
      <div className='flex gap-10'>
        <button 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" 
          onClick={() => {
            setIsNow(true)
            setNow(Date.now())
          }}>
            Reset Time to Now
        </button>
        <button 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => setIsNow(false)}>
            Pause Clock
        </button>
      </div>
    </main>
  )
}

export default Home

// const melbourne = [-37.81400000, 144.96332000]
// const london = [51.4500, 0.0500]
// const tehran = [35.6944, 51.4215]
