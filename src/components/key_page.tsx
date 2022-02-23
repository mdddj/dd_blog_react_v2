import React, {useState} from "react";
import {blogApi} from "../utils/request";
import {useMount} from "react-use";
import {Spinner, useBoolean} from "@chakra-ui/react";
import {TextModel} from "dd_server_api_web/apis/model/TextModel";
import {successResultHandle} from "dd_server_api_web/apis/utils/ResultUtil";
import {BlogPreview} from "./blog_content";
type Props = {
    keyText: string
}
///字典组件
const KeyPage:React.FC<Props> = ({keyText}) => {


    const [loading,setLoading] = useBoolean()
    const [model,setModel] = useState<TextModel>()
    useMount(()=>{
        fetchData()
    })

    const fetchData = () => {
        setLoading.on()
        blogApi().getTextByName(keyText).then(value => {
            setLoading.off()
            console.log(value)
            successResultHandle(value,data => {
                setModel(data)
            })
        })
    }

  return <>
      {
          loading && <Spinner />
      }

      {
          model && <BlogPreview content={model.context}/>
      }
  </>
}
export default KeyPage