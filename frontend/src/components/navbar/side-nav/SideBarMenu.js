//libraries
import React, { useState, useContext } from 'react'
import { useQuery } from "react-query"
import { userContext } from '../../../contexts/userContext';

//components
import FetchProblems from "../../../utils/FetchProblems"

import Button from '../../button/Button';
import sideMenuStyles from "./side-menu.module.scss"


const SideBarMenu = ({tag, value, onChange, Icon, Icon2}) => {
    const { data } = useQuery('challenges2', FetchProblems)
    const {currentUser} = useContext(userContext);
    console.log(currentUser)
    const [searchValue, setSearchValue] = useState("")
    console.log(data)
  return (
    <div className = {sideMenuStyles.container}>
        <div className = {sideMenuStyles.sideBarWrapper}>
            <div className = {sideMenuStyles.sideSec}>
                <Button
                    icon={Icon}
                />
                <div className = {sideMenuStyles.sideMenu}>
                    <h4>{tag}</h4>
                    <div className={sideMenuStyles.search}>
                        <input type="text" placeholder="Search" onChange={(e) =>{setSearchValue(e.target.value)}} />
                    </div>
                    {/* {isLoading? <>Loading...</>: ""} */}

                    {
                        // eslint-disable-next-line array-callback-return
                        data?.filter(problem => {
                                if (searchValue === '') {
                                    return problem;
                                } else if (problem.title.toLowerCase().includes(searchValue.toLowerCase())) {
                                    
                                    return problem;
                                }
                        
                        }).map((result) => {
                            // console.log(result);
                                return (
                                    <div className={sideMenuStyles.listItems}
                                        key={result.problem_id}
                                        onClick={() => this.makeGroup(result.problem_id)}>
                                        <p>{result.title}</p>
                                    </div>
                            )
                        })
                    }
                </div>
            </div>
            <div className = {sideMenuStyles.sideSec}>
                <Button
                    icon={Icon2}
                />
                <div className = {sideMenuStyles.sideMenu}>
                    <h4>{tag}</h4>
                    <div className={sideMenuStyles.search}>
                        <input type="text" placeholder="Search" onChange={(e) =>{setSearchValue(e.target.value)}} />
                    </div>
              

                    {
                        // eslint-disable-next-line array-callback-return
                        data?.filter(problem => {
                                if (searchValue === '') {
                                    return problem;
                                } else if (problem.title.toLowerCase().includes(searchValue.toLowerCase())) {
                                    
                                    return problem;
                                }
                        
                        }).map((result) => {
                            // console.log(result);
                                return (
                                    <div className={sideMenuStyles.listItems}
                                        key={result.problem_id}
                                        onClick={() => this.makeGroup(result.problem_id)}>
                                        <p>{result.title}</p>
                                    </div>
                            )
                        })
                    }
                </div>
            </div>
                <div className ={sideMenuStyles.sideSec}>
                    {currentUser &&
                        <button>
                            <img className = "inline mr-2 object-cover w-8 h-8 rounded-full" src={currentUser?.profileImg } alt={currentUser?.userName}/>
                            {/* {currentUser?.userName.split(' ')[0]} */}
                        </button>
                    }
                </div><br/>
        </div>
    </div>
  )
}

export default SideBarMenu