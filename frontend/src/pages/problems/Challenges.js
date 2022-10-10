/* Importing the necessary libraries for the component to work. */

import React, { useContext,useRef, Fragment, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { v4 } from 'uuid';
import toast from 'react-hot-toast';
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
  } from "@material-tailwind/react";
   

/* Importing the necessary Components */
import {userContext} from "../../contexts/userContext"
import { socket } from '../../utils/socket'
import FetchProblems from '../../utils/FetchProblems'
import problemStyles from './problem-styles.module.scss'
import Loader from '../../components/loader/Loader';

const Challenges = (props) => {

    const {currentUser} = useContext(userContext)
    const { data, isLoading } = useQuery('challenges', FetchProblems)
    // console.log(data)
    const [activeChallenge, setActiveChallenge] = useState({}) 
    const [open, setOpen] = useState(false);
    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState(" ")
    const [roomId, setRoomId] = useState('');
    const roomRef = useRef();
    const userRef = useRef();
    const navigate = useNavigate();
    const handleOpen = () => setOpen(!open);


    const CurrentChallenge  = (e) =>{
        setActiveChallenge(e)
    }

    const createNewRoom = (e) => {
        e.preventDefault();
        const id = v4();
        setRoomId(id);
        toast.success('Created a new collab');
    };

    const joinRoom = () => {
        if (!roomId) {
            toast.error('ROOM ID & username is required');
            return;
        }

        // Redirect
        navigate(`/problems/${roomId}`,{ 
            state: { 
                title:activeChallenge.title, 
                content: activeChallenge.description,
                user:{
                    username:currentUser.userName,
                    avartar:currentUser.displayImg
                }
            } 
        })

    };

    const startSubmitHandler = (e) => {
        const groupName = roomRef.current.value;
        const userName = userRef.current.value;

        if (!groupName || !userName) {
            setError(true);
            toast.error("Room or username cannot be empty")
          } else {
            socket.emit('check-user', { roomId: groupName, userName });
            navigate(`/problems/${v4()}`,{ state: { title:activeChallenge.title, content: activeChallenge.description } })
          }
        // navigate(`${v4()}`)
      };
    

  return (
    <Fragment>
        {!isLoading ? 
        
            <><h1>Challenges</h1>
            <div className={problemStyles.problemCardsWrapper}>
                <div className={problemStyles.problemsContainer}>
                    {data?.map(challenge => {
                        return (
                            <div
                                key={challenge.problem_id}
                                // onClick={() =>{startSubmitHandler()}}
                                className={problemStyles.problemCard}
                                onClick={() => { CurrentChallenge(challenge); } }
                            >  
                                <Button onClick={handleOpen} className ="text-sky-700">
                                    Collab
                                </Button>
                                <p>{challenge.title}</p>
                                <p>{challenge.description}</p>
                            </div>
                        );
                    })}
                </div>
                
                <Dialog
                    className="flex items-center justify-center flex-col"
                    open={open}
                    handler={handleOpen}
                    animate={{
                    mount: { scale: 1, y: 0 },
                    unmount: { scale: 0.9, y: -100 },
                    }}
                >
                    <DialogHeader>Its a simple dialog.</DialogHeader>
                    <DialogBody divider>
                    Lorem, ipsum 
                    </DialogBody>
                    <DialogFooter>
                    <Button
                        variant="text"
                        color="red"
                        onClick={handleOpen}
                        className="mr-1"
                    >
                        <span>Cancel</span>
                    </Button>
                    <Button variant="gradient" color="green" onClick={handleOpen}>
                        <span>Confirm</span>
                    </Button>
                    </DialogFooter>
                </Dialog>
            </div></> : 
            <Loader />}
    </Fragment>
           
    )
}

export default Challenges