import React, { useEffect, useState } from 'react';
import { Button } from "react-bootstrap";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContex';
import axios from 'axios';

export default function Dashboard() {

  const navigate = useNavigate()

  const [username, setUsername] = useState("")

  const { token } = useAuth()

  useEffect(() => {

    const check = async () =>{
      await axios.get('/user/me',{
        headers:{
            'Content-Type': 'application/json'
        },
        withCredentials: true
      }).then((response)=>{
        if(response){
          setUsername(response.data.username)
        }
      }).catch((error)=>{
        if (error.response.status === 401) {
          navigate('/')
      }
      })
  
    }

    check()

  }, []
  )

  const logOut = async () =>{
    await axios.get('/user/logout',{
      headers:{
          'Content-Type': 'application/json'
      },
      withCredentials: true
    }).then((response)=>{
      if(response){
        navigate('/')
      }
    }).catch((error)=>{
      if (error.response.status === 401) {
        navigate('/')
    }
    })
  }

  return (
    <>
        <div className='p-4 box'>
            <h2>Hello! {username}</h2>
            <Link to='/'>
                <div className='button-right'>
                    <Button varient='secondary' onClick={logOut}>Log Out</Button>
                </div>
            </Link>
        </div>
        
    </>
  )
}