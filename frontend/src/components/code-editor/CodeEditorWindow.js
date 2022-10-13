import React, { useState, useRef, useEffect } from "react";
import Loader from "../loader/Loader";
import Editor from "@monaco-editor/react";

const CodeEditorWindow = ({
  socketRef,
  roomId,
  onChange,
  language,
  code,
  theme,
}) => {
  const [value, setValue] = useState(code || "");
  const ideRef = useRef(null);

  const handleEditorDidMount = (editor, monaco) => {
    ideRef.current = editor;
    // return ideRef;
  };

  useEffect(() => {
    const initialize = async () => {
      console.log(ideRef.current);
      ideRef.current.on("change", (instance, changes) => {
        const { origin } = changes;
        const code = instance.getValue();
        onChange(code);
        if (origin !== "setValue") {
          socketRef.current.emit("code-change", {
            roomId,
            code,
          });
        }
      });
    };
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on("code-change", ({ code }) => {
        console.log(code);
        if (code !== null) {
          ideRef.current.setValue(code);
        }
      });
    }

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      socketRef.current.off("code-change");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socketRef.current]);

  const handleEditorChange = (value) => {
    setValue(value);
    onChange("code", value);
  };

  return (
    <div className="overlay rounded-md overflow-hidden w-full h-full shadow-4xl">
      {!Editor ? (
        <Loader />
      ) : (
        <Editor
          height="85vh"
          width={`100%`}
          language={language || "javascript"}
          value={value}
          theme={theme}
          defaultValue="// your code goes here"
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
        />
      )}
    </div>
  );
};
export default CodeEditorWindow;
