import React from "react";
import PageHeader from "../components/page_header";
import KeyPage from "../components/key_page";

//简历页面
const JianliPage:React.FC = () => {
  return <>
    <PageHeader title={'简历'} />
    <KeyPage keyText={'resume'}/>
  </>
}
export default JianliPage