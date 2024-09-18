import { current } from '@reduxjs/toolkit'
import React from 'react'
import { useSelector } from 'react-redux'


function Home() {
  const {currentUser} = useSelector(state => state.user)
  console.log(currentUser)
  return (
    <div className='text-red-400'>
       hwlloooooeeeeee
    </div>
  )
}

export default Home
