import React from 'react'
import Button from '../../../components/button/Button'
import { handleDeveloperLogin } from '../../../utils/auth'
import { GITHUB, GOOGLE } from '../../../utils/constants'
import loginStyles from "./login.module.scss"


const Login = () => {
  return (
    <div className={loginStyles.authContainer}>
       <div className={loginStyles.wrapper}>
          <div className={loginStyles.loginType}>
            <Button 
              to="/"
              text = {GITHUB}
              onClick = {handleDeveloperLogin}
            />
          </div>
          <div className={loginStyles.loginType}>
            <Button 
              to = "/"
              text = {GOOGLE} 
            />
          </div>
       </div>
    </div>
  )
}

export default Login