import React from "react";
import { useParams, useSearchParams } from "react-router-dom";
import MyBox from "../components/box/my_box";
import KeyPage from "../components/key_page";
import PageHeader from "../components/page_header";

const TextPage: React.FC = () => {
  const { text } = useParams<{ text: string }>();
  const [params] = useSearchParams();
  const title = params.get("t");

  return (
    <div>
      {title && <PageHeader title={title} />}
      <MyBox>{text && <KeyPage keyText={text} />}</MyBox>
    </div>
  );
};

export default TextPage;
