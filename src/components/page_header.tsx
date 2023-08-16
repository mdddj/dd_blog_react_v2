import React from "react";
import {Box, IconButton, Typography} from "@mui/material";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import {useNavigate} from "react-router-dom";
type Props = {
  title: string;
  showBack?: boolean
};
//页面的大标题
const PageHeader: React.FC<Props> = (props) => {
    const showBackIcon = props.showBack ?? false
    const nav = useNavigate()
  return (
    <Box mb={2} p={2} sx={{
        display: 'flex',
        alignItems: 'center',
        width: '100%'
    }}>
        {
            showBackIcon && <IconButton sx={{mr: 2}} color="secondary" onClick={()=>nav(-1)}><ArrowBackIosNewIcon/></IconButton>
        }
      <Typography variant="h3" style={{ textAlign: "center" }}>
        {props.title}
      </Typography>
    </Box>
  );
};

export default PageHeader;
