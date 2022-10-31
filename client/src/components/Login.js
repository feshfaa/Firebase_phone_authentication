import axios from 'axios';
import { updatePassword } from 'firebase/auth';
import React, { useRef, useState } from 'react';
import { Alert, Button, Form} from "react-bootstrap";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContex';

export default function Login() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [resetPassword, setResetPassword] = useState("")
    const [number, setNumber] = useState("")
    const [error, setError] = useState("")
    const [verificationDisplay, setVerificationDisplay] = useState(false)
    const [passwordDisplay, setPasswordDisplay] = useState(false)
    const { sendOtp, token } = useAuth()
    const [confirmObj, setConfirmobj] = useState()
    const [otp, setOtp] = useState("")
    const [loading, setLoding] = useState(false)
    const stateRef = useRef();
    stateRef.number = number;
    stateRef.password = resetPassword
    const navigate = useNavigate()

    const loginUser = async (e) => {
            e.preventDefault();
            setError("");
            
            const response =  await axios.post('/user/login',{
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                username: username,
                password: password
            }).then((response)=>{
                if(response){
                  navigate('/dashboard')
                }
            }).catch((error)=>{
                if (error.response.status === 401) {
                    navigate('/')
                }
                if (error.response.status === 400) {
                    setError('Incorrect username or password')
                }
            })

    }

    const updatePassword = async (e) => {
        e.preventDefault();
        setError("");
        
        const response =  await axios.patch('/user/update',{
            method: 'PATCH',
            headers:{
                'Content-Type': 'application/json'
            },
            username: username,
            password: resetPassword
        }).then((response)=>{
            if(response){
                setLoding(false)
                setVerificationDisplay(false)
            }
        }).catch((error)=>{
        if (error.response.status === 401) {
            navigate('/')
        }
        })

    }

    const verifyOtp = async (e) =>{
        e.preventDefault()

        if( otp === "" || otp === null ) return
        try{
            setError("")
            await confirmObj.confirm(otp);
            
            setPasswordDisplay(true)
        }catch(err){
            setError('invalid code')
            console.log(err)
        }
    }

    const sendOtpCode = async () =>{

        console.log(stateRef.number)
        if (stateRef.number === "" || stateRef.number === "undefined") return setError("Please Enter valid phone number")
        const response2 = await sendOtp(stateRef.number)
        setConfirmobj(response2)

        setVerificationDisplay(true)

        if(token){

            const authAxios = axios.create({
                baseURL: 'http://localhost:4000/user/verify',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                withCredentials: true
            })

            await authAxios.get('http://localhost:4000/user/verify',{
                username: username
            }).then(()=>{
                setPasswordDisplay(true)
            }).catch(()=>{
                
            })
        }

    }

    const reset = async (e) =>{

        e.preventDefault();

        setLoding(true);

        const response =  await axios.post('/user/find',{
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            username: username
        }).then((response)=>{
            if(response){
                stateRef.number = response.data.phone
                sendOtpCode()
            }
        }).catch((error)=>{
        if (error.response.status === 401) {
            navigate('/')
        }
        if (error.response.status === 400) {
            setError('Please, Enter Username')
            setLoding(false)
        }
        })
        
    }

  return (
    <>
        <div className='p-4 box' style={{display: !verificationDisplay? 'block':'none'}}>
            <h2>Welcome back! Glad to see you, again!</h2>
            <Form onSubmit={loginUser}>
                <Form.Group className='mb-3' id='username'>
                    <Form.Control placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} required/>
                </Form.Group>
                <Form.Group className='mb-3' id='pasword'>
                    <Form.Control placeholder='Password' type='password' value={password} onChange={ (e)=> setPassword(e.target.value)} required/>
                </Form.Group>
                <div className='button-right'>
                    <Button varient='secondary' type='submit'>Log In</Button>
                </div>
            </Form>
            <div id='recaptcha-container' />
            <div className='mt-4'>
                {error && <Alert variant='danger'>{error}</Alert>}
            </div>
            <h3 className='w-100 text-center mt-2'>
                Need an account? <Link to='/signup'>Sign Up</Link>
            </h3>
            <h3 className='w-100 text-center mt-2'>
                Forget Password? <Button varient='secondary' disabled={loading} onClick={reset}>Reset</Button>
            </h3>
        </div>

        <div className='p-4 box' style={{display: verificationDisplay? 'block': 'none'}}>
            <div style={{display: !passwordDisplay? 'block':'none'}}>
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
            <div style={{display: passwordDisplay? 'block': 'none'}}>
                <h2>Reset Password</h2>
                <h6>Enter new password</h6>
                <Form onSubmit={updatePassword}>
                    <Form.Group className='mb-3' id='password'>
                        <Form.Control placeholder='password' type='password' onChange={ (e) => {setResetPassword(e.target.value)}} required/>
                    </Form.Group>
                    
                    <div className='button-right'>
                        <Button varient='secondary' type='submit'>Reset password</Button>
                    </div>
                </Form>
            </div>
        </div>    
    </>
  )
}
