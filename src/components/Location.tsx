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

const Location = ({ 
    city, 
    setCity, 
    country, 
    setCountry, 
    onCoordsChange, 
    timeZoneOffset 
}: Props) => {
    
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

    const rapidBaseUrl = import.meta.env.VITE_RAPID_BASE_URL
    const rapidHost = import.meta.env.VITE_RAPID_HOST
    const rapidApiKey = import.meta.env.VITE_RAPID_API_KEY

    const fetchSuggestions = async (input: string) => {
        try {
            const res = await fetch(`${rapidBaseUrl}/v1/geo/cities?namePrefix=${input}&limit=5&sort=-population`, {
                method: 'GET',
                headers: {
                    'x-rapidapi-host': rapidHost,
                    'x-rapidapi-key': rapidApiKey,
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
        <div className='
            border-green-500
            flex justify-between gap-2
        '>
            <p className='border-pink-800'>
                {timeZoneOffset}
            </p>
            <div className="relative">
                <input
                    className='
                    border-yellow-600 
                    relative
                    text-center
                    '
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
                    className='
                    absolute left-0 top-full w-full mt-1
                    bg-white border-gray-200
                    text-[0.8rem] 
                    list-none 
                    overflow-y-scroll 
                    z-999
                    '>
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
        </div>
    )

}

export default Location