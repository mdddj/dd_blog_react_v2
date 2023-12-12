import * as React from "react";
import {Image} from "@nextui-org/react";



type Prop = {
  src: string;
  title: string;
  imageWith: string | number;
  onClick?:()=>void
};

export const ImageCard: React.FC<Prop> = (props) => {
  return (
    <Image onClick={props.onClick} disableSkeleton={true} className={'aspect-square object-cover'} isBlurred={false} isZoomed={true} src={props.src} ></Image>
  );
};
