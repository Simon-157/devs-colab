import React from 'react'
import Button from '../../components/button/Button'
import Footer from '../../components/footer/Footer'
import { ArrowAnim } from '../../components/icons/CssIcons'
import { REGISTER } from '../../utils/constants'
import homeStyles from './home.module.scss'

const Home = () => {
  return (
    <>
    <div className={homeStyles.Wrapper}>
       <div>
            <h2> Lets Solve the Challenge Together </h2>
            enjoy the full assets of a <strong>collaborative environment </strong>with visual <br/>interractions
           
       </div>
       <div className={homeStyles.joinBtn}>
        <Button 
        to={REGISTER}
        text = "Join the colab"
        icon={<ArrowAnim />}
        />
       </div>
    </div>
    <div className={homeStyles.arbitrary}>
      <Footer />
    </div>
    </>
  )
}

export default Home