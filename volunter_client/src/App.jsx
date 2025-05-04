import { useLoaderData } from 'react-router-dom'
import './App.css'
import CardEvent from './Components/Assests/CardEvent'
import HomeLayout from './Components/Layout/HomeLayout'
import Navbar from './Components/Layout/Navbar'
import { useState } from 'react'

function App() {
  const loadedEvents = useLoaderData();
  const [events,setEvents]=useState(loadedEvents)

  return (
    <>
    <div className='bg-whites'>
      {/* navbar */}
      <Navbar></Navbar>
      <HomeLayout></HomeLayout>
      



      {/* header */}


      {/* content */}
      <h1 className='text-6xl text-black text-center'>Hot Coffeee {events.length}</h1>
      <div className='grid md:grid-cols-3 gap-4 m-2'>
    {
      events.map(event => (
        <CardEvent key={event._id} event={event} setEvents={setEvents} />
      ))
    }
    </div>

      {/* footer */}
    </div>
    
    </>
  )
}

export default App
