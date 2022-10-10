import React, {useState} from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const AddChallenge = () => {
    const [title, setTitle] = useState()
    const [content, setContent] = useState()
    const [success, setSuccess] = useState(false);
    const [errorMsg1, setErrorMsg1] = useState(" ")
    const [errorMsg2, setErrorMsg2] = useState(" ")

    console.log(title, content)

    const handleSubmit = (e) =>{
        e.preventDefault()
        if(!title){
            setErrorMsg1('Title cannot be empty');
        }

        if(!content){
            setErrorMsg2('content cannot be empty');
        }
        
        else{
            setSuccess(true);
            axios({
                method: 'post',
                // eslint-disable-next-line no-useless-concat
                url: `http://localhost:5000/challenges/add-challenge/${title}`,
                withCredentials: true,
                data:{
                    topic:title,
                    description:content,
                }
            })
            .catch((error) => {console.log(error)})
            setTitle(" ")
            setContent(" ")
            e.target.reset();
            
        }
    }

    const showToastMessage = () => {
        toast.success('Success Notification !', {
            position: toast.POSITION.TOP_RIGHT
        });
      };
  return (
   
    <div className="container w-3/5 p-20  grid gap-2 mb-1 content-center md:grid-cols-1">
        <form onSubmit={handleSubmit}>
        <div className="mb-6 object-center">
        {success?<p className="mt-2 text-sm text-green-600 dark:text-green-500"><span className="font-medium">Well done!</span> Successfully saved challenge.</p>:""}

            <label htmlFor="success" className="block mb-2 text-lg font-medium text-green-700 dark:text-green-1000">Challenge Title</label>
            <input 
                type="text" 
                id="success" 
                className="bg-green-50 border border-green-500 text-green-100 dark:text-green-100 placeholder-green-100 dark:placeholder-green-100 text-md rounded-lg focus:ring-green-500 focus:border-green-500 block w-4/5 p-2.5 dark:bg-gray-700 dark:border-green-500" 
                placeholder="Challenge Title" 
                onChange={(e) => {setTitle(e.target.value)}}
            />
            {errorMsg1 !==" " &&<p className="mt-2 text-sm text-green-600 dark:text-green-500"><span className="font-medium">Oops something went wrong! </span>{errorMsg1}</p>}
            </div>
            <div className="mb-6">
            <label htmlFor="success" className="block mb-2 text-lg font-medium text-green-700 dark:text-green-1000">Challenge    Content</label>
            <textarea type="text" 
                id="success" 
                className="bg-green-50 border border-green-500 text-green-100 dark:text-green-100 placeholder-green-700 dark:placeholder-green-100 text-md    rounded-lg focus:ring-green-500 focus:border-green-500 block w-4/5 p-2.5 dark:bg-gray-700 dark:border-green-500" 
                placeholder="Challenge description" 
                onChange={(e) => {setContent(e.target.value)}}
            />
            {errorMsg2 !==" " &&<p className="mt-2 text-sm text-green-600 dark:text-green-500"><span className="font-medium">Oops something went wrong! </span>{errorMsg2}</p>}

            <button 
                type="submit" 
                className="text-white my-5 bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                // onClick={handleSubmit}
                onClick={showToastMessage}
           >
            Save Challenge
            </button>
            <ToastContainer />
        </div>
        </form>
    </div>

  )
}

export default AddChallenge