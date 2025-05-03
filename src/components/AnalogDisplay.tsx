import { getLocaleDate, convertChosenTimeToTimestamp } from '../utils'
import Clock from 'react-clock'
import 'react-clock/dist/Clock.css'

type Props = {
  now: number
  isNow :boolean
  chosenTime: string
  coords: [number, number]
  chosenCoords: [number, number]
  timeZone: string
  numClocks: number
}

const AnalogDisplay = ({ now, isNow, chosenTime, coords, chosenCoords, timeZone, numClocks}: Props) => {

  const liveDate = getLocaleDate(now, timeZone)
  let chosenDate = new Date()

  if (chosenCoords === coords) {
      const [hours, minutes] = chosenTime.split(':').map(Number)
      chosenDate.setHours(hours, minutes, 0, 0)
  } else {
    const timestamp = convertChosenTimeToTimestamp(chosenTime, timeZone)
    chosenDate = getLocaleDate(timestamp, timeZone)
  }

  return (
    <div className={numClocks === 2 ? "size-[7em]" : numClocks === 3 ? "size-[4.5em]" : "size-[3em]"}>
      <Clock
        className='react-clock bg-white rounded-full' 
        value={isNow ? liveDate : chosenDate} />
    </div>
  )
}

export default AnalogDisplay