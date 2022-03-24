import React from "react";
import {
    Box, Button, ButtonGroup, FormControl, FormLabel,
    Input,
    Popover,
    PopoverArrow,
    PopoverCloseButton,
    PopoverContent,
    PopoverTrigger, Stack, useDisclosure
} from "@chakra-ui/react";




const LoginComponent: React.FC = () => {


    const { onOpen, onClose, isOpen } = useDisclosure()
    const firstFieldRef = React.useRef(null)

    return <>
        <Box d='inline-block' mr={3}>
            John Smith
        </Box>
        <Popover
            isOpen={isOpen}
            initialFocusRef={firstFieldRef}
            onOpen={onOpen}
            onClose={onClose}
            placement='right'
            closeOnBlur={false}
        >
            <PopoverTrigger>
                <div style={{position: 'fixed',bottom: '10px', right: '10px',fontSize: 10,color: 'grey'}}>
                    登录
                </div>
            </PopoverTrigger>
            <PopoverContent p={5}>
                登录
            </PopoverContent>
        </Popover>
    </>

}
export default LoginComponent