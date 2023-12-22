import React from "react";
import { BlogCardProps } from "./props";
import {Avatar, Chip} from "@nextui-org/react";
import { Link } from "react-router-dom";
/// 两列展示的博客卡片
const TwoColumnBlogCard: React.FC<BlogCardProps> = ({ blog }) => {
  return (
    <div>
      <div className={'flex flex-col gap-2'}>
        <Link
            className={'font-bold text-large hover:text-primary'}
         to={`/post/${blog.id}`}>
          {blog.title}
        </Link>
        <div >
          <Chip
              size={'sm'}
              variant={'flat'}
            avatar={<Avatar src={blog.category.logo} size={'sm'} />}
          >{blog.category.name}</Chip>

        </div>
        {
            blog.tags.length !== 0 && <div>
              {
                blog.tags.map(value => <Chip variant={'light'} size={'sm'} key={value.id}>#{value.name}</Chip>)
              }
            </div>
        }
      </div>
    </div>
  );
};
export default TwoColumnBlogCard;
