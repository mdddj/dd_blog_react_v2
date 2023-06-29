import React from "react";
import {useRecoilState} from "recoil";
import {successMessageProvider} from "../../providers/modal/success_modal";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";

const AppSuccessModel: React.FC = () => {

  const [msg,setMsg] = useRecoilState(successMessageProvider)

  return (
      <Dialog  open={msg!==undefined} onClose={()=>setMsg(undefined)}>
        <DialogTitle>提示</DialogTitle>
        <DialogContent>
          {msg}
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setMsg(undefined)}>
            我知道了
          </Button>
        </DialogActions>
      </Dialog>
  )
}

export  default AppSuccessModel