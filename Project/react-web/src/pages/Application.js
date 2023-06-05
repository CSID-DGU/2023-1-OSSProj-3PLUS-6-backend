import { React, useEffect, useState } from "react";
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
  Modal,
} from "antd";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DroppableTable from "../components/DroppableTable.js";
import CourseRow from "../components/CourseRow.js";
import styles from "../css/Application.module.css";
import theme from "../styles/theme.js";
import styled from "styled-components";
import axios from "axios";
import { SearchOutlined } from "@ant-design/icons";
import StyledTimeTable from "../components/TimeTable.js";
import { useCookies } from "react-cookie";
import { Navigate, useNavigate } from "react-router-dom";
import StyledModal from "../components/common/Modal.js";
import { genComponentStyleHook } from "antd/es/theme/internal.js";
import { NoStyleItemContext } from "antd/es/form/context.js";

const { Option } = Select;
const { TabPane } = Tabs;
const { Header, Content } = Layout;

const CustomInput = styled(Input)`
  background-color: ${theme.colors.gray200} !important; // light gray
  border-color: ${theme.colors.gray200}!important;
  &:focus {
    border-color: ${theme.colors.gray200} !important;
    box-shadow: none !important;
  }
`;

const columns = [
  { title: "교과목명", dataIndex: "교과목명", key: "교과목명" },
  { title: "교원명", dataIndex: "교원명", key: "교원명" },
  { title: "요일", dataIndex: "요일", key: "요일" },
  { title: "시간", dataIndex: "시간", key: "시간" },
  { title: "강의실", dataIndex: "강의실", key: "강의실" },
  { title: "수강정원", dataIndex: "수강정원", key: "수강정원" },
  { tite: "학점", dateIndex: "학점", key: "학점" },
  // { title: "신청인원", dataIndex: "applications", key: "applications" },
];

const Application = () => {
  //검색 기능 관련 변수
  const [courses, setCourses] = useState([]);
  const [selectMajor, setSelectMajor] = useState("");
  const [keyword, setKeyword] = useState("");
  const [selectedData, setSelectedData] = useState("");
  const [addedData, setAddedData] = useState([]);
  const [cookies, setcookie, removecookie] = useCookies(["x_auth"]);
  const token = cookies?.x_auth;

  const getSelectedCourses = async () => {
    try {
      const res = await axios.get("/application/seclectedCourse", {
        params: {
          token: token,
        },
      });
      const userCourses = res.data;
      setAddedData(userCourses);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getSelectedCourses();
  }, [token]); // token이 변경될 때마다 getSelectedCourses 함수가 실행됩니다.

  const navigate = useNavigate();
  useEffect(() => {
    if (!token) {
      navigate("/signin");
    }
  }, [token, navigate]);

  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    axios
      .get("/application/userInfo")
      .then((response) => {
        if (response.data.success) {
          setUserInfo(response.data.data);
        } else {
          console.log("error");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []); // []은 의존성 배열입니다. 이 배열이 비어있으면 컴포넌트가 처음 마운트될 때 한 번만 실행됩니다.

  // 데이터 클릭 이벤트 핸들러
  const handleDataClick = (record) => {
    setSelectedData(record);
  };

  // 플러스 버튼 클릭 이벤트 핸들러
  const handleAddButtonClick = () => {
    if (
      selectedData &&
      !addedData.some((item) => item._id === selectedData._id)
    ) {
      setAddedData((prevData) => [...prevData, selectedData]);
      const data = {
        userToken: token,
        lectureId: selectedData._id,
      };
      axios
        .post("/application/add", data)
        .then((res) => {
          getSelectedCourses(); // 강의 추가 후 강의 목록을 다시 불러옴
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      setIsModalVisible(true);
    }
  };

  //이미 신청된 강의는 모달 띄우는 핸들러
  const [isModalVisible, setIsModalVisible] = useState(false); // 모달 visible state

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // 마이너스 버튼 클릭 이벤트 핸들러
  const handleDelete = () => {
    axios
      .delete("/application/delete", {
        data: {
          userToken: token,
          lectureId: selectedData._id,
        },
      })
      .then((res) => {
        getSelectedCourses(); // 강의 삭제 후 강의 목록을 다시 불러옴
      })
      .catch((err) => {
        console.error(err);
      });
  };

  //서버에서 코스 가져오는 코드
  const getCourses = async (major = "", keyword = "") => {
    try {
      const response = await axios.get(`/application/search`, {
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

  const logoutURL = "/signin"; // 리다이렉트할 URL 을 상수화시켜서 넣어주었다.

  //로그아웃
  const handleLogout = () => {
    // 로그아웃 버튼을 누르면 실행되는 함수
    removecookie("x_auth"); // 쿠키삭제후
    window.location.href = logoutURL; // 현재url을 변경해준다.
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Layout>
        <Header className={styles.header}>
          <img src="logo.png" alt="logo" className={styles.logo} />
          <div className={styles.headerRight}>
            <div className={styles.headerRightTop}>
              <div className={styles.headerRightTopRight}>
                <span className={styles.headerRightTopRightText}>
                  {userInfo && userInfo.name}님
                </span>
                <span className={styles.headerRightTopRightText}>
                  {userInfo && userInfo.major}
                </span>
              </div>
              <div className={styles.headerRightTopRight}>
                <Button
                  type="primary"
                  className={styles.headerRightTopRightButton}
                  onClick={handleLogout}
                >
                  로그아웃
                </Button>
              </div>
            </div>
            <div className={styles.headerRightBottom}>
              <Button
                type="primary"
                className={styles.headerRightTopRightButton}
                onClick={() => {
                  window.location.href = "/mypage";
                }}
              >
                마이페이지
              </Button>
            </div>
          </div>
        </Header>

        <Layout>
          <Content className={styles.contentStyle}>
            <h1 className={styles.title}>희망강의신청</h1>
            <div className={styles.formBackground}>
              <h3 className={styles.smallTitle}>학생 정보</h3>
              <Form layout="vertical">
                <Row gutter={16}>
                  <Col span={4}>
                    <Form.Item label="학번">
                      <CustomInput
                        value={userInfo ? userInfo.studentNum : ""}
                        readOnly
                      />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item label="성명">
                      <CustomInput
                        value={userInfo ? userInfo.name : ""}
                        readOnly
                      />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item label="소속">
                      <CustomInput
                        value={userInfo ? userInfo.major : ""}
                        readOnly
                      />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item label="학년/가진급학년">
                      <CustomInput
                        value={userInfo ? userInfo.grade : ""}
                        readOnly
                      />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item label="강의년도">
                      <CustomInput value="2023" readOnly />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item label="강의학기">
                      <CustomInput value="1학기" readOnly />
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
                            className={styles.searchIon}
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
                  <div className={styles.contentWrapper}>
                    <h3 className={styles.smallTitle}>종합강의시간표목록</h3>
                  </div>
                  <Table
                    components={{
                      body: {
                        row: CourseRow,
                      },
                    }}
                    dataSource={courses}
                    columns={columns}
                    onRow={(record) => ({
                      record,
                      onClick: () => handleDataClick(record),
                    })}
                  />
                </div>
                <div className={styles.button_wrapper}>
                  <Button shape="circle" onClick={handleAddButtonClick}>
                    +
                  </Button>
                  <div className={styles.button_space}></div>
                  <Button shape="circle" onClick={() => handleDelete()}>
                    -
                  </Button>
                </div>

                <div className={styles.contentWrapper}>
                  <h3 className={styles.smallTitle}>신청 강의 목록</h3>
                  <Tabs onChange={onChange} type="card">
                    <TabPane tab="테이블뷰" key="1">
                      <DroppableTable
                        dataSource={addedData}
                        columns={columns}
                        setAddedData={setAddedData}
                        onRowClick={handleDataClick}
                        refreshSelectedCourses={getSelectedCourses}
                      />
                    </TabPane>
                    <TabPane tab="시간표뷰" key="2">
                      <StyledTimeTable
                        dataSource={addedData}
                        setAddedData={setAddedData}
                        onRowClick={handleDataClick}
                        refreshSelectedCourses={getSelectedCourses}
                      />
                    </TabPane>
                  </Tabs>
                </div>
              </div>
            </div>
          </Content>
        </Layout>
      </Layout>
      <StyledModal
        isOpen={isModalVisible}
        handleClose={handleCancel}
        message="이미 수강 신청된 강의입니다."
        handleOk={handleOk}
      ></StyledModal>
    </DndProvider>
  );
};

export default Application;
