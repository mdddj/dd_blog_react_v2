import { AddIcon } from "@chakra-ui/icons";
import { Box, Button, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, Stack, Textarea } from "@chakra-ui/react";
import { ResCategory } from "dd_server_api_web/apis/model/ResCategory";
import { successResultHandle } from "dd_server_api_web/apis/utils/ResultUtil";
import React, { useState } from "react";
import { useMount } from "react-use";
import AppLoadingWidget from "../../components/app_loading_widget";
import ResourceComponents from "../../components/resource_components";
import { blogApi } from "../../utils/request";

//动态页面
const DynamicPage: React.FC = () => {
  const [initLoading, setInitLoading] = useState(true); // 初始化中
  const [plotoAlbums, setPlotoAlbums] = useState<ResCategory[]>([]) // 相册列表
  const [showCreateModal, setShowCreateModal] = useState(false) //显示创建弹窗

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
      { type: "image" }
    );
    successResultHandle(result, (data) => {
      setPlotoAlbums(data.list);
    });
  };

  console.log(plotoAlbums);

  return (
    <>
      <Box textAlign={"end"}>
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


      <AddPhoneAlbumsForm show={showCreateModal} onClose={()=>setShowCreateModal(false)} />
    </>
  );
};



/// 新建的弹窗
const AddPhoneAlbumsForm: React.FC<{show: boolean,onClose: ()=> void}> = ({show,onClose}) => {
  return <Modal isOpen={show} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>新建相册</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Stack direction={'column'} spacing={5}>
          <Input placeholder='名称' />
          <Input placeholder='封面图' />
          <Button>选择封面图上传</Button>
          <Textarea placeholder='介绍' />
        </Stack>
      </ModalBody>
      <ModalFooter>
        <Button colorScheme={'blue'}>创建</Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
}

export default DynamicPage;
