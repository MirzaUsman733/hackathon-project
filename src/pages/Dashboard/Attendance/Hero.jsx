import React, { useEffect, useState } from 'react';
import {
  Button,
  Col,
  Divider,
  Drawer,
  Form,
  Input,
  message,
  Row,
  Select,
  Space,
  Table,
  Tooltip,
} from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import {
  collection,
  deleteDoc,
  doc,
  setDoc,
  getDocs,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import { firestore } from 'config/firebase';

const { Option } = Select;

const initialState = { studentId: '', course: '', status: 'Present' };

export default function Hero() {
  const [state, setState] = useState(initialState);
  const [isProcessing, setIsProcessing] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleChange = (key, value) => {
    setState((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { studentId, course, status } = state;

    if (!studentId || !course || !status) {
      return message.error('Please fill in all fields');
    }

    setIsProcessing(true);

    try {
      if (selectedRecord) {
        await handleUpdate();
      } else {
        const attendanceData = {
          studentId,
          course,
          status,
          serverTime: serverTimestamp(),
          id: Math.random().toString(36).slice(2),
        };

        await createDocument(attendanceData);
      }
    } catch (error) {
      console.error('Error handling attendance: ', error);
      message.error('Something went wrong');
    }
  };

  const createDocument = async (attendanceData) => {
    try {
      await setDoc(doc(firestore, 'attendance', attendanceData.id), attendanceData);
      message.success('Attendance record created successfully');
    } catch (e) {
      console.error('Error adding document: ', e);
      message.error('Something went wrong while adding attendance record');
    } finally {
      setIsProcessing(false);
      getAttendance();
      setState(initialState);
      setIsDrawerOpen(false);
    }
  };

  const getAttendance = async () => {
    try {
      const q = query(collection(firestore, 'attendance'));
      const querySnapshot = await getDocs(q);
      const array = [];
      querySnapshot.forEach((doc) => {
        let data = doc.data();
        array.push({ ...data, id: doc.id });
      });
      setDocuments(array);
    } catch (error) {
      console.error('Error getting attendance records: ', error);
    }
  };

  const getStudents = async () => {
    try {
      const q = query(collection(firestore, 'students'));
      const querySnapshot = await getDocs(q);
      const studentArray = [];
      querySnapshot.forEach((doc) => {
        let data = doc.data();
        studentArray.push({ ...data, id: doc.id });
      });
      setStudents(studentArray);
    } catch (error) {
      console.error('Error getting students: ', error);
    }
  };

  useEffect(() => {
    getAttendance();
    getStudents();
  }, []);

  const handleEdit = (record) => {
    setSelectedRecord(record);
    setState({ ...record });
    setIsDrawerOpen(true);
  };

  const handleUpdate = async () => {
    const { studentId, course, status } = state;

    if (!studentId || !course || !status) {
      return message.error('Please fill in all fields');
    }

    const updatedRecord = {
      studentId,
      course,
      status,
      dateModified: new Date().getTime(),
    };

    try {
      await setDoc(doc(firestore, 'attendance', selectedRecord.id), updatedRecord);
      message.success('Attendance record updated successfully');
    } catch (error) {
      console.error('Error updating attendance record: ', error);
      message.error('Something went wrong while updating attendance record');
    } finally {
      setIsProcessing(false);
      getAttendance();
      setIsDrawerOpen(true);
    }
  };

  const handleDelete = async (record) => {
    try {
      await deleteDoc(doc(firestore, 'attendance', record.id));
      message.success('Attendance record deleted successfully');
      getAttendance();
    } catch (err) {
      console.error(err);
      message.error('Something went wrong while deleting attendance record');
    }
  };

  const columns = [
    {
      title: 'Student Name',
      dataIndex: 'studentId',
      key: 'studentId',
      render: (studentId) => {
        const student = students.find((s) => s.id === studentId);
        return student ? student.name : 'Unknown';
      },
    },
    {
      title: 'Course',
      dataIndex: 'course',
      key: 'course',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Action',
      key: 'action',
      render: (record) => (
        <Space size="middle">
          <Tooltip title="Edit">
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              type="danger"
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div className="py-5">
        <div className="container">
          <div className="row">
            <div className="col text-center">
              <h1>Attendance Tracker</h1>
            </div>
          </div>
          <Divider />

          <div className="row">
            <div className="col">
              <Table
                dataSource={documents}
                columns={columns}
                rowKey={(record) => record.id}
              />
            </div>
          </div>
          <Button
            type="primary"
            onClick={() => {
              setState(initialState);
              setIsDrawerOpen(true);
            }}
          >
            Add Attendance Record
          </Button>
        </div>

        <Drawer
          title={selectedRecord ? 'Edit Attendance Record' : 'Add Attendance Record'}
          placement="right"
          closable={true}
          onClose={() => {
            setState(initialState);
            setIsDrawerOpen(false);
          }}
          visible={isDrawerOpen}
        >
          <Form layout="vertical">
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="Student">
                  <Select
                    value={state.studentId}
                    onChange={(value) => handleChange('studentId', value)}
                  >
                    {students.map((student) => (
                      <Option key={student.id} value={student.id}>
                        {student.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="Course">
                  <Input
                    placeholder="Input the course"
                    name="course"
                    value={state.course}
                    onChange={(e) => handleChange('course', e.target.value)}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="Status">
                  <Select
                    value={state.status}
                    onChange={(value) => handleChange('status', value)}
                  >
                    <Option value="Present">Present</Option>
                    <Option value="Absent">Absent</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isProcessing}
                  onClick={handleSubmit}
                >
                  {selectedRecord ? 'Update Attendance Record' : 'Add Attendance Record'}
                </Button>
              </Col>
            </Row>
          </Form>
        </Drawer>
      </div>
    </>
  );
}
