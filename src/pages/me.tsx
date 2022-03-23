import React from "react";
import PageHeader from "../components/page_header";
import KeyPage from "../components/key_page";
import MyBox from "../components/box/my_box";

//简历页面
const JianliPage:React.FC = () => {
  return <>
    <PageHeader title={'简历'} />
    <MyBox>
      <KeyPage keyText={'resume'}/>
    </MyBox>
  </>
}
export default JianliPage