import React from 'react'

const Admin = () => {
  return (
    <div>
        <button type="button" data-placement="bottom" data-target="tooltip_trigger" class="inline-block px-6 py-3 font-bold text-center text-white uppercase align-middle transition-all rounded-lg cursor-pointer bg-gradient-to-tl from-blue-500 to-violet-500 leading-normal text-xs ease-in tracking-tight-rem shadow-md bg-150 bg-x-25 active:opacity-85 hover:shadow-md">Tooltip bottom</button>
<div class="z-50 hidden px-2 py-1 text-center text-white bg-black rounded-lg max-w-46 text-sm" id="tooltip" role="tooltip" data-target="tooltip">
  My tooltip
  <div id="arrow" class="invisible absolute h-2 w-2 bg-inherit before:visible before:absolute before:h-2 before:w-2 before:rotate-45 before:bg-inherit before:content-['']" data-popper-arrow></div>
</div>
    </div>
  )
}

export default Admin