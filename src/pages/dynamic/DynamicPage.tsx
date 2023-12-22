import React, { useState } from "react";
import { useMount } from "react-use";
import { blogApi } from "../../utils/request";
import { useSetRecoilState } from "recoil";
import { successMessageProvider } from "../../providers/modal/success_modal";
import { useNavigate } from "react-router-dom";
import { ResCategory } from "dd_server_api_web/dist/model/ResCategory";
import { ResourceCategoryType } from "dd_server_api_web/dist/model/ResourceCategoryType";
import {
  Result,
  PagerModel,
  successResultHandle,
} from "dd_server_api_web/dist/utils/ResultUtil";
import MyBox from "../../components/box/my_box";
import PageHeader from "../../components/page_header";
import { ImageCard } from "../../components/image";
import {Button, Input, Modal, ModalContent, ModalFooter, Spinner} from "@nextui-org/react";
import Box from "../../components/box/box";

//动态页面
const DynamicPage: React.FC = () => {
  const navigation = useNavigate();
  const [initLoading, setInitLoading] = useState(true); // 初始化中
  const [plotoAlbums, setPlotoAlbums] = useState<ResCategory[]>([]); // 相册列表
  const [showCreateModal, setShowCreateModal] = useState(false); //显示创建弹窗

  useMount(async () => {
    await fetchPhotoAlbum();
    setInitLoading(false);
  });

  // 加载相册类型的分类
  const fetchPhotoAlbum = async () => {
    let result: Result<{
      page: PagerModel;
      list: ResCategory[];
    }> = await blogApi().getResourceCategoryList(
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

  const getImage = (item: ResCategory): string => {
    if (!item.logo || item.logo === "") {
      return "https://bit.ly/2Z4KKcF";
    }
    if (item.fileInfo && item.fileInfo.thumbnail) {
      return item.fileInfo.thumbnail;
    }
    return item.logo!;
  };

  return (
    <MyBox>
      <PageHeader title="动态" />
      {initLoading && <Spinner />}


      <div className={'grid grid-cols-5 gap-2'}>
        {plotoAlbums.map((value) => {
          return (
            <div
              key={value.id}
              className={'relative aspect-square bg-default-50'}
            >
              <ImageCard
                  onClick={()=>navigation("/pics/" + value.name)}
                  src={getImage(value)}
                  title={value.name ?? ""}
              />
            </div>
          );
        })}
      </div>

      <AddPhoneAlbumsForm
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </MyBox>
  );
};

/// 新建的弹窗
const AddPhoneAlbumsForm: React.FC<{ show: boolean; onClose: () => void }> = ({
  show,
  onClose,
}) => {
  ///http://duodob.oss-cn-shenzhen.aliyuncs.com/other%2Fedit%2Favatar.jpeg
  const [logo, setLogo] = useState(""); // logo

  const [name, setName] = useState(""); //名称
  const [intro, setIntro] = useState(""); //
  const [type, setType] = useState(""); //类型

  const setMsg = useSetRecoilState(successMessageProvider);
  const [rcts, setRcts] = useState<ResourceCategoryType[]>([]);

  useMount(() => {
    blogApi()
      .getResourceCategoryTypes()
      .then((value: Result<ResourceCategoryType[]>) => {
        successResultHandle(value, (data) => {
          setRcts(data);
        });
      });
  });

  const submit = async () => {
    let result = await blogApi().saveOrUpdateResourceCategory({
      type: type,
      name: name,
      description: intro,
      logo: logo,
    });
    successResultHandle(result, (_) => {
      onClose();
      setMsg(result.message);
    });
  };

  return (
    <Modal isOpen={show} onClose={onClose}>
      <span>新建相册</span>
      <ModalContent>
        <div className={'columns-1'}>
          <Input
            placeholder="名称"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <Input
            placeholder="封面图"
            value={logo}
            onChange={(event) => setLogo(event.target.value)}
          />
          {/*<Button*/}
          {/*  onClick={async () => {*/}
          {/*    try {*/}
          {/*      const blob = await fileOpen({*/}
          {/*        mimeTypes: ["image/*"],*/}
          {/*      });*/}
          {/*      let form = new FormData();*/}
          {/*      form.append("file", blob);*/}
          {/*      let result: Result<string> =*/}
          {/*        await blogApi().uploadFileWithSingle(form);*/}
          {/*      successResultHandle(result, (data) => {*/}
          {/*        setLogo(data);*/}
          {/*      });*/}
          {/*    } catch (e) {}*/}
          {/*  }}*/}
          {/*>*/}
          {/*  选择封面图上传*/}
          {/*</Button>*/}

          {logo.length !== 0 && <img src={logo} alt="logo" />}

          <Input
            placeholder={"类型"}
            value={type}
            onChange={(event) => setType(event.target.value)}
          />

          <Box>
            {rcts.map((value) => (
              <Button key={value.type} onClick={() => setType(value.type)}>
                {value.type}{" "}
              </Button>
            ))}
          </Box>

          <Input
            placeholder="介绍"
            value={intro}
            onChange={(event) => setIntro(event.target.value)}
          />
        </div>
      </ModalContent>
      <ModalFooter>
        <Button
          onClick={() => {
            setType("images");
          }}
        >
          相册类型
        </Button>
        <Button onClick={submit}>创建</Button>
      </ModalFooter>
    </Modal>
  );
};

export default DynamicPage;
