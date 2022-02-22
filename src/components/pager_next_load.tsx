import { Button } from "@chakra-ui/react"
import { PagerModel } from "dd_server_api_web/src/utils/ResultUtil"
import { type } from "os"


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
                colorScheme='teal'
                variant='outline'
                onClick={onload}
            >
                加载下一页
            </Button>
        }
    </div>
}
export default PagerNextLoad