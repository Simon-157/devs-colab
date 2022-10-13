/* This is importing the necessary libraries for the code to run. */
import React, { useEffect, useState, useRef } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  Navigate,
} from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

/* Importing the files from the directory. */
import CodeEditorWindow from "./CodeEditorWindow";
import { defineTheme } from "../../utils/editor-constants/monacoTheme";
import OutputWindow from "./OutPutWin";
import CustomInput from "./CustomInput";
import OutputDetails from "./OutPut";
import ThemeDropdown from "./ThemeMenu";
import LanguagesDropdown from "./LanguagesDropMenu";
import { languageOptions } from "./../../utils/editor-constants/languages";
import { classnames } from "./../../utils/general";
import useKeyPress from "./../../hooks/useKeyPress";
// import Button from "../button/Button";
import { Button } from "@material-tailwind/react";
import mainEditorFrameStyle from "./main-editor-frame.module.scss";
import { socket } from "./../../utils/socket";
import ParticipantsMenu from "./ParticipantsMenu";

const MainEditor = () => {
  /* Setting the initial state of the code editor. */
  const { state } = useLocation();
  const { title, content } = state; // Read values passed on state
  const problem = `/***
 *problem: ${title}
 *content: ${content}
**/
\n\n
//Your code goes here...
`;
  // console.log(title, content)
  // console.log(params.challenge);
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const location = useLocation();
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  console.log(location.state);

  const [code, setCode] = useState(problem);
  const [customInput, setCustomInput] = useState("");
  const [outputDetails, setOutputDetails] = useState(null);
  const [processing, setProcessing] = useState(null);
  const [theme, setTheme] = useState("cobalt");
  const [language, setLanguage] = useState(languageOptions[0]);

  /* A custom hook that is used to detect if the user is pressing the enter key and the control key. */
  const enterPress = useKeyPress("Enter");
  const ctrlPress = useKeyPress("Control");

  useEffect(() => {
    const initializeConnection = async () => {
      socketRef.current = await socket();
      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));
      const handleErrors = (e) => {
        console.log("connection error:,", e);
        toast.error("connection failed, try again");
        navigate("/problems");
      };

      socketRef.current.emit("join", {
        roomId,
        user: location.state?.user,
      });

      socketRef.current.on("joined", ({ clients, user, socketId }) => {
        if (user.username !== location.state?.username) {
          toast.success(`${user.username} joined the collab.`);
          console.log(`${user.username} joined`);
        }
        setClients(clients);
        socketRef.current.emit("sync-code", {
          code: codeRef.current,
          socketId,
        });
      });

      socketRef.current.on("disconnected", ({ socketId, user }) => {
        toast.success(`${user.username} left the colab. `);
        setClients((prev) => {
          return prev.filter((client) => client.socketId !== socketId);
        });
      });
    };
    initializeConnection();

    return () => {
      socketRef.current.disconnect();
      socketRef.current.off("joined");
      socketRef.current.off("disconnected");
    };
  }, []);

  async function copyRoomId() {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room ID has been copied to your clipboard");
    } catch (err) {
      toast.error("Could not copy the Room ID");
      console.error(err);
    }
  }

  function leaveRoom() {
    navigate("/problems");
  }

  /**
   * OnSelectChange is a function that takes a single argument, sl, and returns a console.log statement
   * that logs the string "selected Option..." and the value of sl, and then sets the value of language
   * to the value of sl.
   * @param sl - the selected option
   */
  const onSelectChange = (sl) => {
    console.log("selected Option...", sl);
    setLanguage(sl);
  };

  /* This is a custom hook that is used to detect if the user is pressing the enter key and the control
key. */
  useEffect(() => {
    if (enterPress && ctrlPress) {
      console.log("enterPress", enterPress);
      console.log("ctrlPress", ctrlPress);
      handleCompile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctrlPress, enterPress]);
  /**
   * `onChange` is a function that takes two arguments, `action` and `data`, and returns a switch
   * statement that takes two cases, `code` and `default`, and returns a function that sets the state
   * of `code` to `data` and a warning message, respectively.
   * @param action - The action that was performed.
   * @param data - The data that is passed to the onChange function.
   */
  const onChange = (action, data) => {
    switch (action) {
      case "code": {
        setCode(data);
        break;
      }
      default: {
        console.warn("case not handled!", action, data);
      }
    }
  };

  /**
   * It takes the code from the textarea, encodes it in base64, and sends it to the API.
   */
  const handleCompile = () => {
    setProcessing(true);
    const formData = {
      language_id: language.id,
      // encode source code in base64
      source_code: btoa(code),
      stdin: btoa(customInput),
    };
    const options = {
      method: "POST",
      url: process.env.REACT_APP_RAPID_API_URL,
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "content-type": "application/json",
        "Content-Type": "application/json",
        "X-RapidAPI-Host": process.env.REACT_APP_RAPID_API_HOST,
        "X-RapidAPI-Key": process.env.REACT_APP_RAPID_API_KEY,
      },
      data: formData,
    };

    axios
      .request(options)
      .then(function (response) {
        console.log("res.data", response.data);
        const token = response.data.token;
        checkStatus(token);
      })
      .catch((err) => {
        let error = err.response ? err.response.data : err;
        // get error status
        let status = err.response?.status;
        console.log("status", status);
        if (status === 429) {
          console.log("too many requests", status);

          showErrorToast(
            `Quota of 100 requests exceeded for the Day! Please read the blog on freeCodeCamp to learn how to setup your own RAPID API Judge0!`,
            10000
          );
        }
        setProcessing(false);
        console.log("catch block...", error);
      });
  };

  /**
   * It checks the status of the request and if it's still processing, it waits 2 seconds and then
   * checks again.
   * @param token - The token returned from the initial request
   * @returns The response is a JSON object with the following structure:
   */
  const checkStatus = async (token) => {
    const options = {
      method: "GET",
      url: process.env.REACT_APP_RAPID_API_URL + "/" + token,
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "X-RapidAPI-Host": process.env.REACT_APP_RAPID_API_HOST,
        "X-RapidAPI-Key": process.env.REACT_APP_RAPID_API_KEY,
      },
    };
    try {
      let response = await axios.request(options);
      let statusId = response.data.status?.id;

      // Processed - we have a result
      if (statusId === 1 || statusId === 2) {
        // still processing
        setTimeout(() => {
          checkStatus(token);
        }, 2000);
        return;
      } else {
        setProcessing(false);
        setOutputDetails(response.data);
        showSuccessToast("Compiled Successfully!");
        console.log("response.data", response.data);
        return;
      }
    } catch (err) {
      console.log("err", err);
      setProcessing(false);
      showErrorToast();
    }
  };

  /**
   * If the theme is light or vs-dark, set the theme. Otherwise, define the theme and then set the
   * theme.
   * @param th - the theme object that is passed to the function.
   */
  const handleThemeChange = (th) => {
    const theme = th;
    console.log("theme...", theme);

    if (["light", "vs-dark"].includes(theme.value)) {
      setTheme(theme);
    } else {
      defineTheme(theme.value).then((_) => setTheme(theme));
    }
  };

  /* Setting the theme to oceanic-next. */
  useEffect(() => {
    defineTheme("oceanic-next").then((_) =>
      setTheme({ value: "oceanic-next", label: "Oceanic Next" })
    );
  }, []);

  const showSuccessToast = (msg) => {
    toast.success(msg || `Compiled Successfully!`);
  };

  const showErrorToast = (msg, timer) => {
    toast.error(msg || `Something went wrong! Please try again.`);
  };

  if (!location.state) {
    return <Navigate to="/problems" />;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flexWrap: "wrap",
        width: "83%",
        height: "50%",
        borderRight: "2px solid #085e1a",
      }}
    >
      <div className="h-4 w-full"></div>
      <div className="flex flex-row">
        <div className="px-4 py-2">
          <LanguagesDropdown onSelectChange={onSelectChange} />
        </div>
        <div className="px-4 py-2">
          <ThemeDropdown handleThemeChange={handleThemeChange} theme={theme} />
        </div>
        <div className={mainEditorFrameStyle.groupButtons}>
          <div className="px-0 py-2 flex w-max gap-2">
            <Button
              className={`bg-green-400 ${mainEditorFrameStyle.btn}`}
              variant="filled"
              color="green"
              onClick={copyRoomId}
            >
              save
            </Button>
            <Button
              className={`bg-sky-400 ${mainEditorFrameStyle.btn}`}
              text="exit group"
              onClick={leaveRoom}
            >
              challenge
            </Button>
            <ParticipantsMenu clients={clients} />
            <Button
              className={`bg-red-400 ${mainEditorFrameStyle.btn}`}
              text="exit group"
              onClick={leaveRoom}
            >
              exit collab
            </Button>
          </div>
        </div>
        {/* <Button variant="text" onClick={copyRoomId} /> */}
      </div>
      <div className="flex flex-row space-x-4 items-start px-4 py-4">
        <div
          style={{ width: "100%", height: "50%" }}
          className="flex flex-col justify-start items-end"
        >
          <CodeEditorWindow
            code={code}
            onChange={onChange}
            language={language?.value}
            theme={theme.value}
          />
        </div>

        <div className="right-container flex flex-shrink-0 w-[30%] flex-col">
          <OutputWindow outputDetails={outputDetails} />

          <div className="flex flex-col items-end">
            <CustomInput
              customInput={customInput}
              setCustomInput={setCustomInput}
            />
            <button
              onClick={handleCompile}
              disabled={!code}
              className={classnames(
                "mt-4 border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 hover:shadow transition duration-200 bg-white flex-shrink-0",
                !code ? "opacity-50" : ""
              )}
            >
              {processing ? "Processing..." : "Compile and Execute"}
            </button>
          </div>
          {outputDetails && <OutputDetails outputDetails={outputDetails} />}
        </div>
      </div>
    </div>
  );
};
export default MainEditor;
