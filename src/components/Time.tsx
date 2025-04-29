import { useState, useEffect } from 'react'
import { getRandomCoords, formatTimeZoneOffsetString } from '../utils'
import { GrFormClose } from "react-icons/gr"

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
    onRemove 
}:  Props) => {  

    // state
    const [city, setCity] = useState<string>("")
    const [country, setCountry] = useState<string>("")
    const [timeZone, setTimeZone] = useState<string>("")
    const [timeZoneOffset, setTimeZoneOffset] = useState<string | null>(null)

    const gepApiKey = import.meta.env.VITE_GEONAMES_API_KEY
    const geoBaseUrl = import.meta.env.VITE_GEONAMES_BASE_URL

    const fetchLocationData = async (coordsArr: [number, number]) => {
        const [lat, lng] = coordsArr

        // console.log('Fetching Location data for coords:',city, lat, lng)
        try {
            console.log('geoBaseUrl:', geoBaseUrl);
            console.log('gepApiKey:', gepApiKey);
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
        <div className="
            relative 
            flex flex-col gap-4 justify-center items-center 
            w-full h-full 
            p-4
            text-[clamp(1rem,2.5vw,2rem)]
            bg-neutral-200 
            rounded-2xl shadow-lg">
            <div className="flex-grow flex flex-col justify-center items-center gap-[clamp(0.5rem,2vw,1rem)]">
                <AnalogDisplay
                    now={now} 
                    isNow={isNow} 
                    chosenTime={chosenTime}
                    coords={coords} 
                    chosenCoords={chosenCoords}
                    timeZone={timeZone}
                />
                <div className='flex flex-col gap-4 justify-center items-center'>
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
                    className='absolute m-2 top-0 right-0 text-[3rem] text-black hover:text-[3.5rem] hover:text-red-700 hover:m-1 transition-all'
                    onClick={()=>{onRemove()}}
                />
            </div>
        </div>
    )
}

export default Time