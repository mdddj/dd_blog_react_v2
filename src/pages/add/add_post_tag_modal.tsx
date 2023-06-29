import React, {useState} from "react";
import {useRecoilValue} from "recoil";
import {archivesDataState} from "../../providers/archives";
import {
    Box,
    Button, Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Stack, TextField,
    Typography
} from "@mui/material";
import {AspectRatio} from "@mui/icons-material";


type Props = {
    show: boolean,
    onClose: () => void,
    onOk: (values: string[])=>void
    initVal: string[]
}

// 添加标签
const AddPostTagModal: React.FC<Props> = ({show, onClose,onOk,initVal}) => {


    let archives = useRecoilValue(archivesDataState);
    const [inputvalue,setInputValue] = useState('')
    const [values, setValues] = useState<string[]>(initVal)

    const tags = archives?.tags ?? []

  const onSeleteValue = (value: string) => {
    if (values.indexOf(value)>=0) {
      let newArr = values.filter((value1) => value1 !== value)
      setValues(newArr)
    }else{
      let a = [value]
      setValues([...values,...a])
    }
  }

    return <>
        <Dialog open={show} onClose={onClose}>
            <DialogTitle>标签选择器</DialogTitle>
            <DialogContent>

                    <Box >
                        <Stack spacing={5} direction={'column'}>
                            <Typography >从已有标签选择</Typography>
                            <Stack>
                                {tags.map(value => <Button onClick={() => {
                                  onSeleteValue(value.name)
                                }} key={value.id}>{value.name}</Button>)}
                            </Stack>
                            <Divider/>
                            <Typography>新建标签</Typography>
                            <Box>
                                <TextField placeholder={'创建新标签'} value={inputvalue} onChange={event => setInputValue(event.target.value)} />
                                <Button onClick={()=>{
                                  if(inputvalue!==''){
                                    onSeleteValue(inputvalue)
                                    setInputValue('')
                                  }
                                }}>添加</Button>
                            </Box>


                        </Stack>
                    </Box>

                    <Stack spacing={5} direction={'column'} mt={4}>
                        <Typography>已选择标签</Typography>

                        {
                            values.length === 0 && <AspectRatio >
                                <div style={{textAlign: "center", color: 'grey'}}>
                                    <Box>
                                        暂未选择
                                    </Box>
                                </div>
                            </AspectRatio>
                        }
                       <Stack>
                         {
                           values.map(value => <Chip key={value} label={value} avatar={<Button onClick={()=>{
                               onSeleteValue(value)
                           }} />} />)
                         }
                       </Stack>
                    </Stack>

            </DialogContent>

            <DialogActions>
                <Button  onClick={onClose}>取消</Button>
                <Button  disabled={values.length===0} onClick={()=>{
                    onOk(values)
                    onClose()
                }}>
                    确定
                </Button>

            </DialogActions>
        </Dialog>
    </>
}
export default AddPostTagModal