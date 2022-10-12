import { Toaster } from "react-hot-toast";
export const Toast = () => {
  return (
    <Toaster
      toastOptions={{
        success: {
          style: {
            background: "#15c33b",
            color: "#ffff",
          },
        },
        error: {
          style: {
            backgroundColor: "red",
            color: "#ffff",
          },
        },
      }}
    />
  );
};

export default Toast;
