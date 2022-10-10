/* Importing the useContext hook from react. */
import React, {useContext} from 'react'



/* Importing the components and the styles from the folder. */
import Button from '../../components/button/Button'
import Footer from '../../components/footer/Footer'
import { LOGIN, PROBLEMS } from '../../utils/constants'
import homeStyles from './home.module.scss'
import CodeShot from  "../../assets/code-shot.png"
import { ArrowIcon } from '../../components/icons/SvgIcons'
import { userContext } from '../../contexts/userContext'

const Home = () => {
  const {currentUser} = useContext(userContext)


  return (
    <>
    <div className={homeStyles.Wrapper}>
       <div>
            <h2> Lets Solve the Challenge Together </h2>
            enjoy the full assets of a <strong>collaborative environment </strong>with visual <br/>interractions
           
       </div>
       <div className={homeStyles.joinBtn} 
       >
        {!currentUser &&
          <Button 
          to={LOGIN}
          text = "Join the colab"
          icon={<ArrowIcon />}
          />
        }
        {currentUser &&
          <Button 
          to={PROBLEMS}
          text = "Join the colab"
          icon={<ArrowIcon />}
          
          />
        }
       </div>
        <div className = {homeStyles.codeShot}>
          <img src={CodeShot} alt= "code-shot"/>
        </div>
    </div>
    <div className={homeStyles.arbitrary}>
      <Footer />
    </div>
    </>
  )
}

export default Home