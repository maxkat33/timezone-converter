// const getLocaleTimeString = (timestamp, timeZoneId) => {
    
//     const timeString = new Date(timestamp).toLocaleTimeString(
//         `en-US`,
//         {
//             timeZone: timeZoneId,
//             hour12: true,
//             hour:   '2-digit',
//             minute: '2-digit',
//             second: '2-digit'
//         }
//     )
//     console.log(timeString)
//     return timeString
// }

// getLocaleTimeString(Date.now(), 'America/New_York')

// const getLocaleDate = (timestamp, timeZone) => {
//    return new Date(timestamp).toLocaleString('en-US', { timeZone: timeZone })
// }

// console.log(getLocaleDate(Date.now(), "America/New_York"))
const getLocaleTimeString = (timestamp, timeZone, twentyFourHour) => {
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

const convertChosenTimeToTimestamp = (chosenTime) => {
    const [hours, minutes] = chosenTime.split(":").map(Number)

    // Create a Date object for today with that time
    const chosenDay = new Date()
    chosenDay.setHours(hours)
    chosenDay.setMinutes(minutes)
    chosenDay.setSeconds(0)

    const chosenTimestamp = chosenDay.getTime()
    return chosenTimestamp
}


const timestamp = convertChosenTimeToTimestamp("00:00")
const timeStr = getLocaleTimeString(timestamp, "America/New_York", true)
console.log(timeStr.slice(0,-3))