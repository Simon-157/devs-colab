import React from 'react'
import Button from '../../components/button/Button'
import { ArrowAnim } from '../../components/icons/CssIcons'
import { REGISTER } from '../../utils/constants'
import homeStyles from './home.module.scss'

const Home = () => {
  return (
    <div className={homeStyles.Wrapper}>
       <div>
            <h2> Lets Solve the Challenge Together </h2>
            enjoy the full assets of a <strong>collaborative environment </strong>with visual interractions
           
       </div>
       <div className={homeStyles.joinBtn}>
        <Button 
        to={REGISTER}
        text = "Join the colab"
        icon={<ArrowAnim />}
        />
       </div>
    </div>
  )
}

export default Home