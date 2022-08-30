import React, { useState } from "react";
import Loader from "../loader/Loader"
import Editor from "@monaco-editor/react";

const CodeEditorWindow = ({ onChange, language, code, theme }) => {
  const [value, setValue] = useState(code || "");

  const handleEditorChange = (value) => {
    setValue(value);
    onChange("code", value);
  };

  return (
    <div className="overlay rounded-md overflow-hidden w-full h-full shadow-4xl">
      {!Editor ? 
      <Loader /> :
      <Editor
      height="85vh"
      width={`100%`}
      language={language || "javascript"}
      value={value}
      theme={theme}
      defaultValue="// your code goes here"
      onChange={handleEditorChange}
    />  }
    </div>
  );
};
export default CodeEditorWindow;