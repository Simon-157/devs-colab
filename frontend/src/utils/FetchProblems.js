//FetchApi.js

import axios from "axios";
    
 const FetchProblems = async () => {
    const { data } = await axios.get('https://localhost:5000/challenges')
    return data
}
    
export default FetchProblems;