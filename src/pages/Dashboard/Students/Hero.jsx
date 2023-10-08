import React, { useEffect, useState } from 'react';
import {
  Button,
  Col,
  Divider,
  Drawer,
  Form,
  Input,
  InputNumber,
  message,
  Row,
  Space,
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
} from 'firebase/firestore';
import { firestore } from 'config/firebase';

const initialState = { name: '', fatherName: '', number: '' };

// const { name } = Typography;

export default function Hero() {
  const [state, setState] = useState(initialState);
  const [isProcessing, setIsProcessing] = useState(false);
//   const [allDocuments, setAllDocuments] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setState((prevState) => ({
      ...prevState,
      [name]: name === 'number' ? parseInt(value, 10) : value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, fatherName, number } = state;

    if (!name) {
      return message.error('Please enter name');
    }

    setIsProcessing(true);

    try {
      if (selectedStudent) {
        await handleUpdate();
      } else {
        const studentData = {
          name,
          fatherName,
          number,
          id: Math.random().toString(36).slice(2),
        };

        await createDocument(studentData);
      }
    } catch (error) {
      console.error('Error handling todo: ', error);
      message.error('Something went wrong');
    }
  };

  const createDocument = async (studentData) => {
    try {
      await setDoc(doc(firestore, 'students', studentData.id), studentData);
      message.success('A new todo added successfully');
    } catch (e) {
      console.error('Error adding document: ', e);
      message.error('Something went wrong while adding todo');
    } finally {
      setIsProcessing(false);
      getStudents();
      setState(initialState);
      setIsDrawerOpen(false);
    }
  };

  const getStudents = async () => {
    try {
      const q = query(collection(firestore, 'students'));
      const querySnapshot = await getDocs(q);
      const array = [];
      querySnapshot.forEach((doc) => {
        let data = doc.data();
        array.push({ ...data, id: doc.id });
      });
      setDocuments(array);
    } catch (error) {
      console.error('Error getting todos: ', error);
    }
  };

  useEffect(() => {
    getStudents();
  }, []);

  const handleEdit = (student) => {
    setSelectedStudent(student);
    // setState(todo);
    setState({ ...student });
    setIsDrawerOpen(true);
  };

  const handleUpdate = async () => {
    const { name, fatherName, number } = state;

    if (!name) {
      return message.error('Please enter name');
    }

    const updatedStudent = {
      name,
      fatherName,
      number,
      dateModified: new Date().getTime(),
    };

    try {
      await setDoc(doc(firestore, 'students', selectedStudent.id), updatedStudent);
      message.success('Student updated successfully');
    } catch (error) {
      console.error('Error updating todo: ', error);
      message.error('Something went wrong while updating todo');
    } finally {
      setIsProcessing(false);
      getStudents();
      setIsDrawerOpen(true);
    }
  };

  const handleDelete = async (student) => {
    try {
      await deleteDoc(doc(firestore, 'students', student.id));
      message.success('Student deleted successfully');
      getStudents();
    } catch (err) {
      console.error(err);
      message.error('Something went wrong while deleting Student');
    }
  };
  return (
    <>
      <div className="py-5">
        <div className="container">
          <div className="row">
            <div className="col text-center">
              <h1>Students</h1>
              {/* <Select placeholder="Select status" onChange={status => SetStatus(status)}>
                {["active", "inactive"].map((status, i) => {
                  return <Select.Option key={i} value={status}>{status}</Select.Option>
                })}
              </Select> */}
            </div>
          </div>
          <Divider />

          <div className="row">
            <div className="col">
              <div className="table-responsive">
                <table className="table table-striped align-middle">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>FatherName</th>
                      <th>Phone Number</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map((student, i) => {
                      return (
                        <tr key={i}>
                          <th>{i + 1}</th>
                          <td>{student.name}</td>
                          <td>{student.fatherName}</td>
                          <td>{student.number}</td>
                          <td>
                            <Space>
                              <Tooltip name="Delete" color="red">
                                <Button
                                  danger
                                  icon={<DeleteOutlined />}
                                  onClick={() => {
                                    handleDelete(student);
                                  }}
                                />
                              </Tooltip>
                              <Button
                                type="primary"
                                icon={<EditOutlined />}
                                onClick={() => handleEdit(student)}
                              >
                                
                              </Button>
                            </Space>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <Button
    type="primary"
    onClick={() => {
      setState(initialState);
      setIsDrawerOpen(true);
    }}
  >
    Add Student
  </Button>
        </div>

        <Drawer
          title={selectedStudent ? 'Edit Student' : 'Add Student'}
          placement="right"
          closable={true}
          onClose={() => {
            setState(initialState);
            setIsDrawerOpen(false);
          }}
          open={isDrawerOpen}
        >
          <Form layout="vertical">
            <Row gutter={16}>
              <Col xs={24} lg={12}>
                <Form.Item label="name">
                  <Input
                    placeholder="Input your name"
                    name="name"
                    value={state.name}
                    onChange={handleChange}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} lg={12}>
                <Form.Item label="fatherName">
                  <Input
                    placeholder="Input your fatherName"
                    name="fatherName"
                    value={state.fatherName}
                    onChange={handleChange}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="number">
                  <InputNumber
                    id="myNumberInput"
                    min={1}
                    max={99999999999}
                    step={1}
                    defaultValue={0}
                    value={state.number}
                    onChange={(value) =>
                      handleChange({ target: { name: 'number', value } })
                    }
                  />
                </Form.Item>
              </Col>
              <Col
                xs={24}
                md={{ span: 12, offset: 6 }}
                lg={{ span: 8, offset: 8 }}
              >
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-100"
                  loading={isProcessing}
                  onClick={handleSubmit}
                >
                  {selectedStudent ? 'Update Student' : 'Add Student'}
                </Button>
              </Col>
            </Row>
          </Form>
        </Drawer>
      </div>
    </>
  );
}
