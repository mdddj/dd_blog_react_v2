import React from "react";
import KeyPage from "../components/key_page";
import PageHeader from "../components/page_header";
import MyBox from "../components/box/my_box";


const AboutPage: React.FC = () => {
  return <>
    <PageHeader title={'关于'} />
    <MyBox>
      <KeyPage keyText={'about'}/>
    </MyBox>
  </>
}
export default AboutPage