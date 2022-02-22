import {Box, Button} from "@chakra-ui/react"
import { PagerModel } from "dd_server_api_web/src/utils/ResultUtil"
import React from "react";


type Props = {
    pager: PagerModel,
    onload: () => void,
    loading: boolean
}

const PagerNextLoad: React.FC<Props> = ({ pager, onload, loading }) => {
    return <div className="text-center">
        {/*    加载下一页  */}
        {
            !pager.paged && <Button
                isLoading={loading}
                loadingText='加载中'
                colorScheme='blackAlpha'
                variant='outline'
                onClick={onload}
            >
                加载下一页
            </Button>
        }
        {
            pager.paged && pager.total!==0 && <Box color={'gray.500'}>没有更多了</Box>
        }

        {
            pager.total === 0 && <Box color={'gray.500'}>这里什么都没有</Box>
        }
    </div>
}
export default PagerNextLoad