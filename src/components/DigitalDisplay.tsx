import { getLocaleTimeString, convertChosenTimeToTimestamp } from '../utils'

type Props = {
  now: number
  isNow: boolean
  setIsNow: React.Dispatch<React.SetStateAction<boolean>>
  chosenTime: string
  setChosenTime: React.Dispatch<React.SetStateAction<string>>
  coords: [number, number]
  chosenCoords: [number, number]
  setChosenCoords: React.Dispatch<React.SetStateAction<[number, number]>>
  isTwentyFourHour: boolean
  timeZone: string
}

type InputChange = React.ChangeEvent<HTMLInputElement>

const DigitalDisplay = ({ 
  now, 
  isNow, 
  setIsNow, 
  chosenTime, 
  setChosenTime, 
  coords, 
  chosenCoords, 
  setChosenCoords, 
  isTwentyFourHour, 
  timeZone 
}: Props) => {

  const liveTime = getLocaleTimeString(now, timeZone, isTwentyFourHour)
  let manualTime = chosenTime

  if (coords !== chosenCoords) {
    const timestamp = convertChosenTimeToTimestamp(chosenTime, timeZone)
    const timeStr = getLocaleTimeString(timestamp,  timeZone, isTwentyFourHour)
    manualTime = timeStr.slice(0,-3)
  }
  

  const handleTimeChange = (e: InputChange) => {
    setIsNow(false)
    setChosenCoords(coords)
    const newTime = e.target.value
    setChosenTime(newTime)
  }
  
  return (
      <input
        className='text-center text-xl w-[10em]'
        type={isNow ? "text" : "time"}
        onChange={(e)=> {handleTimeChange(e)}} 
        value={isNow? liveTime: manualTime}
      /> 
  )
}

export default DigitalDisplay