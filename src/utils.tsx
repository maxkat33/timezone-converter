export const getRandomCoords = (): [number, number] => {
    // ensure that random coordinates will fall on land (most likely, oceania contains lots of islands and water but ~95% of hitting land)
    const continents = {
        Africa: { latMin: -35, latMax: 37, lngMin: -18, lngMax: 52 },
        Asia: { latMin: 1, latMax: 77, lngMin: 26, lngMax: 180 },
        Europe: { latMin: 36, latMax: 71, lngMin: -25, lngMax: 45 },
        NorthAmerica: { latMin: 7, latMax: 83, lngMin: -168, lngMax: -52 },
        SouthAmerica: { latMin: -56, latMax: 13, lngMin: -81, lngMax: -35 },
        Australia: { latMin: -44, latMax: -10, lngMin: 112, lngMax: 154 },
        Oceania: { latMin: -50, latMax: 0, lngMin: 110, lngMax: 180 },
    }
    
    const continentNames = Object.keys(continents)
    const randomContinent = continentNames[Math.floor(Math.random() * continentNames.length)]
    const bounds = continents[randomContinent]

    const lat = bounds.latMin + Math.random() * (bounds.latMax - bounds.latMin)
    const lng = bounds.lngMin + Math.random() * (bounds.lngMax - bounds.lngMin)

    return [lat, lng]

}

export const getLocaleTimeString = (timestamp: number, timeZone: string, twentyFourHour: boolean) => {
    const timeString = new Date(timestamp).toLocaleTimeString(
        `en-US`,
        {
            timeZone: timeZone,
            hour12: !twentyFourHour,
            hour: twentyFourHour ? '2-digit' : 'numeric',
            minute: '2-digit',
            second: '2-digit'
        }
    )
    return timeString
}

export const getLocaleDate = (timestamp: number, timeZone: string): Date => {
    const dateString = new Date(timestamp).toLocaleString('en-US', { timeZone: timeZone })
    return new Date(dateString)
}

export const convertChosenTimeToTimestamp = (chosenTime: string, timeZone: string): number => {
    const [hours, minutes] = chosenTime.split(":").map(Number)

    const now = new Date()
    const dtf = new Intl.DateTimeFormat(
        `en-US`, {
        timeZone,
        year: "numeric", month: "2-digit", day: "2-digit"
        }
    )
    // formatToParts → [ {type: "year", value: "2025"}, …, {type:"day", value:"28"} ]
    const parts = dtf.formatToParts(now)
    const year  = parseInt(parts.find(p => p.type==="year")!.value, 10)
    const month = parseInt(parts.find(p => p.type==="month")!.value, 10) - 1
    const day   = parseInt(parts.find(p => p.type==="day")!.value, 10)

    // 2) Build a UTC timestamp for that Y/M/D at your chosen H/M
    //    Date.UTC treats its args as UTC fields.
    return Date.UTC(year, month, day, hours, minutes, 0, 0)
}

export const convertTimestamp = (timestamp: number, timeZoneOffset: number): number => {
    const milliseconds = timeZoneOffset * 60 * 60 * 1000
    const convertedTimestamp = timestamp + milliseconds
    
    return convertedTimestamp
}

export const formatTimeZoneOffsetString = (timeZoneOffset: number): string => {
    //timeZoneOffset must be in the form of 10, -3.5 (where the number is the amount of hours past UTC)
    const sign = timeZoneOffset < 0 ? '-' : '+'
    const absOffset = Math.abs(timeZoneOffset)
    const hours = Math.floor(absOffset)
    const minutes = Math.abs(absOffset % 1 * 60)

    const hoursStr = String(hours).padStart(2, '0')
    const minutesStr = String(minutes).padStart(2, '0')
    
    return `UTC${sign}${hoursStr}:${minutesStr}`
}

export const formatTimeStamp = (unixTimestamp: number): string => {
    let date = new Date(unixTimestamp)

    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')

    return `${hours}:${minutes}:${seconds}`
}



// export const formatTimeZoneString(timeZoneOffset: number): string {
//     //timeZoneOffset must be in the form of +600, -300 (where the number is an amount of minutes)
//     const sign = timeZoneOffset <= 0 ? '+' : '-'
//     const absOffset = Math.abs(timeZoneOffset)
//     const hours = Math.floor(absOffset / 60)
//     const minutes = Math.abs(absOffset % 60)

//     const hoursStr = String(hours).padStart(2, '0')
//     const minutesStr = String(minutes).padStart(2, '0')
    
//     return `UTC${sign}${hoursStr}:${minutesStr}`
// }


  // const incrementTime = (formattedTimeString: string): string => {
  //   let [hours, minutes, seconds] = formattedTimeString.split(':').map(Number)

  //   seconds += 1
    
  //   if (seconds === 60) {
  //     seconds = 0
  //     minutes += 1
  //   }

  //   if (minutes === 60) {
  //     minutes = 0
  //     hours += 1
  //   }

  //   if (hours === 24) {
  //     hours = 0
  //   }

  //   String(seconds)
  //   String(minutes)
  //   String(hours)    
    
  //   const pad = (num: number) => String(num).padStart(2, '0')
  //   return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
  // }

  // useEffect(() => {
  //   if (!isNow) return

  //   const interval = setInterval(() => {
  //     setNowDisplay(formatTimeStamp(Date.now()))
  //   }, 1000)

  //   return () => clearInterval(interval)
  // }, [isNow])

// superseded as too often landing on water
// export const generateRandomCoords(): [number, number] {
    
//     const randomSign = Math.random() < 0.5 ? -1 : 1
//     const randomLat = Math.random() * 90 * randomSign
//     const randomLng = Math.random() * 180 * randomSign

//     return [randomLat, randomLng]
// }
