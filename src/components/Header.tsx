const Header = () => {

  return (
    <header className="
        relative
        min-h-[12%]
        p-3
        flex justify-between items-center
        bg-teal-50
      `  text-indigo-900
    ">
      <div className="flex flex-col">
        <h1 className="text-[2rem] font-bold">TimeZones</h1>
        <h4 className="text-[0.8rem]">Converting time manually? Ain't <strong>nobody</strong> got time fo dat!</h4>
      </div>
      <img src="/globe.gif" alt="Rotating Globe" className="absolute w-8 h-10 top-4 right-4" />
    </header>
  )
}

export default Header