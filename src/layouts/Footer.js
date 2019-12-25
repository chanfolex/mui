import React, { Fragment } from 'react';
import { Layout, Icon } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';

const { Footer } = Layout;
const FooterView = () => (
  <Footer style={{ padding: 0 }}>
    <GlobalFooter
      // links={[
      //   {
      //     key: 'Ant Design',
      //     title: 'Ant Design',
      //     href: 'https://ant.design',
      //     blankTarget: true,
      //   },
      // ]}
      copyright={
        <Fragment>
          Copyright <Icon type="copyright" /> 2019 Hoenix,Inc.杭州弘野科技有限公司{' '}
          <a href="http://www.beian.miit.gov.cn" target="self">
            浙ICP备16037320号-5
          </a>
        </Fragment>
      }
    />
  </Footer>
);
export default FooterView;
