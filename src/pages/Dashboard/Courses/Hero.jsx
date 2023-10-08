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
import TextArea from 'antd/es/input/TextArea';

const initialState = { courseName: '', description: '' };

export default function Hero() {
  const [state, setState] = useState(initialState);
  const [isProcessing, setIsProcessing] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setState((prevState) => ({
      ...prevState,
      [name] : value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { courseName, description } = state;


    setIsProcessing(true);

    try {
      if (selectedCourse) {
        await handleUpdate();
      } else {
        const courseData = {
          courseName,
          description,
          id: Math.random().toString(36).slice(2),
        };

        await createDocument(courseData);
      }
    } catch (error) {
      console.error('Error handling todo: ', error);
      message.error('Something went wrong');
    }
  };

  const createDocument = async (courseData) => {
    try {
      await setDoc(doc(firestore, 'courses', courseData.id), courseData);
      message.success('A new todo added successfully');
    } catch (e) {
      console.error('Error adding document: ', e);
      message.error('Something went wrong while adding todo');
    } finally {
      setIsProcessing(false);
      getCourses();
      setState(initialState);
      setIsDrawerOpen(false);
    }
  };

  const getCourses = async () => {
    try {
      const q = query(collection(firestore, 'courses'));
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
    getCourses();
  }, []);

  const handleEdit = (course) => {
    setSelectedCourse(course);
    setState({ ...course });
    setIsDrawerOpen(true);
  };

  const handleUpdate = async () => {
    const { courseName, description } = state;

    if (!courseName) {
      return message.error('Please enter name');
    }

    const updatedCourse = {
      courseName,
      description,
      dateModified: new Date().getTime(),
    };

    try {
      await setDoc(doc(firestore, 'courses', selectedCourse.id), updatedCourse);
      message.success('Student updated successfully');
    } catch (error) {
      console.error('Error updating todo: ', error);
      message.error('Something went wrong while updating todo');
    } finally {
      setIsProcessing(false);
      getCourses();
      setIsDrawerOpen(true);
    }
  };

  const handleDelete = async (course) => {
    try {
      await deleteDoc(doc(firestore, 'courses', course.id));
      message.success('Course deleted successfully');
      getCourses();
    } catch (err) {
      console.error(err);
      message.error('Something went wrong while deleting Course');
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
                      <th>Course Name</th>
                      <th>Course Code</th>
                      <th>Description</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map((course, i) => {
                      return (
                        <tr key={i}>
                          <th>{i + 1}</th>
                          <td>{course.courseName}</td>
                          <td>{course.id}</td>
                          <td>{course.description}</td>
                          <td>
                            <Space>
                              <Tooltip name="Delete" color="red">
                                <Button
                                  danger
                                  icon={<DeleteOutlined />}
                                  onClick={() => {
                                    handleDelete(course);
                                  }}
                                />
                              </Tooltip>
                              <Button
                                type="primary"
                                icon={<EditOutlined />}
                                onClick={() => handleEdit(course)}
                              ></Button>
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
          title={selectedCourse ? 'Edit Student' : 'Add Student'}
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
                <Form.Item label="Course Name">
                  <Input
                    placeholder="Input your Course Name"
                    name="courseName"
                    value={state.courseName}
                    onChange={handleChange}
                  />
                </Form.Item>
              </Col>
             
              <Col span={24}>
                <Form.Item label="description">
                  <TextArea
                    placeholder="Input your Description"
                    name="description"
                    value={state.description}
                    onChange={handleChange}
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
                  {selectedCourse ? 'Update Student' : 'Add Student'}
                </Button>
              </Col>
            </Row>
          </Form>
        </Drawer>
      </div>
    </>
  );
}
