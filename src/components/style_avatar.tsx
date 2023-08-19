import * as React from 'react';
import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import {PropsWithChildren} from "react";


const StyledAvatar = styled(Avatar)`
  ${({ theme }) => `
  cursor: pointer;
  background-color: ${theme.palette.primary.main};
  transition: ${theme.transitions.create(['background-color', 'transform'], {
    duration: theme.transitions.duration.standard,
})};
  &:hover {
    transform: scale(1.3);
  }
  `}
`;

const StyledAvatarWidget: React.FC<PropsWithChildren> = (props) => {
  return <StyledAvatar>{props.children}</StyledAvatar>
}
export default StyledAvatarWidget