import React from "react";
import NothingWidget from "./nothing";
import { PagerModel } from "dd_server_api_web/dist/utils/ResultUtil";
import Box from "./box/box";
import {Button} from "@nextui-org/react";

type Props = {
  pager: PagerModel;
  onload: () => void;
  loading: boolean;
};

const PagerNextLoad: React.FC<Props> = ({ pager, onload, loading }) => {
  return (
    <div className={'text-center'} >
      {/*    加载下一页  */}
      {!pager.paged && <Button onClick={onload}>查看更多</Button>}
      {pager.paged && pager.total !== 0 && (
        <div >
            没有更多了
        </div>
      )}

      <NothingWidget nothing={pager.total === 0} />
    </div>
  );
};
export default PagerNextLoad;
