/* This is importing the necessary libraries for the code to run. */
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
import Button from "../button/Button";
import mainEditorFrameStyle from "./main-editor-frame.module.scss"


const MainEditor = () => {
/* Setting the initial state of the code editor. */
const {state} = useLocation();
const { title, content } = state; // Read values passed on state
const problem = `/*** 
 *problem: ${title}
 *content: ${content}
**/
\n\n
//Your code goes here...
`
// console.log(title, content)
// console.log(params.challenge);
  const [code, setCode] = useState(problem);
  const [customInput, setCustomInput] = useState("");
  const [outputDetails, setOutputDetails] = useState(null);
  const [processing, setProcessing] = useState(null);
  const [theme, setTheme] = useState("cobalt");
  const [language, setLanguage] = useState(languageOptions[0]);

/* A custom hook that is used to detect if the user is pressing the enter key and the control key. */
  const enterPress = useKeyPress("Enter");
  const ctrlPress = useKeyPress("Control");

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
        showSuccessToast(`Compiled Successfully!`);
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
  }

  /* Setting the theme to oceanic-next. */
  useEffect(() => {
    defineTheme("oceanic-next").then((_) =>
      setTheme({ value: "oceanic-next", label: "Oceanic Next" })
    );
  }, []);

  const showSuccessToast = (msg) => {
    toast.success(msg || `Compiled Successfully!`, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  
  const showErrorToast = (msg, timer) => {
    toast.error(msg || `Something went wrong! Please try again.`, {
      position: "top-right",
      autoClose: timer ? timer : 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  return (
    <div 
      style = {{
        display:"flex", 
        flexDirection:"column",
        flexWrap:"wrap",
        width:"83%",
        height:"50%",
        borderRight:"2px solid #085e1a"

      }}
    >
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="h-4 w-full"></div>
      <div className="flex flex-row">
        <div className="px-4 py-2">
          <LanguagesDropdown onSelectChange={onSelectChange} />
        </div>
        <div className="px-4 py-2">
          <ThemeDropdown handleThemeChange={handleThemeChange} theme={theme} />
        </div>
        <div className = {mainEditorFrameStyle.groupButtons}>
          <div className = "px-0 py-2 flex w-max gap-2">
            <Button 
              text = "SAVE"
              to = "/save"
            />
        
            <Button 
              text = "exit group"
              to = "/save"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-row space-x-4 items-start px-4 py-4">
        <div style = {{width:"100%", height:"50%"}} className="flex flex-col justify-start items-end">
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