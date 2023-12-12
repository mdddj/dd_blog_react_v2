import React from "react";
import { BlogCardProps } from "./props";
import {Avatar, Card, CardBody, Chip} from "@nextui-org/react";
import { Link } from "react-router-dom";
/// 两列展示的博客卡片
const TwoColumnBlogCard: React.FC<BlogCardProps> = ({ blog }) => {
  return (
    <Card
      className={''}
    >
      <CardBody className={'flex flex-col gap-2'}>
        <Link
            className={'font-bold text-large'}
         to={`/post/${blog.id}`}>
          {blog.title}
        </Link>
        <div >
          <Chip
              variant={'flat'}
            avatar={<Avatar src={blog.category.logo} />}
          >{blog.category.name}</Chip>

        </div>
        {
            blog.tags.length !== 0 && <div>
              {
                blog.tags.map(value => <Chip variant={'light'} size={'sm'} key={value.id}>#{value.name}</Chip>)
              }
            </div>
        }
      </CardBody>
    </Card>
  );
};
export default TwoColumnBlogCard;
