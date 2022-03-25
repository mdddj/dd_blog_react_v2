import React, {useState} from "react";
import {
    AspectRatio, Box,
    Button, Divider, Flex, Heading, Icon, Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay, Stack, Tag, TagCloseButton, Wrap
} from "@chakra-ui/react";
import {useRecoilValue} from "recoil";
import {archivesDataState} from "../../providers/archives";
import {GiEmptyMetalBucket} from "react-icons/gi";


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
        <Modal isOpen={show} onClose={onClose} size={'xl'}>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader>标签选择器</ModalHeader>
                <ModalCloseButton/>
                <ModalBody>

                    <Box bg={"gray.50"} p={5}>
                        <Stack spacing={5} direction={'column'}>
                            <Heading as={'h6'} size={'xs'}>从已有标签选择</Heading>
                            <Wrap>
                                {tags.map(value => <Button colorScheme={values.indexOf(value.name)>=0 ? 'blue' : undefined} onClick={() => {
                                  onSeleteValue(value.name)
                                }} key={value.id}>{value.name}</Button>)}
                            </Wrap>
                            <Divider/>
                            <Heading as={'h6'} size={'xs'}>新建标签</Heading>
                            <Flex>
                                <Input placeholder={'创建新标签'} value={inputvalue} onChange={event => setInputValue(event.target.value)} />
                                <Button ml={2} onClick={()=>{
                                  if(inputvalue!==''){
                                    onSeleteValue(inputvalue)
                                    setInputValue('')
                                  }
                                }}>添加</Button>
                            </Flex>


                        </Stack>
                    </Box>

                    <Stack spacing={5} direction={'column'} mt={4}>
                        <Heading as={'h6'} size={'xs'}>已选择标签</Heading>

                        {
                            values.length === 0 && <AspectRatio ratio={3}>
                                <div style={{textAlign: "center", color: 'grey'}}>
                                    <Box>
                                        <Icon as={GiEmptyMetalBucket}/> 暂未选择
                                    </Box>
                                </div>
                            </AspectRatio>
                        }
                       <Wrap>
                         {
                           values.map(value => <Tag key={value}>{value} <TagCloseButton onClick={()=>{
                             onSeleteValue(value)
                           }} /></Tag>)
                         }
                       </Wrap>
                    </Stack>

                </ModalBody>
                <ModalFooter>
                    <Button variant='ghost' onClick={onClose}>取消</Button>
                    <Button colorScheme='blue' ml={3} disabled={values.length===0} onClick={()=>{
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