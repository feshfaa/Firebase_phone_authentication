import React, { useEffect, useState } from 'react';
import { Alert, Button, Form} from "react-bootstrap";
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContex';
import axios from 'axios';

export default function Signup() {
    const [number, setNumber] = useState("")
    const [username, setUsername] = useState("")
    const [fullname, setFullname] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [passwordConfirm, setPasswordConfirm] = useState("")

    const [loading, setLoding] = useState(false)

    const { sendOtp, token } = useAuth()

    const [error, setError] = useState("")

    const [confirmObj, setConfirmobj] = useState()

    const [verificationDisplay, setVerificationDisplay] = useState(false)

    const [otp, setOtp] = useState("")

    const navigate = useNavigate()

    useEffect(()=>{

    }, [])

    const getOtp = async (e) =>{
        e.preventDefault();
        setError("");
        
        if (number === "" || number === "undefined") return setError("Please Enter valid phone number")
        try{
            setLoding(true);
            const response = await sendOtp(number)
            setConfirmobj(response)

            if(token){

                const authAxios = axios.create({
                    baseURL: 'http://localhost:4000/user/signup',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    withCredentials: true
                })

                await authAxios.post('http://localhost:4000/user/signup',{
                    username: username,
                    email: email,
                    password: password,
                    fullname: fullname,
                    number: number
                }).then(()=>{
                    setVerificationDisplay(true)
                })
            }

        }catch(err){
            setError(err)
        }
        setLoding(false)
    };

    const verifyOtp = async (e) =>{
        e.preventDefault()

        if( otp === "" || otp === null ) return
        try{
            setError("")
            await confirmObj.confirm(otp);
            
            navigate('/dashboard')
        }catch(err){
            setError('invalid code')
            console.log(err)
        }
    }
    
  return (
    <>
        <div className='p-4 w-100' style={{display: !verificationDisplay? 'block':'none'}}>
            <h2>Hello! Register to get started</h2>
            {error && <Alert variant='danger'>{error}</Alert>}
            <Form onSubmit={getOtp}>
                <Form.Group className='mb-3' id='username'>
                    <Form.Control placeholder='Username' required value={username} onChange={(e) => setUsername(e.target.value)} />
                </Form.Group>
                <Form.Group className='mb-3' id='fullname'>
                    <Form.Control placeholder='Full Name' required value={fullname} onChange={(e) => setFullname(e.target.value)} />
                </Form.Group>
                <Form.Group className='mb-3' id='phone'>
                    <PhoneInput className='mb-3' defaultCountry='ET' value={number} onChange={setNumber} placeholder='Phone number'/>
                </Form.Group>
                <Form.Group className='mb-3' id='email'>
                    <Form.Control placeholder='Email' type='email' required value={email} onChange={(e) => setEmail(e.target.value)} />
                </Form.Group>
                <Form.Group className='mb-3' id='pass'>
                    <Form.Control placeholder='Password' type='password' required value={password} onChange={(e) => setPassword(e.target.value)} />
                </Form.Group>
                <Form.Group className='mb-3' id='pass_confirm'>
                    <Form.Control placeholder='Confirm Password' type='password' required value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} />
                </Form.Group>
                <div className='button-right'>
                    <Button varient='secondary' disabled={loading} type='submit'>Sign Up</Button>
                </div>
                <div id='recaptcha-container' />
            </Form>
            <h3 className='w-100 text-center mt-2'>
                Already have an account <Link to='/'>Log In</Link>
            </h3>
        </div>

        <div className='p-4 box' style={{display: verificationDisplay? 'block': 'none'}}>
            <h2>OTP Verification</h2>
            <h6>Enter Verification code. we just sent to you</h6>
            {error && <Alert variant='danger'>{error}</Alert>}
            <Form onSubmit={verifyOtp}>
                <Form.Group className='mb-3' id='otp'>
                    <Form.Control placeholder='otp' onChange={ (e) => {setOtp(e.target.value)}} required/>
                </Form.Group>
                <div className='button-right'>
                    <Button varient='secondary' type='submit'>Verify</Button>
                </div>
            </Form>
        </div>
    </>
  )
}