import React from "react";
import NothingWidget from "./nothing";
import { Box, Button, Typography } from "@mui/material";
import { PagerModel } from "dd_server_api_web/dist/utils/ResultUtil";

type Props = {
  pager: PagerModel;
  onload: () => void;
  loading: boolean;
};

const PagerNextLoad: React.FC<Props> = ({ pager, onload, loading }) => {
  return (
    <Box display={"block"}>
      {/*    加载下一页  */}
      {!pager.paged && <Button onClick={onload}>查看更多</Button>}
      {pager.paged && pager.total !== 0 && (
        <Box color={"gray.500"} textAlign={"center"} mt={2} mb={2}>
          <Typography variant={"body2"} color={"gray"}>
            没有更多了
          </Typography>
        </Box>
      )}

      <NothingWidget nothing={pager.total === 0} />
    </Box>
  );
};
export default PagerNextLoad;
