import React, { useRef, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
// import { problems } from '../../utils/dummy';
import { useQuery } from 'react-query';
import { socket } from '../../utils/socket'
import FetchProblems from '../../utils/FetchProblems'
import { v4 } from 'uuid';
import problemStyles from './problem-styles.module.scss'

const Challenges = (props) => {

    const { data, isError, isLoading } = useQuery('challenges', FetchProblems)
    console.log(data)
    const [activeChallenge, setActiveChallenge] = useState({}) 
    const navigate = useNavigate();

    

    const CurrentChallenge  = (e) =>{
        setShowModal(true)
        setActiveChallenge(e)

    }

    const startSubmitHandler = (e) => {
        const groupName = roomRef.current.value;
        const userName = userRef.current.value;

        if (!groupName || !userName) {
            setError(true);
            setErrorMsg('Enter Valid Room Name & your Name');
          } else {
            socket.emit('check-user', { roomId: groupName, userName });
            navigate(`/collab/${v4()}`)
          }
        // navigate(`${v4()}`)
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
                {isLoading ? <div>Loading...</div> : 
                <><div className={problemStyles.Header}><h1>Challenges</h1></div><div className={problemStyles.problemCardsWrapper}>
                      <div className={problemStyles.problemsContainer}>
                          {data?.map(challenge => {
                              return (
                                  <div
                                      key={challenge.problem_id}
                                      // onClick={() =>{startSubmitHandler()}}
                                      className={problemStyles.problemCard}
                                      onClick={() => { CurrentChallenge(challenge); } }

                                  >
                                      <p>{challenge.title}</p>
                                      <p>{challenge.description}</p>
                                  </div>
                              );
                          })}
                      </div>
                  </div></>}
            </div>

            {showModal? (
        
            <div className=" opacity-95 flex justify-center items-center bg-black fade fixed top-0 left-0  w-full h-full outline-none overflow-x-hidden overflow-y-auto">
            <div className=" relative w-auto my-6 mx-auto max-w-3xl">
                <div style={{backgroundColor: '#EAFCFF', opacity:"0 !important"}} className="border-0 rounded-lg shadow-lg relative flex flex-col w-full outline-none focus:outline-none">
                <div className="flex items-start justify-between p-5 -b border-solid border-gray-300 rounded-t ">
                    <h6 className="text-3xl font=semibold"> GENERATE ROOM : {activeChallenge.title}</h6>
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
                        <input type="text" name="username" placeholder=" " ref={userRef} className="block p-4 w-full text-lg appearance-none focus:outline-none bg-transparent" />
                        <label for="username" className="absolute top-0 text-lg p-4 -z-1 duration-300 origin-0">Username</label>
                    </div>
                    <div className="outline relative border-2 focus-within:border-blue-500">
                        <input type="text" name="groupname" placeholder=" " ref={roomRef} className="block p-4 w-full text-lg appearance-none focus:outline-none bg-transparent" />
                        <label for="groupname" className="absolute top-0 text-lg p-4 -z-1 duration-300 origin-0">Group Name</label>
                    </div>
                </div>
                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                    {error ? <div style={{ fontSize: "25px" , color: "#e85a71"}}>{errorMsg}</div> : null}
                    <button
                    style={{backgroundColor:"#e85a71"}}
                    className="text-white  active:bg-yellow-700 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    onClick={() => setShowModal(false)}
                    >
                    Close
                    </button>
                    <button
                    style={{backgroundColor:"#073b6b"}}
                    className="text-white active:bg-yellow-700 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    onClick={() => {startSubmitHandler()}}
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