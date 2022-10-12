/* Importing the necessary libraries for the component to work. */

import React, { useContext, Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { v4 } from "uuid";
import toast from "react-hot-toast";
import {
  Button,
  Input,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
} from "@material-tailwind/react";

/* Importing the necessary Components */
import { userContext } from "../../contexts/userContext";
import FetchProblems from "../../utils/FetchProblems";
import problemStyles from "./problem-styles.module.scss";
import Loader from "../../components/loader/Loader";

const Challenges = (props) => {
  //   const [error, setError] = useState(false);
  //   const [errorMsg, setErrorMsg] = useState(" ");
  // const roomRef = useRef();
  // const userRef = useRef();
  const { currentUser } = useContext(userContext);
  const { data, isLoading } = useQuery("challenges", FetchProblems);
  // console.log(data)
  const [activeChallenge, setActiveChallenge] = useState({});
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();
  const handleOpen = () => {
    setOpen(!open);
    setRoomId("");
  };

  const handleShow = () => setShow(!show);

  const CurrentChallenge = (e) => {
    setActiveChallenge(e);
  };

  const createNewRoom = (e) => {
    e.preventDefault();
    const id = v4();
    setRoomId(id);
    toast.success("Created a new collab");
  };

  const joinRoom = () => {
    if (!roomId) {
      toast.error("ROOM ID & username is required");
      return;
    }

    // Redirect
    navigate(`/problems/${roomId}`, {
      state: {
        title: activeChallenge.title,
        content: activeChallenge.description,
        user: {
          username: currentUser.userName,
          avartar: currentUser.displayImg,
        },
      },
    });
  };

  return (
    <>
      {!isLoading ? (
        <>
          <Typography
            className="flex flex-row gap-4 place-items-center justify-center"
            variant="h5"
            color="current"
          >
            CHALLENGES
            <Button onClick={handleShow} className="bg-sky-100 text-sky-light">
              Join A Colab
            </Button>
            <Dialog
              open={show}
              handler={handleShow}
              animate={{
                mount: { scale: 1, y: 0 },
                unmount: { scale: 0.9, y: -100 },
              }}
            >
              <DialogHeader>
                <h2>create colab</h2>
              </DialogHeader>
              <DialogBody className="flex items-center justify-center flex-col gap-10">
                <Input
                  className="w-auto"
                  variant="outlined"
                  onChange={(e) => setRoomId(e.target.value)}
                  label="Room Id"
                  placeholder="collab Id"
                />
              </DialogBody>
              <DialogFooter>
                <Button variant="text" color="green" onClick={joinRoom}>
                  <span>Join</span>
                </Button>
              </DialogFooter>
            </Dialog>
          </Typography>
          <div className={problemStyles.problemCardsWrapper}>
            <div className={problemStyles.problemsContainer}>
              {data?.map((challenge) => {
                return (
                  <div
                    key={challenge.problem_id}
                    // onClick={() =>{startSubmitHandler()}}
                    className={problemStyles.problemCard}
                    onClick={() => {
                      CurrentChallenge(challenge);
                    }}
                  >
                    <Button onClick={handleOpen} className="text-sky-700">
                      Collab
                    </Button>
                    <p>{challenge.title}</p>
                    <p>{challenge.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
          <Dialog
            className="flex mt-6 justify-center place-items-center flex-col"
            open={open}
            handler={handleOpen}
            animate={{
              mount: { scale: 1, y: 0 },
              unmount: { scale: 0.9, y: -100 },
            }}
          >
            <DialogHeader>{activeChallenge.title}</DialogHeader>
            <DialogBody className="flex items-center justify-center flex-col gap-10">
              <Input
                className="w-auto"
                variant="outlined"
                label="Room Id"
                value={roomId}
                placeholder="read only"
                readOnly
              />
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
              {roomId === "" ? (
                <Button variant="text" color="green" onClick={createNewRoom}>
                  <span>Confirm</span>
                </Button>
              ) : (
                <div className="flex gap-4">
                  <Button
                    variant="text"
                    color="blue"
                    className="bg-sky-50"
                    onClick={joinRoom}
                  >
                    {" "}
                    Start
                  </Button>
                  <Button
                    variant="text"
                    className="bg-sky-50"
                    color="blue"
                    onClick={() => {
                      navigator.clipboard.writeText(roomId);
                      toast.success("Id coppied");
                    }}
                  >
                    CopyId
                  </Button>
                </div>
              )}
            </DialogFooter>
          </Dialog>
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default Challenges;

// const startSubmitHandler = (e) => {
//     const groupName = roomRef.current.value;
//     const userName = userRef.current.value;

//     if (!groupName || !userName) {
//       setError(true);
//       toast.error("Room or username cannot be empty");
//     } else {
//       socket.emit("check-user", { roomId: groupName, userName });
//       navigate(`/problems/${v4()}`, {
//         state: {
//           title: activeChallenge.title,
//           content: activeChallenge.description,
//         },
//       });
//     }
//     // navigate(`${v4()}`)
//   };
