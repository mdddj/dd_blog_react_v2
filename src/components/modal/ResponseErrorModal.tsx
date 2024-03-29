import React from "react";
import {useRecoilState} from "recoil";
import {errorResponseProvider} from "../../providers/modal/error_response";
import {Alert, Box, Button, Dialog, DialogActions, DialogContent} from "@mui/material";



/// 错误信息的展示
const ResponseErrorModal: React.FC = () => {


    const [errorData,setErrorData] = useRecoilState(errorResponseProvider)


    const close = () => {
        setErrorData(undefined)
    }


    const msgList = errorData?.code === 508 ? errorData.data as string[] : []

    return (
        <Dialog open={errorData!==undefined} onClose={close}>

            <DialogContent>
                {errorData?.msg}


                    {/* 出现参数验证失败的提示 */}
                    {
                        errorData?.code === 508 && msgList.map(value => {
                            return <Alert severity={'error'}  key={value}>
                                {value}
                            </Alert>

                        })
                    }

                    {/*  未登录的提示  */}
                    {
                        errorData?.code === 401 && <Box>

                         部分功能需要登录,或者管理员才能操作

                        </Box>
                    }



                <DialogActions>
                    <Button  onClick={close}>
                        关闭
                    </Button>
                </DialogActions>
            </DialogContent>
        </Dialog>
    )
}
export default ResponseErrorModal