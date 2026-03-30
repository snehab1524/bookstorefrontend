import React from 'react'
import Hero from '../components/Home/Hero'
import RecentlyAdded from '../components/Home/RecentlyAdded'


function Home() {
  return (
    <div className='bg-zinc-900 text-white px-4 md:px-8 py-4 md:py-8'>
      <Hero />
      <RecentlyAdded />
    </div>
  )
}

export default Home
