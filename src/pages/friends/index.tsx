import React, {useState} from "react";
import PageHeader from "../../components/page_header";
import {blogApi} from "../../utils/request";
import {useMount} from "react-use";
import {useSetRecoilState} from "recoil";
import {appLoading} from "../../providers/loading";

import CommentComponent from "../../components/comment_component";
import {successMessageProvider} from "../../providers/modal/success_modal";
import {Friend} from "dd_server_api_web/dist/model/friend";
import {
    Result,

} from "dd_server_api_web/dist/utils/ResultUtil";
import {ApiResponse} from "../../models/app_model";
import {
    Avatar,
    Button,
    Card,
    CardBody,
    CardFooter,
    Divider,
    Input, Link,
    Modal,
    ModalContent,
    ModalHeader, Tooltip,
    User
} from "@nextui-org/react";
import Box from "../../components/box/box";

//友链页面
const FriendsPage: React.FC = () => {
    const setLoading = useSetRecoilState(appLoading);
    const [friends, setFriends] = useState<Friend[]>([]);
    const [showModal, setShowModal] = useState(false);

    useMount(() => fetchData());

    // 加载数据
    const fetchData = async () => {
        setLoading(true);
        const result = await blogApi().requestT<Result<Friend[]>>("/api/public/friends", {state: "1"})
        setLoading(false);
        if (result.state === 200) {
            setFriends(result.data ?? []);
        }

    };

    return (
        <div className={'relative flex flex-col gap-2'}>
            <PageHeader title={"友链"}/>

            <span className={'absolute right-1 top-1'} onClick={() => setShowModal(true)}>自助申请友链</span>

            <div>
                <div className={'grid grid-cols-4 gap-2'}>
                    {friends.map((value) => {
                        return <Card>
                            <CardBody>
                                <User name={value.name} avatarProps={{
                                    src: value.logo
                                }} description={value.intro} onClick={() => {
                                    window.open(value.url, '_blank');
                                }}/>
                            </CardBody>
                            <Divider/>
                            <CardFooter>
                                <Tooltip content={value.url}>
                                    <Link
                                        isExternal
                                        showAnchorIcon
                                        href={value.url}
                                    >
                                        去看看
                                    </Link>
                                </Tooltip>
                            </CardFooter>
                        </Card>

                    })}
                </div>
            </div>

            <CommentComponent type={"friend"} id={0}/>

            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
            >
                <ModalHeader>自助申请友链</ModalHeader>
                <ModalContent>
                    <AddFriendsForm
                        onSuccess={() => {
                            setShowModal(false);
                        }}
                    />
                </ModalContent>
            </Modal>
        </div>
    );
};

/// 添加友链页面
const AddFriendsForm: React.FC<{ onSuccess: () => void }> = ({onSuccess}) => {
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
        <div className={'p-2 flex flex-col gap-2'}>
            <Input
                id="name"
                name="name"
                label={"网站名称"}
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <Input
                id="urlId"
                name="url"
                label="主页"
                fullWidth
                value={url}
                onChange={(e) => setUrl(e.target.value)}
            />
            <Input
                id="introId"
                name="intro"
                label="简单介绍"
                fullWidth
                value={intro}
                onChange={(e) => setIntro(e.target.value)}
            />
            <Input
                name="logo"
                id="logoId"
                label="Logo直链"
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
            <Button onClick={() => submit()} fullWidth>
                提交数据
            </Button>
        </div>
    );
};

export default FriendsPage;
