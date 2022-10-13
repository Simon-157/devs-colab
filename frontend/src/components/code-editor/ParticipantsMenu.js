import {
  Avatar,
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
      <MenuList className="w-80 px-2 py-1">
        {clients?.map((client, index) => {
          return (
            <MenuItem className="py-1">
              {" "}
              <div className="flex justify-items-end flex-row ">
                <Avatar
                  className="mr-1"
                  size="xs"
                  src={client?.user.avartar}
                  alt="avatar"
                  variant="circular"
                />
                <span className="mt-1">{client?.user.username}</span>
                <span className="absolute right-1 mt-1 text-green-400 place-items-center ">
                  online
                </span>
              </div>
            </MenuItem>
          );
        })}
      </MenuList>
    </Menu>
  );
}
