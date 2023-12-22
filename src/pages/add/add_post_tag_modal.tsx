import React, {useState} from "react";
import {useRecoilValue} from "recoil";
import {archivesDataState} from "../../providers/archives";
import {
    Button,
    Chip,
    Divider,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader
} from "@nextui-org/react";
import Box from "../../components/box/box";


type Props = {
    show: boolean,
    onClose: () => void,
    onOk: (values: string[]) => void
    initVal: string[]
}

// 添加标签
const AddPostTagModal: React.FC<Props> = ({show, onClose, onOk, initVal}) => {


    let archives = useRecoilValue(archivesDataState);
    const [inputvalue, setInputValue] = useState('')
    const [values, setValues] = useState<string[]>(initVal)

    const tags = archives?.tags ?? []

    const onSeleteValue = (value: string) => {
        if (values.indexOf(value) >= 0) {
            let newArr = values.filter((value1) => value1 !== value)
            setValues(newArr)
        } else {
            let a = [value]
            setValues([...values, ...a])
        }
    }

    return <>
        <Modal isOpen={show} onClose={onClose}>

            <ModalContent>
                <ModalHeader>标签选择器</ModalHeader>
                <ModalBody>
                    <div className={'flex flex-col gap-2'}>
                        <span>从已有标签选择</span>
                        <div className={'flex flex-wrap gap-2'}>
                            {tags.map(value => <Button onClick={() => {
                                onSeleteValue(value.name)
                            }} key={value.id}>{value.name}</Button>)}
                        </div>
                        <Divider/>
                        <span>新建标签</span>
                        <div className={'flex'}>
                            <Input placeholder={'创建新标签'} className={'flex-auto'} value={inputvalue}
                                   onChange={event => setInputValue(event.target.value)}/>
                            <Button onClick={() => {
                                if (inputvalue !== '') {
                                    onSeleteValue(inputvalue)
                                    setInputValue('')
                                }
                            }}>添加</Button>
                        </div>

                        <div className={'flex flex-col gap-2'}>
                            <span>已选择标签</span>

                            {
                                values.length === 0 && <div className={'aspect-auto'}>
                                    <div style={{textAlign: "center", color: 'grey'}}>
                                        <Box>
                                            暂未选择
                                        </Box>
                                    </div>
                                </div>
                            }
                            <div className={'flex flex-wrap gap-2'}>
                                {
                                    values.map(value => <Chip key={value} onClick={() => {
                                        onSeleteValue(value)
                                    }}>{value}</Chip>)
                                }
                            </div>
                        </div>
                    </div>
                </ModalBody>


                <ModalFooter>
                    <Button onClick={onClose}>取消</Button>
                    <Button color={'primary'} disabled={values.length === 0} onClick={() => {
                        onOk(values)
                        onClose()
                    }}>
                        确定
                    </Button>

                </ModalFooter>
            </ModalContent>


        </Modal>
    </>
}
export default AddPostTagModal