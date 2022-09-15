import React, {useState} from 'react'
import axios from 'axios'

const AddChallenge = () => {
    const [title, setTitle] = useState()
    const [content, setContent] = useState()

    const handleSubitems = () =>{
        const info = [
            title,
            content
        ]
        
        axios({
            method: 'post',
            url: "http://localhost:3000/admin",
            data: info
          }).then((response) => {console.log(response)})
          .catch((error) => {console.log(error)})
      
    }

  return (
   
    <div className="container w-3/5 p-20  grid gap-2 mb-1 content-center md:grid-cols-1">
        <div className="mb-6 object-center">
            <label for="success" className="block mb-2 text-lg font-medium text-green-700 dark:text-green-1000">Challenge Title</label>
            <input 
                type="text" 
                id="success" 
                className="bg-green-50 border border-green-500 text-green-100 dark:text-green-100 placeholder-green-100 dark:placeholder-green-100 text-md rounded-lg focus:ring-green-500 focus:border-green-500 block w-4/5 p-2.5 dark:bg-gray-700 dark:border-green-500" 
                placeholder="Challenge Title" 
                onChange={(e) => {setTitle(e.target.value)}}
            />
            <p className="mt-2 text-sm text-green-600 dark:text-green-500"><span className="font-medium">Well done!</span> Some success messsage.</p>
            </div>
            <div className="mb-6">
            <label for="success" className="block mb-2 text-lg font-medium text-green-700 dark:text-green-1000">Challenge    Content</label>
            <textarea type="text" 
                id="success" 
                className="bg-green-50 border border-green-500 text-green-100 dark:text-green-100 placeholder-green-700 dark:placeholder-green-100 text-md    rounded-lg focus:ring-green-500 focus:border-green-500 block w-4/5 p-2.5 dark:bg-gray-700 dark:border-green-500" 
                placeholder="Challenge description" 
                onChange={(e) => {setContent(e.target.value)}}
            />
            <p className="mt-2 text-sm text-green-600 dark:text-green-500"><span className="font-medium">Well done!</span> Some success messsage.</p>
            <button 
                type="button" 
                class="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
            >
            Save Challenge
            </button>
        </div>
    </div>

  )
}

export default AddChallenge