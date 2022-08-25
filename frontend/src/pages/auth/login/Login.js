import React from 'react'
import Button from '../../../components/button/Button'
import { GITHUB, GOOGLE } from '../../../utils/constants'
import loginStyles from "./login.module.scss"


const Login = () => {
  return (
    <div className={loginStyles.wrapper}>
       <div>
          <div className={loginStyles.loginType}>
            <Button 
              to="/"
              text = {GITHUB}
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