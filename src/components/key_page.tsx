import React, {useState} from "react";
import {blogApi} from "../utils/request";
import {useMount} from "react-use";
import {TextModel} from "dd_server_api_web/apis/model/TextModel";
import {successResultHandle} from "dd_server_api_web/apis/utils/ResultUtil";
import {BlogPreview} from "./blog_content";
import {useSetRecoilState} from "recoil";
import {appLoading} from "../providers/loading";
type Props = {
    keyText: string
}
///字典组件
const KeyPage:React.FC<Props> = ({keyText}) => {


    const [model,setModel] = useState<TextModel>()
    const setLoading = useSetRecoilState(appLoading)
    useMount(()=>{
        fetchData()
    })

    const fetchData = () => {
        setLoading(true)
        blogApi().getTextByName(keyText).then(value => {
            setLoading(false)
            console.log(value)
            successResultHandle(value,data => {
                setModel(data)
            })
        })
    }

  return <>
      {
          model && <BlogPreview content={model.context}/>
      }
  </>
}
export default KeyPage