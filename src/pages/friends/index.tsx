import React, { useState } from "react";
import PageHeader from "../../components/page_header";
import { blogApi } from "../../utils/request";
import { useMount } from "react-use";
import { successResultHandle } from "dd_server_api_web/apis/utils/ResultUtil";
import { Friend } from "dd_server_api_web/apis/model/friend";
import {
    Box,
    SimpleGrid,
    Text,
    Flex,
    Avatar,
    Link,
    useMediaQuery,
    Stack,
    Input,
    Button,
    FormControl, FormHelperText, FormLabel, FormErrorMessage, Modal, ModalOverlay, ModalHeader, ModalBody, ModalContent, ModalCloseButton, ModalFooter
} from "@chakra-ui/react";
import { useSetRecoilState } from "recoil";
import { appLoading } from "../../providers/loading";
import MyBox from "../../components/box/my_box";
import { Field, FieldProps, Form, Formik, FormikHelpers, FormikProps } from "formik";
import CommentComponent from "../../components/comment_component";

//友链页面
const FriendsPage: React.FC = () => {

    const [isDesk] = useMediaQuery('(min-width: 760px)')
    const setLoading = useSetRecoilState(appLoading)
    const [friends, setFriends] = useState<Friend[]>([])
    const [showModal, setShowModal] = useState(false)

    useMount(() => fetchData())

    // 加载数据
    const fetchData = () => {
        setLoading(true)
        blogApi().getFriends({ 'state': '1' }).then(value => {
            setLoading(false)
            successResultHandle(value, data => {
                setFriends(data)
            })
        })
    }


    return <div style={{
        position: 'relative'
    }}>
        <PageHeader title={'友链'} />

        <span style={{
            fontSize: 12,
            color: 'grey',
            cursor: 'pointer',
            position: 'absolute',
            top: 22,
            right: 0
        }} onClick={() => setShowModal(true)}>自助申请友链</span>


        <SimpleGrid columns={isDesk ? 2 : 1} spacingX='40px' spacingY='20px'>
            {
                friends.map(value => {
                    return <Link key={value.id} href={value.url} isExternal={true}>
                        <MyBox>
                            <Flex>
                                <Avatar src={value.logo} />
                                <Box ml='3'>
                                    <Text fontWeight='bold'>
                                        {value.name}
                                    </Text>
                                    <Text fontSize='sm'>{value.intro}</Text>
                                </Box>
                            </Flex>
                        </MyBox>
                    </Link>
                })
            }
        </SimpleGrid>


        <CommentComponent type={"friend"} id={0} />

        <Modal isOpen={showModal} onClose={() => setShowModal(false)} >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>自助申请友链</ModalHeader>
                <ModalCloseButton/>
                <ModalBody>
                    <AddFriendsForm />
                </ModalBody>
                <ModalFooter />
            </ModalContent>
        </Modal>
    </div>
}


/// 添加友链页面
const AddFriendsForm: React.FC = () => {


    //提交表单
    const submit = (values: Friend, { setSubmitting }: FormikHelpers<Friend>) => {
        blogApi().saveFriendsLink(values).then(r => {

        })
    }

    const validate = (values: any) => {
        let errors = {} as any;
        if (values.name === '') {
            errors.name = '请输入名字'
        }
        if (values.url === '') {
            errors.url = '请输入链接'
        }
        if (values.intro === '') {
            errors.intro = '请输入介绍'
        }
        if (values.logo === '') {
            errors.logo = '请输入你的logo'
        }

        return errors
    }

    return <>
        <Formik<Friend> initialValues={{
            name: '',
            url: '',
            state: 0,
            logo: '',
            email: '',
            intro: '',
        }} onSubmit={submit} validate={validate}>


            {
                ({ errors }: FormikProps<Friend>) => {
                    console.log(errors)
                    return <Form>
                        <Stack direction={'column'} spacing={5}>
                            <Field name={'name'}>
                                {({ field, form }: FieldProps<any, Friend>) => {
                                    return (
                                        <FormControl isInvalid={form.values.name === '' && errors.name !== undefined} isRequired={true}>
                                            <FormLabel htmlFor='name'>网站名</FormLabel>
                                            <Input {...field} id='name' />
                                            <FormErrorMessage>{errors.name}</FormErrorMessage>
                                        </FormControl>
                                    )
                                }}
                            </Field>
                            <Field name={'url'} type='url'>
                                {({ field, form }: FieldProps<any, Friend>) => {
                                    return (
                                        <FormControl isInvalid={form.values.url === '' && errors.url !== undefined} isRequired={true}>
                                            <FormLabel htmlFor='urlId'>链接</FormLabel>
                                            <Input {...field} id='urlId' />
                                            <FormErrorMessage>{errors.url}</FormErrorMessage>
                                        </FormControl>
                                    )
                                }}
                            </Field>
                            <Field name={'intro'}>
                                {({ field, form }: FieldProps<any, Friend>) => {
                                    return (
                                        <FormControl isInvalid={form.values.intro === '' && errors.intro !== undefined} isRequired={true}>
                                            <FormLabel htmlFor='introId'>一句话介绍</FormLabel>
                                            <Input {...field} id='introId' />
                                            <FormErrorMessage>{errors.intro}</FormErrorMessage>
                                        </FormControl>
                                    )
                                }}
                            </Field>
                            <Field name={'logo'} type='url'>
                                {({ field, form }: FieldProps<any, Friend>) => {
                                    return (
                                        <FormControl isInvalid={form.values.logo === '' && errors.logo !== undefined} isRequired={true}>
                                            <FormLabel htmlFor='logoId'>Logo</FormLabel>
                                            <Input {...field} id='logoId' />
                                            <FormErrorMessage>{errors.logo}</FormErrorMessage>
                                        </FormControl>
                                    )
                                }}
                            </Field>
                            <Field name={'email'} type='email'>
                                {({ field }: FieldProps<any, Friend>) => {
                                    return (
                                        <FormControl isRequired={false}>
                                            <FormLabel htmlFor='emailId'>邮箱</FormLabel>
                                            <Input {...field} id='emailId' />
                                            <FormHelperText>邮箱信息仅用来接收审核结果通知,不会被用作其他用途.</FormHelperText>
                                        </FormControl>
                                    )
                                }}
                            </Field>
                            <Button type={'submit'} mt={5}>提交数据</Button>
                        </Stack>
                    </Form>
                }
            }

        </Formik>
    </>
}

export default FriendsPage
