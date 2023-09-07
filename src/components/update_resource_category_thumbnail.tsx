import { ResourceModel } from "dd_server_api_web/dist/model/ResourceModel";
import React from "react";
import { getAxiosHeader, host } from "../utils/request";
import { Box, IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { fileOpen } from "browser-fs-access";
import { ApiResponse } from "../models/app_model";
import axios from "axios";
import { useSetRecoilState } from "recoil";
import { successMessageProvider } from "../providers/modal/success_modal";

type Props = {
  id: number;
  onSuccess?: () => void;
};

///接口
async function api(params: any): Promise<ApiResponse<ResourceModel>> {
  let data = await axios.post(host + "/api/auth/resource-thumbnail", params, {
    ...getAxiosHeader(),
  });
  return data.data;
}

///修改缩略图
const UpdateResourceCategoryThumbnail: React.FC<Props> = ({
  id,
  onSuccess,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const setMsg = useSetRecoilState(successMessageProvider);
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{
        position: "absolute",
        right: 4,
        top: 4,
      }}
    >
      <React.Fragment>
        <Box
          sx={{ display: "flex", alignItems: "center", textAlign: "center" }}
        >
          <Tooltip title="菜单">
            <IconButton
              onClick={handleClick}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={open ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              <MoreVertIcon />
            </IconButton>
          </Tooltip>
        </Box>
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&:before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem
            onClick={async () => {
              handleClose();
              try {
                const blob = await fileOpen({
                  mimeTypes: ["image/*"],
                });
                let form = new FormData();
                form.append("file", blob);
                form.append("id", `${id}`);
                let result = await api(form);
                console.log(result);
                if (result.success) {
                  onSuccess?.();
                } else {
                  setMsg(result.message);
                }
              } catch (error) {
                console.log(error);
              }
            }}
          >
            修改图片
          </MenuItem>
        </Menu>
      </React.Fragment>
    </Box>
  );
};
export default UpdateResourceCategoryThumbnail;
