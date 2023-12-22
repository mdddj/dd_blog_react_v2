import React, {useState} from "react";
import PageHeader from "../../components/page_header";
import {blogApi} from "../../utils/request";
import {useMount} from "react-use";
import {useSetRecoilState} from "recoil";

import CommentComponent from "../../components/comment_component";
import {successMessageProvider} from "../../providers/modal/success_modal";
import {Friend} from "dd_server_api_web/dist/model/friend";
import {
    Result,

} from "dd_server_api_web/dist/utils/ResultUtil";
import {ApiResponse} from "../../models/app_model";
import {
    Button,
    Input, Link,
    Modal, ModalBody,
    ModalContent, ModalFooter,
    ModalHeader, Tooltip,
    User
} from "@nextui-org/react";
import TwoColumnLayout from "../../components/two_column_layout";

//友链页面
const FriendsPage: React.FC = () => {
    const [friends, setFriends] = useState<Friend[]>([]);
    const [showModal, setShowModal] = useState(false);

    useMount(() => fetchData());

    // 加载数据
    const fetchData = async () => {
        const result = await blogApi().requestT<Result<Friend[]>>("/api/public/friends", {state: "1"})
        if (result.state === 200) {
            setFriends(result.data ?? []);
        }

    };

    return (
        <TwoColumnLayout right={[
            <Button
                as={Link}
                color="primary"
                showAnchorIcon
                variant="solid"
                onClick={()=>setShowModal(true)}
            >
                自助申请
            </Button>
        ]}>
            <div className={' flex flex-col gap-5'}>
                <PageHeader title={"友链"}/>



                <div>
                    <div className={'grid grid-cols-3 gap-2'}>
                        {friends.map((value) => {
                            return <div className={''}>
                                <div>
                                    <User name={value.name} avatarProps={{
                                        src: value.logo
                                    }} description={value.intro} onClick={() => {
                                        window.open(value.url, '_blank');
                                    }}/>
                                </div>
                                <div>
                                    <Tooltip content={value.url}>
                                        <Link
                                            isExternal
                                            showAnchorIcon
                                            href={value.url}
                                        >
                                            去看看
                                        </Link>
                                    </Tooltip>
                                </div>
                            </div>

                        })}
                    </div>
                </div>

                <CommentComponent type={"friend"} id={0}/>

                <AddFriendsForm
                    isShow={showModal}
                    onClose={()=>setShowModal(false)}
                    onSuccess={() => {
                        setShowModal(false);
                    }}
                />
            </div>
        </TwoColumnLayout>
    );
};

/// 添加友链页面
const AddFriendsForm: React.FC<{ onSuccess: () => void,isShow?: boolean,onClose?:()=>void }> = ({onSuccess,isShow,onClose}) => {
    const [name, setName] = useState("");
    const [url, setUrl] = useState("");
    const [intro, setIntro] = useState("");
    const [logo, setLogo] = useState("");
    const [email, setEmail] = useState("");

    const setMsg = useSetRecoilState(successMessageProvider);

    //提交表单
    const submit = async () => {
        let result = await blogApi().requestT<ApiResponse<Friend>>(
            "/api/public/friend/apply-for",
            {
                name: name,
                url: url,
                intro: intro,
                logo: logo,
                email: email,
                state: 0,
            },
            "POST"
        );
        if (result.success) {
            onSuccess();
        }
        setMsg(result.message);
    };

    return (
        <Modal isOpen={isShow} onClose={onClose}>
            <ModalContent>
                <ModalHeader>自助申请友链</ModalHeader>
                <ModalBody>
                    <div className={'p-2 flex flex-col gap-2'}>
                        <Input
                            id="name"
                            name="name"
                            isRequired={true}
                            label={"网站名称"}
                            fullWidth
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <Input
                            id="urlId"
                            name="url"
                            isRequired={true}
                            label="主页"
                            fullWidth
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                        />
                        <Input
                            id="introId"
                            name="intro"
                            isRequired={true}
                            label="简单介绍"
                            fullWidth
                            value={intro}
                            onChange={(e) => setIntro(e.target.value)}
                        />
                        <Input
                            name="logo"
                            id="logoId"
                            label="Logo直链"
                            isRequired={true}
                            fullWidth
                            value={logo}
                            onChange={(e) => setLogo(e.target.value)}
                        />
                        <Input
                            name="email"
                            id="emailId"
                            label="邮箱,用来接收审核通知,非必须"
                            fullWidth
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={() => submit()} color={'primary'}>
                        提交数据
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default FriendsPage;
