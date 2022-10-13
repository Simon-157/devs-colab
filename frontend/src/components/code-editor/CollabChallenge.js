import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
} from "@material-tailwind/react";

import mainEditorFrameStyle from "./main-editor-frame.module.scss";

export default function CollabChallenge({ challenge }) {
  return (
    <Menu
      animate={{
        mount: { y: 0 },
        unmount: { y: 25 },
      }}
    >
      <MenuHandler>
        <Button
          className={`bg-sky-400 ${mainEditorFrameStyle.btn}`}
          text="exit group"
        >
          challenge
        </Button>
      </MenuHandler>
      <MenuList className="w-80 px-2 py-1">
        <MenuItem className="py-1">
          <span className="mt-1">{challenge}</span>
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
