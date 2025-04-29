const Header = () => {
const globeGif = '../assets/globe.gif'

  return (
    <header className='
        flex
        justify-between
        items-center
        h-[10%]
        px-10
        py-15
        bg-teal-50
        text-indigo-900'
    >
      <div className='flex flex-col'>
        <h1 className='text-5xl font-bold'>TimeZones</h1>
        <h4 className='text-xl p-2'>Converting time manually? Ain't nobody got time fo dat!</h4>
      </div>
      <img src='/globe.gif' alt="Rotating Globe" className="w-18 h-24 mr-8 mt-2" />
    </header>
  )
}

export default Header