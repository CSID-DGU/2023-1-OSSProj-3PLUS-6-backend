import React, { useState } from "react";
import {
  Layout,
  Select,
  Button,
  Form,
  Input,
  Row,
  Col,
  Table,
  Tabs,
} from "antd";
import styles from "../css/Application.module.css";
import axios from "axios";
import { SearchOutlined } from "@ant-design/icons";
const { Option } = Select;
const { TabPane } = Tabs;
const { Header, Content } = Layout;

const columns = [
  { title: "교과목명", dataIndex: "교과목명", key: "교과목명" },
  { title: "교원명", dataIndex: "교원명", key: "교원명" },
  { title: "요일/시간", dataIndex: "요일/시간", key: "요일/시간" },
  { title: "강의실", dataIndex: "강의실", key: "강의실" },
  { title: "수강정원", dataIndex: "수강정원", key: "수강정원" },
  // { title: "신청인원", dataIndex: "applications", key: "applications" },
];

const Application = () => {
  //검색 기능 관련 변수
  const [courses, setCourses] = useState([]);
  const [selectMajor, setSelectMajor] = useState("");
  const [keyword, setKeyword] = useState("");
  const [selectedData, setSelectedData] = useState(null);
  const [addedData, setAddedData] = useState([]);

  // 데이터 클릭 이벤트 핸들러
  const handleDataClick = (record) => {
    setSelectedData(record);
  };

  // 플러스 버튼 클릭 이벤트 핸들러
  const handleAddButtonClick = () => {
    if (selectedData) {
      setAddedData((prevData) => [...prevData, selectedData]);
    }
  };
  const getCourses = async (major = "", keyword = "") => {
    try {
      const response = await axios.get(`/application`, {
        params: {
          major,
          keyword,
        },
      });
      setCourses(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectChange = async (value) => {
    setSelectMajor(value);
    getCourses(value, keyword);
  };

  const handleKeywordChange = (e) => {
    setKeyword(e.target.value);
  };

  const handleEnter = () => {
    getCourses(selectMajor, keyword);
  };

  //뷰 변경하기
  const onChange = (key) => console.log(`tab changed to ${key}`);

  return (
    <Layout>
      <Header className={styles.header}>
        <img src="logo.png" alt="logo" className={styles.logo} />
      </Header>

      <Layout>
        <Content className={styles.contentStyle}>
          <h1 className={styles.title}>희망강의신청</h1>
          <div className={styles.formBackground}>
            <h3 className={styles.smallTitle}>학생정보</h3>
            <Form layout="vertical">
              <Row gutter={16}>
                <Col span={4}>
                  <Form.Item label="학번">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item label="성명">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item label="소속">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item label="학년/가진급학년">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item label="강의년도">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item label="강의학기">
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>

          {/* 검색 부분 */}
          <div className={styles.formBackground}>
            <h3 className={styles.smallTitle}>강의 검색</h3>
            <Form layout="vertical">
              <Row gutter={16}>
                <Col span={4}>
                  <Form.Item>
                    <Select
                      defaultValue="전공"
                      onChange={handleSelectChange}
                      allowClear={true}
                    >
                      <Option value="건설환경공학과">건설환경공학과</Option>
                      <Option value="교육학과">교육학과</Option>
                      <Option value="통계학과">통계학과</Option>
                      <Option value="융합소프트웨어">융합소프트웨어</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item>
                    <Input
                      placeholder="검색어를 입력해주세요"
                      suffix={
                        <SearchOutlined
                          className={styles.searchIcon}
                          onClick={handleEnter}
                        />
                      }
                      value={keyword}
                      onChange={handleKeywordChange}
                      onPressEnter={handleEnter}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>

          {/* 강의 신청 부분 */}
          <div className={styles.gutter16}>
            <div className={styles.flexWrapper}>
              <div className={styles.contentWrapper}>
                <h3 className={styles.smallTitle}>종합강의시간표목록</h3>
                <Table
                  dataSource={courses}
                  columns={columns}
                  onRow={(record) => ({
                    onClick: () => handleDataClick(record),
                  })}
                />
              </div>

              <div className={styles.button_wrapper}>
                <Button shape="circle" onClick={handleAddButtonClick}>
                  +
                </Button>
                <div className={styles.button_space}></div>
                <Button shape="circle">-</Button>
              </div>

              <div className={styles.contentWrapper}>
                <Tabs onChange={onChange} type="card">
                  <TabPane tab="테이블뷰" key="1">
                    {addedData.length > 0 ? (
                      <Table dataSource={addedData} columns={columns} />
                    ) : (
                      <p>추가된 데이터가 없습니다.</p>
                    )}
                  </TabPane>
                  <TabPane tab="시간표뷰" key="2">
                    희망강의 수강신청 확인 뷰 2
                  </TabPane>
                </Tabs>
              </div>
            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

// eslint-disable-next-line no-lone-blocks
{
  /* <Col span={4}>
      <Form.Item>
        <Button type="primary" className={styles.queryButton} onClick={handleSearch}>
          조회
        </Button>
        <Button type="primary" className={styles.queryButton}>
          초기화
        </Button>
      </Form.Item>
    </Col> */
}

export default Application;
