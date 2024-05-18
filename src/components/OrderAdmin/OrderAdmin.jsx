import { Button, Dropdown, Form, Menu, Select, Space, Switch } from 'antd';
import { DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import React, { useEffect, useRef, useState } from 'react';
import { WrapperHeader, WrapperUploadFile } from './style';
import TableComponent from '../TableComponent/TableComponent';
import ModalComponent from '../ModalComponent/ModalComponent';
import InputComponent from '../InputComponent/InputComponent';
import Loading from '../LoadingComponent/Loading';
import * as message from '../Message/Message';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { useMutationHooks } from '../../hooks/useMutationHook';
import { convertPrice, getBase64 } from '../../utils';
import * as OrderService from '../../services/OrderService';
import DrawerComponent from '../DrawerComponent/DrawerComponent';
import { orderConstant } from '../../constant';
import PieChartComponent from './PieChart';
import { Option } from 'antd/lib/mentions';
const OrderAdmin = () => {
    const user = useSelector((state) => state?.user);
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
    const getAllOrders = async () => {
        const res = await OrderService.getAllOrder(user?.access_token);
        return res;
    };

    const queryOrder = useQuery({ queryKey: ['orders'], queryFn: getAllOrders });
    const { isLoading: isLoadingOrders, data: orders } = queryOrder;

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        // setSearchText(selectedKeys[0]);
        // setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        // setSearchText('');
    };
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <InputComponent
                    // ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1890ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                // setTimeout(() => searchInput.current?.select(), 100);
            }
        },
    });

    // const columns = [
    //     {
    //         title: 'Username',
    //         dataIndex: 'userName',
    //         sorter: (a, b) => a.userName.length - b.userName.length,
    //         ...getColumnSearchProps('userName'),
    //     },
    //     {
    //         title: 'Phone',
    //         dataIndex: 'phone',
    //         sorter: (a, b) => a.phone.length - b.phone.length,
    //         ...getColumnSearchProps('phone'),
    //     },
    //     {
    //         title: 'Address',
    //         dataIndex: 'address',
    //         sorter: (a, b) => a.address - b.address,
    //         ...getColumnSearchProps('address'),
    //     },
    //     {
    //         title: 'Paid',
    //         dataIndex: 'isPaid',
    //         // sorter: (a, b) => a.isPaid - b.isPaid,
    //         // ...getColumnSearchProps('isPaid'),
    //         render: (text, record) => (
    //             <Switch checked={text} onChange={(checked) => handlePaidChange(checked, record)} />
    //         ),
    //     },
    //     {
    //         title: 'Shipped',
    //         dataIndex: 'isDelivered',
    //         sorter: (a, b) => a.isDelivered.length - b.isDelivered.length,
    //         ...getColumnSearchProps('isDelivered'),
    //     },
    //     {
    //         title: 'Payment method',
    //         dataIndex: 'paymentMethod',
    //         sorter: (a, b) => a.paymentMethod - b.paymentMethod,
    //         ...getColumnSearchProps('paymentMethod'),
    //     },
    //     {
    //         title: 'Total price',
    //         dataIndex: 'totalPrice',
    //         sorter: (a, b) => a.totalPrice - b.totalPrice,
    //         ...getColumnSearchProps('totalPrice'),
    //     },
    // ];

    let temp = 0;
    const dataTable =
        orders?.data?.length &&
        orders?.data?.map((order) => {
            temp++;
            return {
                ...order,
                key: order._id,
                userName: order?.shippingAddress?.fullName,
                phone: order?.shippingAddress?.phone,
                address: order?.shippingAddress?.address,
                paymentMethod: orderConstant.payment[order?.paymentMethod],
                isPaid: order?.isPaid ? 'TRUE' : 'FALSE',
                isDelivered: order?.isDelivered ? 'TRUE' : 'FALSE',
                totalPrice: convertPrice(order?.totalPrice),
            };
        });
    const [data, setData] = useState(dataTable);

    const handlePaidChange = (value, record) => {
        const newData = data.map((item) => {
            if (item.key === record.key) {
                return { ...item, isPaid: value === 'false' };
            }
            return item;
        });
        setData(newData);
    };
    console.log('orders: ', orders);
    // const paidMenu = (record) => (
    //     <Menu onClick={({ key }) => handlePaidChange(record, key === 'true')}>
    //         <Menu.Item key="true">True</Menu.Item>
    //         <Menu.Item key="false">False</Menu.Item>
    //     </Menu>
    // );
    const mutationDeletedMany = useMutationHooks((data) => {
        const { token, ...ids } = data;
        const res = OrderService.deleteManyOrder(ids, token);
        return res;
    });
    const handleDeleteManyProducts = (ids) => {
        mutationDeletedMany.mutate(
            { ids: ids, token: user?.access_token },
            {
                onSettled: () => {
                    queryOrder.refetch();
                },
            },
        );
    };
    const {
        data: dataDeletedMany,
        isLoading: isLoadingDeletedMany,
        isSuccess: isSuccessDeletedMany,
        isError: isErrorDeletedMany,
    } = mutationDeletedMany;

    const columns = [
        {
            title: 'Username',
            dataIndex: 'userName',
            sorter: (a, b) => a.userName.length - b.userName.length,
            ...getColumnSearchProps('userName'),
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            sorter: (a, b) => a.phone.length - b.phone.length,
            ...getColumnSearchProps('phone'),
        },
        {
            title: 'Address',
            dataIndex: 'address',
            sorter: (a, b) => a.address - b.address,
            ...getColumnSearchProps('address'),
        },
        {
            title: 'Paid',
            dataIndex: 'isPaid',
            sorter: (a, b) => a.isPaid - b.isPaid,
            ...getColumnSearchProps('isPaid'),
            // render: (text, record) => (
            //     <Switch checked={text} onChange={(checked) => handlePaidChange(checked, record)} />
            // ),
            // render: (text, record) => (
            //     <Select defaultValue={String(text)} onChange={(value) => handlePaidChange(value, record)}>
            //         <Option value="true">True</Option>
            //         <Option value="false">False</Option>
            //     </Select>
            // ),
        },
        // {
        //     title: 'Shipped',
        //     dataIndex: 'isDelivered',
        //     sorter: (a, b) => a.isDelivered.length - b.isDelivered.length,
        //     ...getColumnSearchProps('isDelivered'),
        // },
        {
            title: 'Payment method',
            dataIndex: 'paymentMethod',
            sorter: (a, b) => a.paymentMethod - b.paymentMethod,
            ...getColumnSearchProps('paymentMethod'),
        },
        {
            title: 'Total price',
            dataIndex: 'totalPrice',
            sorter: (a, b) => a.totalPrice - b.totalPrice,
            ...getColumnSearchProps('totalPrice'),
        },
    ];

    return (
        <div>
            <WrapperHeader>Quản lý đơn hàng</WrapperHeader>
            <div style={{ height: '200px', width: '200px' }}>
                <PieChartComponent data={orders?.data} />
            </div>
            <div style={{ marginTop: '20px' }}>
                <TableComponent
                    columns={columns}
                    handleDeleteMany={handleDeleteManyProducts}
                    isLoading={isLoadingOrders}
                    data={dataTable}
                />
            </div>
            {/* <DrawerComponent
                title="Detail product"
                isOpen={isOpenDrawer}
                onClose={() => setIsOpenDrawer(false)}
                width="90%"
            >
                <Loading isLoading={isLoadingUpdate || isLoadingUpdated}>
                    <Form
                        name="basic"
                        labelCol={{ span: 2 }}
                        wrapperCol={{ span: 22 }}
                        onFinish={onUpdateProduct}
                        autoComplete="on"
                        form={form}
                    >
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[{ required: true, message: 'Please input your name!' }]}
                        >
                            <InputComponent
                                value={stateProductDetails['name']}
                                onChange={handleOnchangeDetails}
                                name="name"
                            />
                        </Form.Item>

                        <Form.Item
                            label="Type"
                            name="type"
                            rules={[{ required: true, message: 'Please input your type!' }]}
                        >
                            <InputComponent
                                value={stateProductDetails['type']}
                                onChange={handleOnchangeDetails}
                                name="type"
                            />
                        </Form.Item>
                        <Form.Item
                            label="Count inStock"
                            name="countInStock"
                            rules={[{ required: true, message: 'Please input your count inStock!' }]}
                        >
                            <InputComponent
                                value={stateProductDetails.countInStock}
                                onChange={handleOnchangeDetails}
                                name="countInStock"
                            />
                        </Form.Item>
                        <Form.Item
                            label="Price"
                            name="price"
                            rules={[{ required: true, message: 'Please input your count price!' }]}
                        >
                            <InputComponent
                                value={stateProductDetails.price}
                                onChange={handleOnchangeDetails}
                                name="price"
                            />
                        </Form.Item>
                        <Form.Item
                            label="Description"
                            name="description"
                            rules={[{ required: true, message: 'Please input your count description!' }]}
                        >
                            <InputComponent
                                value={stateProductDetails.description}
                                onChange={handleOnchangeDetails}
                                name="description"
                            />
                        </Form.Item>
                        <Form.Item
                            label="Rating"
                            name="rating"
                            rules={[{ required: true, message: 'Please input your rating!' }]}
                        >
                            <InputComponent
                                value={stateProductDetails.rating}
                                onChange={handleOnchangeDetails}
                                name="rating"
                            />
                        </Form.Item>
                        <Form.Item
                            label="Discount"
                            name="discount"
                            rules={[{ required: true, message: 'Please input your discount!' }]}
                        >
                            <InputComponent
                                value={stateProductDetails.discount}
                                onChange={handleOnchangeDetails}
                                name="discount"
                            />
                        </Form.Item>
                        <Form.Item
                            label="Image"
                            name="image"
                            rules={[{ required: true, message: 'Please input your count image!' }]}
                        >
                            <WrapperUploadFile onChange={handleOnchangeAvatarDetails} maxCount={1}>
                                <Button>Select File</Button>
                                {stateProductDetails?.image && (
                                    <img
                                        src={stateProductDetails?.image}
                                        style={{
                                            height: '60px',
                                            width: '60px',
                                            borderRadius: '50%',
                                            objectFit: 'cover',
                                            marginLeft: '10px',
                                        }}
                                        alt="avatar"
                                    />
                                )}
                            </WrapperUploadFile>
                        </Form.Item>
                        <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
                            <Button type="primary" htmlType="submit">
                                Apply
                            </Button>
                        </Form.Item>
                    </Form>
                </Loading>
            </DrawerComponent> */}
            {/* <ModalComponent
                title="Delete product"
                open={isModalOpenDelete}
                onCancel={handleCancelDelete}
                onOk={handleDeleteProduct}
            >
                <Loading isLoading={isLoadingDeleted}>
                    <div>Bạn có chắc chắn muốn xoá sản phẩm này?</div>
                </Loading>
            </ModalComponent> */}
        </div>
    );
};

export default OrderAdmin;
