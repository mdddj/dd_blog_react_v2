import * as React from "react";
import {Button, Card, CardFooter, Image} from "@nextui-org/react";


type Prop = {
    src: string;
    title: string;
    onClick?: () => void
};

export const ImageCard: React.FC<Prop> = (props) => {
    return (
        <Card>
            <Image disableSkeleton={true} className={'aspect-square object-cover'} isBlurred={false}
                   isZoomed={true} src={props.src}></Image>
            {
                (props.title || props.onClick) && <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                    {props.title && <p className="text-tiny text-white/80">{props.title}</p>}
                    {
                        props.onClick && <Button onClick={props.onClick} className="text-tiny text-white bg-black/20" variant="flat" color="default" radius="lg" size="sm">
                            查看
                        </Button>
                    }
                </CardFooter>
            }
        </Card>
    );
};
