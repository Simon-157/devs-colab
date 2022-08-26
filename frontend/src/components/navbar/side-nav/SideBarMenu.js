import React, { useState } from 'react'
import Button from '../../button/Button';
import sideMenuStyles from "./side-menu.module.scss"


const SideBarMenu = ({tag, data, value, onChange, Icon}) => {
    
    const [searchValue, setSearchValue] = useState("")
    // console.log(tag, data)
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

                    {
                        // eslint-disable-next-line array-callback-return
                        data.filter(problem => {
                                if (searchValue === '') {
                                    return problem;
                                } else if (problem.title.toLowerCase().includes(searchValue.toLowerCase())) {
                                    
                                    return problem;
                                }
                        
                        }).map((result) => {
                            console.log(result);
                                return (
                                    <div className={sideMenuStyles.listItems}
                                        key={result.id}
                                        onClick={() => this.makeGroup(result.id)}>
                                        <p>{result.title}</p>
                                    </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    </div>
  )
}

export default SideBarMenu