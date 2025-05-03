import { useState, useEffect } from 'react'
import { getRandomCoords, formatTimeZoneOffsetString } from '../utils'
import { GrFormClose } from 'react-icons/gr'

import AnalogDisplay from './AnalogDisplay'
import DigitalDisplay from './DigitalDisplay'
import Location from './Location'

type Props = {
    now: number
    isNow: boolean
    setIsNow: React.Dispatch<React.SetStateAction<boolean>>
    chosenTime: string
    setChosenTime: React.Dispatch<React.SetStateAction<string>>
    isTwentyFourHour: boolean
    coords: [number, number]
    chosenCoords: [number, number]
    setChosenCoords: React.Dispatch<React.SetStateAction<[number, number]>>
    numClocks: number
    onCoordsChange: (newCoords: [number, number]) => void
    onRemove: () => void
}

const Time = ({  
    now, 
    isNow, 
    setIsNow,
    chosenTime, 
    setChosenTime, 
    isTwentyFourHour, 
    coords, 
    onCoordsChange, 
    chosenCoords, 
    setChosenCoords,
    numClocks, 
    onRemove 
}:  Props) => {  

    // state
    const [city, setCity] = useState<string>('')
    const [country, setCountry] = useState<string>('')
    const [timeZone, setTimeZone] = useState<string>('')
    const [timeZoneOffset, setTimeZoneOffset] = useState<string | null>(null)

    const gepApiKey = import.meta.env.VITE_GEONAMES_API_KEY
    const geoBaseUrl = import.meta.env.VITE_GEONAMES_BASE_URL

    const fetchLocationData = async (coordsArr: [number, number]) => {
        const [lat, lng] = coordsArr

        // console.log('Fetching Location data for coords:',city, lat, lng)
        try {
            const locationRes = await fetch(`${geoBaseUrl}/findNearbyJSON?lat=${lat}&lng=${lng}&radius=50&featureClass=P&maxRows=1&username=${gepApiKey}`)
            const locationData = await locationRes.json()
            // console.log('Location response: ', locationData)

            if (locationData.geonames && locationData.geonames.length > 0) {
                setCountry(locationData.geonames[0].countryName)

                // Fetch closest largest city
                const cityRes = await fetch(`${geoBaseUrl}/citiesJSON?north=${lat+0.5}&south=${lat-0.5}&east=${lng+0.5}&west=${lng-0.5}&maxRows=1&username=${gepApiKey}`)
                const cityData = await cityRes.json()
                setCity(cityData.geonames[0].toponymName)
        
                // fetch timeZone data only if location found
                const tzRes = await fetch(`${geoBaseUrl}/timezoneJSON?lat=${lat}&lng=${lng}&username=${gepApiKey}`)
                const tzData = await tzRes.json()
                // console.log('timeZone response:', tzData)
                setTimeZone(tzData.timezoneId)
                setTimeZoneOffset(formatTimeZoneOffsetString(tzData.rawOffset))
            } else {
                console.warn(locationData, 'No city found, retrying...')
                // try again with new random coords
                fetchLocationData(getRandomCoords()) 
            }
         } catch (error) {
            console.error('Fetch error:', error)
        }
    }

    // useEffects
    useEffect(() => {
        fetchLocationData(coords)
    }, [coords])

    if(!timeZoneOffset) {
        return <div>Loading....</div>
    }
  
    return (
        <div className='
            border-blue-900
            relative
            p-5
            bg-neutral-300 
            text-[1.02rem]
            rounded-[10px]
            shadow-lg 
        '>
            <div className=' 
                flex flex-col items-center gap-3
            '>
                <AnalogDisplay
                    now={now} 
                    isNow={isNow} 
                    chosenTime={chosenTime}
                    coords={coords} 
                    chosenCoords={chosenCoords}
                    timeZone={timeZone}
                    numClocks={numClocks}
                />
                <div className='
                    border-blue-500
                    flex flex-col gap-2
                '>
                    <DigitalDisplay 
                        now={now} 
                        isNow={isNow} 
                        setIsNow={setIsNow} 
                        chosenTime={chosenTime}
                        setChosenTime={setChosenTime}
                        coords={coords}
                        chosenCoords={chosenCoords}
                        setChosenCoords={setChosenCoords}
                        isTwentyFourHour={isTwentyFourHour}
                        timeZone={timeZone}
                        />
                    <Location
                        city={city} 
                        setCity={setCity} 
                        country={country} 
                        setCountry={setCountry} 
                        onCoordsChange={onCoordsChange} 
                        timeZoneOffset={timeZoneOffset}
                        />
                </div>
                <GrFormClose 
                    className='
                    absolute 
                    m-1 top-0 right-0 
                    text-[3rem] text-black 
                    hover:text-[3.5rem] hover:text-red-700 hover:m-0 focus:text-red-700 transition-all
                    '
                    onClick={()=>{onRemove()}}
                />
            </div>
        </div>
    )
}

export default Time