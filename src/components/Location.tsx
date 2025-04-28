import { useState, useEffect } from 'react'

type Suggestion = {
  id: number
  city: string
  country: string
  latitude: number
  longitude: number
}

type Props = { 
    city: string
    setCity: React.Dispatch<React.SetStateAction<string>>
    country: string
    setCountry: React.Dispatch<React.SetStateAction<string>>
    onCoordsChange: (newCoords: [number, number]) => void
    timeZoneOffset: string
}

const Location = ({ city, setCity, country, setCountry, onCoordsChange, timeZoneOffset }: Props) => {
    
    const [input, setInput] = useState<string>(`${city}, ${country}`)
    const [suggestions, setSuggestions] = useState<Suggestion[]>([])
    const [isSearching, setIsSearching] = useState(false)


    useEffect(() => {
        if (!isSearching) {
            setInput(`${city}, ${country}`)
        }
    }, [city, country, isSearching])

    useEffect(()=> {
        if (!isSearching|| input.length < 2) {
            setSuggestions([])
            return
        }

        const timeoutId = setTimeout(() => {
            fetchSuggestions(input)
        }, 400)

        return () => clearTimeout(timeoutId)

    }, [input, isSearching])

    const fetchSuggestions = async (input: string) => {
        try {
            const res = await fetch(`https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${input}&limit=5&sort=-population`, {
                method: 'GET',
                headers: {
                    'x-rapidapi-host': 'wft-geo-db.p.rapidapi.com',
                    'x-rapidapi-key': '75ba59f42emshe24a646fadb734ep121e6djsn33ef5a68d27b',
                },
            })
            const data = await res.json()
            setSuggestions(data.data ?? [])
        } catch (error) {
            console.error('Error fetching cities:', error)
            setSuggestions([])
        }
    }

    const handleSelect = (loc: Suggestion) => {
        setCity(loc.city)
        setCountry(loc.country)
        onCoordsChange([loc.latitude, loc.longitude])
        setIsSearching(false)     
        setSuggestions([])
        setInput(`${loc.city}, ${loc.country}`)
    }

    return (
        <div className='relative'>
            <p>{timeZoneOffset}</p>
            <input
                className='w-full'
                type="text"
                value={input}
                onChange={(e) => {
                    setInput(e.target.value)
                    setIsSearching(true)
                }}
                placeholder="Type a city name"
            />
            {suggestions.length > 0 && (
                <ul 
                    className='absolute w-full list-none bg-white border border-gray-200 overflow-y-auto z-999'
                >
                    {suggestions.map((loc) => (
                        <li
                            key={loc.id}
                            className='p-2 cursor-pointer'
                            onClick={() => handleSelect(loc)}
                        >
                            {`${loc.city}, ${loc.country}`}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )

}

export default Location