import * as React from "react";
import { styled } from "@mui/material/styles";
import { PropsWithChildren } from "react";
import { Card } from "@mui/material";

const StyledCardWrapper = styled(Card)`
  ${({ theme }) => `
  cursor: pointer;
  transition: ${theme.transitions.create(["background-color", "transform"], {
    duration: theme.transitions.duration.standard,
  })};
  &:hover {
    transform: scale(1.02);
  };
  `}
`;

const StyledCard: React.FC<PropsWithChildren> = (props) => {
  return (
    <StyledCardWrapper
      sx={{
        mb: 2,
      }}
    >
      {props.children}
    </StyledCardWrapper>
  );
};
export default StyledCard;
