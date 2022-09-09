import React, { useRef, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { problems } from '../../utils/dummy'
import { socket } from '../../utils/socket'
import { v4 } from 'uuid';
import problemStyles from './problem-styles.module.scss'

const Challenges = (props) => {
    const [Challenges] = useState(problems)
    const navigate = useNavigate();
    const startSubmitHandler = (e) => {
        // navigate(`${v4()}`)
        navigate(`/problems/${v4()}`)
      };
    
    const [showModal, setShowModal] = useState(false);

    const roomRef = useRef();
    const userRef = useRef();
    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState(" ")

    useEffect(() => {

        socket.on("err-user-connected", ({ error})=>{
            if(!error){
                const groupName = roomRef.current.value;
                const userName = userRef.current.value;

                sessionStorage.setItem("user", userName);
                props.history.push(`/collab/${groupName}`);
            }
            else{
                setError(error);
                setErrorMsg("User with this name is already connected");
            }

        });
    
    }, [props.history])

    const Join = () => {
        const groupName = roomRef.current.value;
        const userName = userRef.current.value;

        if (!groupName || !userName) {
            setError(true);
            setErrorMsg('Enter Valid Room Name & your Name');
          } else {
            socket.emit('check-user', { roomId: groupName, userName });
          }
    }
    

  return (
        <>

            <div>
                <div className = {problemStyles.Header}><h1>Challenges</h1></div>
                    <div className = {problemStyles.problemCardsWrapper}>
                    <div className = {problemStyles.problemsContainer}>
                    {
                        Challenges.map(challenge =>{
                            return(
                                <div
                                    key = {challenge.id} 
                                    // onClick={() =>{startSubmitHandler()}}
                                    className = {problemStyles.problemCard}
                                    onClick={() => setShowModal(true)}
                                    
                                >
                                    <p>{challenge.title}</p>
                                    <p>{challenge.content}</p>
                                </div>
                            )
                        })
                    }
                    </div>
                    </div>
            </div>

            {showModal? (
        
            <div className=" opacity-90 flex justify-center items-center bg-black fade fixed top-0 left-0  w-full h-full outline-none overflow-x-hidden overflow-y-auto">
            <div className=" relative w-auto my-6 mx-auto max-w-3xl">
                <div style={{backgroundColor: '#EAFCFF', opacity:"0 !important"}} className="border-0 rounded-lg shadow-lg relative flex flex-col w-full outline-none focus:outline-none">
                <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t ">
                    <h3 className="text-3xl font=semibold"> GENERATE ROOM</h3>
                    <button
                    className="bg-transparent border-0 text-black float-right"
                    onClick={() => setShowModal(false)}
                    >
                    <span className="text-black opacity-7 h-6 w-6 text-xl block bg-gray-400 py-0 rounded-full">
                        x
                    </span>
                    </button>
                </div>
                <div className="relative p-6 flex-auto">
                    <div className="outline relative border-2 focus-within:border-blue-500">
                        <input type="text" name="username" placeholder=" " className="block p-4 w-full text-lg appearance-none focus:outline-none bg-transparent" />
                        <label for="username" className="absolute top-0 text-lg p-4 -z-1 duration-300 origin-0">Username</label>
                    </div>
                    <div className="outline relative border-2 focus-within:border-blue-500">
                        <input type="text" name="groupname" placeholder=" " className="block p-4 w-full text-lg appearance-none focus:outline-none bg-transparent" />
                        <label for="groupname" className="absolute top-0 text-lg p-4 -z-1 duration-300 origin-0">Group Name</label>
                    </div>
                </div>
                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                    {error ? <div style={{ fontSize: "25px" , color: "#e85a71"}}>{errorMsg}</div> : null}
                    <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    onClick={() => setShowModal(false)}
                    >
                    Close
                    </button>
                    <button
                    className="text-white bg-yellow-500 active:bg-yellow-700 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    onClick={() => {Join()}}
                    >
                    Join
                    </button>

                </div>
                </div>
            </div>
            </div>
        
        ) : null}
        </>
  )
}

export default Challenges