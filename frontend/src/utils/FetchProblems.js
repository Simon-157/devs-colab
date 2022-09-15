//FetchApi.js

import axios from "axios";
    
 const FetchProblems = async () => {
    const { data } = await axios.get('http://localhost:5000/challenges/get-challenges')
    return data
}
    
export default FetchProblems;