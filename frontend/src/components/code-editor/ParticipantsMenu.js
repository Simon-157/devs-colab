import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
} from "@material-tailwind/react";

import mainEditorFrameStyle from "./main-editor-frame.module.scss";

export default function ParticipantsMenu({ clients }) {
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
          participants
        </Button>
      </MenuHandler>
      <MenuList>
        {clients?.map((client, index) => {
          return <MenuItem>{client.username}</MenuItem>;
        })}
      </MenuList>
    </Menu>
  );
}
