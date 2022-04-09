import { AddIcon } from "@chakra-ui/icons";
import {
  AspectRatio,
  Box,
  Button, Grid, GridItem,
  IconButton,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
  Textarea, useMediaQuery
} from "@chakra-ui/react";
import { ResCategory } from "dd_server_api_web/apis/model/ResCategory";
import { successResultHandle } from "dd_server_api_web/apis/utils/ResultUtil";
import React, { useState } from "react";
import { useMount } from "react-use";
import { blogApi } from "../../utils/request";
import {fileOpen} from "browser-fs-access";
import {ResourceCategoryType} from "dd_server_api_web/apis/model/ResourceCategoryType";
import {useSetRecoilState} from "recoil";
import {successMessageProvider} from "../../providers/modal/success_modal";
import {useNavigate} from "react-router-dom";

//动态页面
const DynamicPage: React.FC = () => {



  const navigation = useNavigate()
  const [initLoading, setInitLoading] = useState(true); // 初始化中
  const [plotoAlbums, setPlotoAlbums] = useState<ResCategory[]>([]) // 相册列表
  const [showCreateModal, setShowCreateModal] = useState(false) //显示创建弹窗
  const [isDesk] = useMediaQuery('(min-width: 760px)')

  useMount(async () => {
    await fetchPhotoAlbum();
    setInitLoading(false);
  });

  // 加载相册类型的分类
  const fetchPhotoAlbum = async () => {
    let result = await blogApi().getResourceCategoryList(
      {
        page: 0,
        pageSize: 1000,
      },
      { type: "images" }
    );
    successResultHandle(result, (data) => {
      setPlotoAlbums(data.list);
    });
  };




  return (
    <>
      <Box textAlign={"end"} position={'absolute'} bottom={'20%'} left={'50%'}>
        <IconButton
          colorScheme="blue"
          aria-label="Search database"
          onClick={()=>setShowCreateModal(true)}
          icon={<AddIcon />}
        />
      </Box>

      {initLoading && <Spinner />}

      {/* 动态组件 */}
      {/* <ResourceComponents resourceCategoryName={'典典面基经历'} /> */}



      <Grid  templateColumns='repeat(4, 1fr)' gap={6}>
        {
          plotoAlbums.map(value => <GridItem key={value.id} colSpan={isDesk? 1 : 4} cursor={'pointer'} onClick={()=>{
            navigation('/pics?name='+value.name)
          }}>
            <Box position={'relative'}>
              <AspectRatio ratio={1} >
                <Image src={value.logo} borderRadius={15} fit={'contain'}/>
              </AspectRatio>
              <Box position={'absolute'} bottom={'12px'} left={'12px'} color={'white'} bg={'blackAlpha.400'} p={1} borderRadius={5} >
                {value.description}
              </Box>
            </Box>
           <Box mt={2}>
             <span>{value.name}</span>
           </Box>
          </GridItem>)
        }

      </Grid>




      <AddPhoneAlbumsForm show={showCreateModal} onClose={()=>setShowCreateModal(false)} />
    </>
  );
};



/// 新建的弹窗
const AddPhoneAlbumsForm: React.FC<{show: boolean,onClose: ()=> void}> = ({show,onClose}) => {

  const [logo,setLogo] = useState('http://duodob.oss-cn-shenzhen.aliyuncs.com/other%2Fedit%2Favatar.jpeg') // logo

  const [name,setName] = useState('') //名称
  const [intro,setIntro] = useState('') //
  const [type,setType] = useState('') //类型

  const setMsg = useSetRecoilState(successMessageProvider)
  const [rcts,setRcts] = useState<ResourceCategoryType[]>([])


  useMount(()=>{
    blogApi().getResourceCategoryTypes().then(value => {
      successResultHandle(value,data => {
          setRcts(data)
      })
    })
  })


  const submit =async () => {

   let result = await blogApi().saveOrUpdateResourceCategory({
      type: type,
      name: name,
      description: intro,
      logo: logo,
    })
    successResultHandle(result, _ => {
      onClose()
      setMsg(result.message)
    })
  }


  return <Modal isOpen={show} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>新建相册</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Stack direction={'column'} spacing={5}>
          <Input placeholder='名称' value={name} onChange={event=>setName(event.target.value)} />
          <Input placeholder='封面图' value={logo} onChange={event=>setLogo(event.target.value)} />
          <Button onClick={async ()=>{
            try {
              const blob = await fileOpen({
                mimeTypes: ['image/*'],
              });
              console.log(blob)
              let form = new FormData()
              form.append('file',blob)
             let result =  await blogApi().uploadFileWithSingle(form)
              successResultHandle(result,data =>{
                setLogo(data)
              })
            }catch (e) {
                console.log('取消上传');
            }
          }

          }>选择封面图上传</Button>

          {
            logo.length !== 0 && <Image src={logo} />
          }

          <Input placeholder={'类型'} value={type} onChange={event=>setType(event.target.value)} />

          <Box>
            {
              rcts.map(value=><span key={value.type} onClick={()=>setType(value.type)}>{value.type} </span>)
            }
          </Box>

          <Textarea placeholder='介绍' value={intro} onChange={event =>setIntro(event.target.value)} />
        </Stack>
      </ModalBody>
      <ModalFooter>
        <Button colorScheme={'blue'} onClick={submit}>创建</Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
}

export default DynamicPage;
