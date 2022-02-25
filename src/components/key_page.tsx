import React, {useState} from "react";
import {blogApi} from "../utils/request";
import {useMount} from "react-use";
import {TextModel} from "dd_server_api_web/apis/model/TextModel";
import {successResultHandle} from "dd_server_api_web/apis/utils/ResultUtil";
import {BlogPreview} from "./blog_content";
import {useSetRecoilState} from "recoil";
import {appLoading} from "../providers/loading";
import {Result} from "dd_server_api_web/src/utils/ResultUtil";
import {Box, Button, Input, useBoolean, useToast} from "@chakra-ui/react";
type Props = {
    keyText: string
}
///字典组件
const KeyPage:React.FC<Props> = ({keyText}) => {

    const toast = useToast()
    const [verifyLoading, setVerifyLoading] = useBoolean()
    const [inputPassword,setInputPassword] = useState<string>('')
    const [model,setModel] = useState<TextModel>()
    const [result,setResult] = useState<Result<any> | undefined>(undefined)
    const setLoading = useSetRecoilState(appLoading)

    const hasPassword = result && result.state === 303

    useMount(()=>{
        fetchData()
    })

    const fetchData = () => {

        if(hasPassword && inputPassword.length !== 0) {
            setVerifyLoading.on()
        }else{

        }
        if(hasPassword && inputPassword.length === 0 ){
            toast.closeAll()
            toast({
                title: `请输入密码`,
                status: 'error',
                isClosable: true,
                duration: 2000
            })
            return;
        }
        setLoading(true)
        blogApi().getTextByName(keyText,inputPassword).then(value => {
            setLoading(false)
            setResult(value)
            if(inputPassword.length !== 0){
                setVerifyLoading.off()
            }
            successResultHandle(value,data => {
                setModel(data)
            },message => {
                toast.closeAll()
                toast({
                    title: message,
                    status: 'error',
                    duration: 3000
                })
            })
        })
    }

  return <>

      {
          hasPassword && <Box>
              <Box mb={2}>{result?.message}</Box>
              <Input placeholder='请输入密码' onChange={event => setInputPassword(event.target.value)} />
              <Box mt={4}><Button colorScheme='blue' isLoading={verifyLoading} onClick={fetchData}>确认</Button></Box>
          </Box>
      }

      {
          model && <BlogPreview content={model.context}/>
      }
  </>
}
export default KeyPage