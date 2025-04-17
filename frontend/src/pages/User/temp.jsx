import React from 'react'
import { Link } from 'react-router-dom'

const Testing = () => {
  return (
    <div className='flex flex-col justify-center items-center pt-50'>
        <Link to='/login'>Login</Link>
        <Link to='/signup'>Register</Link>
        <Link to='/appointments'>Appointments</Link>
        <Link to='/doctors'>Doctors</Link>
        <Link to='/contact'>Contact</Link>
        <Link to='/adminn'>Admin</Link>
        <Link to='/patient-form'>Patient Form</Link>
        <Link to='/appointment-success'>Success</Link>
        <Link to='/'>Home</Link>
        <Link to='/profile'>Profile</Link>
        <Link to='/admin'>Admin</Link>
        <Link to='/admin-login'>Admin Login</Link>
    </div>
  )
}

export default Testing