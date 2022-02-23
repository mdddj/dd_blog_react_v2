import React from "react";
import KeyPage from "../components/key_page";
import PageHeader from "../components/page_header";


const AboutPage: React.FC = () => {
  return <>
    <PageHeader title={'关于'} />
    <KeyPage keyText={'about'}/>
  </>
}
export default AboutPage