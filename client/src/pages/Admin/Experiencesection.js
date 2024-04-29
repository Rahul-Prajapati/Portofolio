import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Form, message } from 'antd';
import { UseDispatch } from 'react-redux';
import { ReloadData } from '../../redux/portfolio_dataSlice';

const Experiencesection = () => {
    const dispatch = useDispatch();
    const { portfolioData } = useSelector((state) => state.root);
    const { Experience } = portfolioData;

    const [showEditOption, setShowEditOption] = useState(false);
    const [selectedEdit, setSelectedEdit] = useState(null);

    const [type, setType] = useState("Add");

    const onFinish = async (values) => {
        try {
            let response;

            if (selectedEdit) {

                response = await fetch("/api/portfolio/update-experience", {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/json',
                        "Access-Control-Allow-Origin": "*",
                    },
                    body: JSON.stringify({
                        ...values,
                        _id: selectedEdit._id,
                    }),
                });

            }
            else {
                response = await fetch("/api/portfolio/add-experience", {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/json',
                        "Access-Control-Allow-Origin": "*",
                    },
                    body: JSON.stringify({
                        values
                    }),
                });

            }


            if (!response.ok) {
                // Handle HTTP error status
                console.error("HTTP error:", response.status);
                // You can throw an error or handle it in a way that makes sense for your application
                throw new Error("HTTP error: " + response.status);
            }

            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                // Handle non-JSON response
                console.error("Invalid response format:", contentType);
                throw new Error("Invalid response format: " + contentType);
            }

            const data = await response.json();

            // Check if the response is empty
            if (Object.keys(data).length === 0 && data.constructor === Object) {
                console.warn("Empty response");
                // Handle empty response if needed
            } else {
                console.log("Response data:", data);
            }
            if (response.data.success) {
                message.success(response.data.message);
                setShowEditOption(false);
                setSelectedEdit(null);
                // dispatch(HideLoading());
                dispatch(ReloadData(true));
            } else {
                message.error(response.data.message);
            }
        } catch (error) {
            message.error(error.message);
        }
        console.log(values);
    }

    const onDelete = async (item) => {
        try {

            const response = await fetch("/api/portfolio/delete-experience", {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({
                    _id: item._id,
                }),
            });

            if (response.data.success) {
                message.success(response.data.message);
                dispatch(ReloadData(true));
            } else {
                message.error(response.data.message);
            }



        }
        catch (error) {
            message.error(error.message);
        }
    }
    return (
        <div>
            <div className='flex justify-end p-3'>
                <button className='bg-primary px-5 py-2 text-white'
                    onClick={() => {
                        setSelectedEdit(null);
                        setShowEditOption(true);
                        setType("Add");
                    }}
                >
                    Add
                </button>
            </div>
            <div className='grid grid-cols-1 lg:grid-cols-4 gap-5'>
                {Experience.map((experience) => (
                    <div className='shadow border p-5 border-gray-400 flex flex-col'>
                        <h1 className='text-secondary text-xl font-bold'>
                            {experience.period}
                        </h1>
                        <hr />
                        <h1>Company : {experience.company}</h1>
                        <h1>Role : {experience.title}</h1>
                        <h1>Description : {experience.description}</h1>
                        <div className='flex justify-end gap-5 mt-5'>
                            <button className='bg-primary text-white px-5 py-2' onClick={() => {
                                setShowEditOption(true);
                                setSelectedEdit(experience);
                                setType("Edit");
                            }} >
                                Edit
                            </button>
                            <button className='bg-primary text-white px-5 py-2'
                                onClick={() => {
                                    onDelete(experience)
                                }}

                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            {(type === "Add" || selectedEdit) && (
                <Modal
                    open={showEditOption}
                    title={selectedEdit ? "Edit Experience" : "Add Experience"}
                    footer={null}
                    onCancel={
                        () => {
                            setShowEditOption(false)
                            setSelectedEdit(null)
                        }
                    }
                >
                    <Form layout="vertical" onFinish={onFinish}
                        initialValues={selectedEdit || {}}
                    >
                        <Form.Item name="period" label="Period" >
                            <input placeholder='Period' className='border-4 w-full' />
                        </Form.Item>

                        <Form.Item name="company" label="Company" >
                            <input placeholder='Company' className='border-4 w-full' />
                        </Form.Item>

                        <Form.Item name="title" label="title" >
                            <input placeholder='title' className='border-4 w-full' />
                        </Form.Item>

                        <Form.Item name="description" label="Description" >
                            <textarea placeholder='Description' className='border-4 w-full' />
                        </Form.Item>
                    </Form>

                    <div className='flex' >
                        <button className='bg-primary text-white px-5 py-2' onClick={() => {
                            setShowEditOption(false);
                        }} >
                            Cancel
                        </button>
                        <button className='bg-primary text-white px-5 py-2' type='submit' >
                            {selectedEdit ? "Update" : "Add"}
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    )
}

export default Experiencesection;