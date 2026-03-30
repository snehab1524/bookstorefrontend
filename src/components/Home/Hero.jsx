import React from 'react'
import { Link } from 'react-router-dom'
import heroImg from '../../assets/hero.png'

const Hero = () => {
  return (
    <div className='min-h-[60vh] md:min-h-[75vh] flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 px-4 md:px-8'>
      <div className='mb-8 md:mb-0 w-full md:w-1/2 lg:w-3/6 flex flex-col items-center md:items-start justify-center text-center md:text-left'>
        <h1 className='text-3xl sm:text-4xl lg:text-6xl font-semibold text-yellow-100'>Discover Your Next Great Read</h1>
        <p className='mt-4 text-zinc-300 text-base sm:text-lg md:text-xl'>Explore our vast collection of books and find your next favorite story today.</p>
        <div className='mt-6 md:mt-8'> 
          <Link to ="/books" className='text-yellow-100 text-lg md:text-xl lg:text-2xl font-semibold border-2 border-yellow-100 px-8 py-3 hover:bg-yellow-100 hover:text-zinc-900 rounded transition-all duration-300 w-fit'>Discover Books</Link>
        </div>
      </div>
      <div className='w-full md:w-1/2 lg:w-3/6 flex items-center justify-center'>
        <img src={heroImg} alt="Hero Image" className='w-full max-w-md md:max-w-full h-auto object-contain rounded-lg' />
      </div>
    </div>
  )
}

export default Hero
