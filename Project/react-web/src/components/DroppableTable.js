import React, { useState } from "react";
import { useDrop } from "react-dnd";
import { Table, Modal } from "antd";
import axios from "axios";

const DroppableTable = ({ dataSource, columns, setAddedData, onRowClick }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [, dropRef] = useDrop(() => ({
    accept: "COURSE",
    drop: (item, monitor) => {
      console.log("사용자가 드롭한 항목: " + item.course.교과목명);
      setAddedData((prevData) => {
        if (!prevData.some((data) => data._id === item.course._id)) {
          axios
            .post("/application/add", item.course)
            .then((res) => {
              console.log(res);
            })
            .catch((err) => {
              console.error(err);
            });
          return [...prevData, item.course]; // item.course를 추가합니다.
        } else {
          setIsModalVisible(true); // 만약 이미 수강신청된 강의라면 모달을 띄웁니다.
        }
        return prevData; // 그렇지 않다면, prevData를 그대로 반환합니다.
      });
    },
  }));

  const handleOk = () => {
    // OK 버튼을 클릭했을 때의 처리
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    // 취소 버튼을 클릭했을 때의 처리
    setIsModalVisible(false);
  };

  return (
    <>
      <Table
        ref={dropRef}
        dataSource={dataSource}
        columns={columns}
        onRow={(record) => ({
          onClick: () => onRowClick(record),
        })}
      />
      <Modal
        title="경고"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>이미 수강 신청된 강의입니다.</p>
      </Modal>
    </>
  );
};

export default DroppableTable;
