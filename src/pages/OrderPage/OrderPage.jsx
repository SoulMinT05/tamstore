import { Checkbox, Form } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import {
    WrapperCountOrder,
    WrapperInfo,
    WrapperItemOrder,
    WrapperLeft,
    WrapperListOrder,
    WrapperRight,
    WrapperStyleHeader,
    WrapperStyleHeaderDelivery,
    WrapperTotal,
} from './style';
import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { WrapperInputNumber } from '../../components/ProductDetailsComponent/style';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import * as UserService from '../../services/UserService';
import * as message from '../../components/Message/Message';
import { useDispatch, useSelector } from 'react-redux';
import {
    decreaseAmount,
    increaseAmount,
    removeAllOrderProduct,
    removeOrderProduct,
    selectedOrder,
} from '../../redux/slides/orderSlide';
import { convertPrice } from '../../utils';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import InputComponent from '../../components/InputComponent/InputComponent';
import { useMutationHooks } from '../../hooks/useMutationHook';
import Loading from '../../components/LoadingComponent/Loading';
import { updateUser } from '../../redux/slides/userSlide';
import { useNavigate } from 'react-router-dom';
import StepComponent from '../../components/StepComponent/StepComponent';
import { current } from '@reduxjs/toolkit';

const OrderPage = () => {
    const navigate = useNavigate();
    const order = useSelector((state) => state.order);
    const user = useSelector((state) => state.user);
    const [rowSelected, setRowSelected] = useState('');

    const [listChecked, setListChecked] = useState([]);
    const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false);
    const [stateUserDetails, setStateUserDetails] = useState({
        name: '',
        phone: '',
        address: '',
        city: '',
    });
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const onChange = (e) => {
        if (listChecked.includes(e.target.value)) {
            const newListChecked = listChecked.filter((item) => item !== e.target.value);
            setListChecked(newListChecked);
        } else {
            setListChecked([...listChecked, e.target.value]);
        }
    };

    const handleChangeCount = (type, idProduct, limited) => {
        if (type === 'increase') {
            if (!limited) {
                dispatch(increaseAmount({ idProduct }));
            }
        } else {
            if (!limited) {
                dispatch(decreaseAmount({ idProduct }));
            }
        }
    };

    const handleDeleteOrder = (idProduct) => {
        dispatch(removeOrderProduct({ idProduct }));
    };

    const handleOnchangeCheckAll = (e) => {
        if (e.target.checked) {
            const newListChecked = [];
            order?.orderItems?.forEach((item) => {
                newListChecked.push(item?.product);
            });
            setListChecked(newListChecked);
        } else {
            setListChecked([]);
        }
    };

    useEffect(() => {
        dispatch(selectedOrder({ listChecked }));
    }, [listChecked]);

    useEffect(() => {
        form.setFieldsValue(stateUserDetails);
    }, [form, stateUserDetails]);

    useEffect(() => {
        if (isOpenModalUpdateInfo) {
            setStateUserDetails({
                city: user?.city,
                name: user?.name,
                address: user?.address,
                phone: user?.phone,
            });
        }
    }, [isOpenModalUpdateInfo]);

    const handleChangeAddress = () => {
        setIsOpenModalUpdateInfo(true);
    };

    const priceMemo = useMemo(() => {
        const result = order?.orderItemsSelected?.reduce((total, cur) => {
            return total + cur?.price * cur?.amount;
        }, 0);
        return result;
    }, [order]);

    const priceDiscountMemo = useMemo(() => {
        const result = order?.orderItemsSelected?.reduce((total, cur) => {
            const totalDiscount = cur.discount ? cur.discount : 0;
            return total + Number((priceMemo * totalDiscount * cur.amount) / 100);
        }, 0);
        if (Number(result)) {
            return result;
        }
        return 0;
    }, [order]);

    const deliveryPriceMemo = useMemo(() => {
        if (priceMemo >= 50 && priceMemo < 120) {
            return 2;
        } else if (priceMemo >= 120 || order?.orderItemsSelected?.length === 0 || priceMemo === 0) {
            return 0;
        } else {
            return 5;
        }
    }, [priceMemo]);
    console.log('order?.orderItemsSelected?.length', order?.orderItemsSelected?.length);
    console.log('deliveryPriceMemo', deliveryPriceMemo);

    const totalPriceMemo = useMemo(() => {
        return Number(priceMemo) - Number(priceDiscountMemo) + Number(deliveryPriceMemo);
    }, [priceMemo, priceDiscountMemo, deliveryPriceMemo]);

    const handleRemoveAllOrder = () => {
        console.log('listChecked', listChecked);
        if (listChecked?.length >= 1) {
            dispatch(removeAllOrderProduct({ listChecked }));
        }
    };
    const handleAddCard = () => {
        if (!order?.orderItemsSelected?.length) {
            message.error('Please select product!');
        } else if (!user?.phone || !user.address || !user.name || !user.city) {
            setIsOpenModalUpdateInfo(true);
        } else {
            navigate('/payment');
        }
    };
    const handleCancelUpdate = () => {
        setStateUserDetails({
            name: '',
            email: '',
            phone: '',
            isAdmin: false,
        });
        form.resetFields();
        setIsOpenModalUpdateInfo(false);
    };

    const mutationUpdate = useMutationHooks((data) => {
        const { id, token, ...rests } = data;
        const res = UserService.updateUser(id, { ...rests }, token);
        return res;
    });

    const { isLoading, data } = mutationUpdate;
    console.log('data', data);

    const handleUpdateInfoUser = () => {
        console.log('stateUserDetails', stateUserDetails);
        const { name, address, city, phone } = stateUserDetails;
        if (name && address && city && phone) {
            mutationUpdate.mutate(
                { id: user?.id, token: user?.access_token, ...stateUserDetails },
                {
                    onSuccess: () => {
                        dispatch(updateUser({ name, address, city, phone }));

                        setIsOpenModalUpdateInfo(false);
                    },
                },
            );
        }
    };

    const handleOnchangeDetails = (e) => {
        setStateUserDetails({
            ...stateUserDetails,
            [e.target.name]: e.target.value,
        });
    };
    console.log('StateUserDetails', stateUserDetails);
    const itemsDelivery = [
        {
            title: '5$',
            description: 'Under 50$',
        },
        {
            title: '2$',
            description: 'From 50$ to under 120$',
        },
        {
            title: '0$',
            description: 'Over 120$',
        },
    ];
    return (
        <>
            <div style={{ background: '#f5f5fa', with: '100%', height: '100vh' }}>
                <div style={{ height: '100%', width: '1270px', margin: '0 auto' }}>
                    <h3>Giỏ hàng</h3>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <WrapperLeft>
                            <WrapperStyleHeaderDelivery>
                                <StepComponent
                                    items={itemsDelivery}
                                    current={
                                        deliveryPriceMemo === 2
                                            ? 1
                                            : deliveryPriceMemo === 5
                                            ? 0
                                            : order.orderItemsSelected.length === 0
                                            ? 0
                                            : 2
                                    }
                                />
                            </WrapperStyleHeaderDelivery>
                            <WrapperStyleHeader>
                                <span style={{ display: 'inline-block', width: '390px' }}>
                                    <Checkbox
                                        onChange={handleOnchangeCheckAll}
                                        checked={listChecked?.length === order?.orderItems?.length}
                                    ></Checkbox>
                                    <span> Tất cả ({order?.orderItems?.length} sản phẩm)</span>
                                </span>
                                <div
                                    style={{
                                        flex: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <span>Đơn giá</span>
                                    <span>Số lượng</span>
                                    <span>Thành tiền</span>
                                    <DeleteOutlined style={{ cursor: 'pointer' }} onClick={handleRemoveAllOrder} />
                                </div>
                            </WrapperStyleHeader>
                            <WrapperListOrder>
                                {order?.orderItems?.map((order) => {
                                    const priceProduct = convertPrice(order?.price * order?.amo);
                                    return (
                                        <WrapperItemOrder>
                                            <div
                                                style={{
                                                    width: '390px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 4,
                                                }}
                                            >
                                                <Checkbox
                                                    onChange={onChange}
                                                    value={order?.product}
                                                    checked={listChecked.includes(order?.product)}
                                                ></Checkbox>
                                                <img
                                                    src={order?.image}
                                                    alt=""
                                                    style={{ width: '77px', height: '79px', objectFit: 'cover' }}
                                                />
                                                <div
                                                    style={{
                                                        width: 260,
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                    }}
                                                >
                                                    {order?.name}
                                                </div>
                                            </div>
                                            <div
                                                style={{
                                                    flex: 1,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                }}
                                            >
                                                <span>
                                                    <span style={{ fontSize: '13px', color: '#242424' }}>
                                                        {convertPrice(order?.price)}
                                                    </span>
                                                </span>
                                                <WrapperCountOrder>
                                                    <button
                                                        style={{
                                                            border: 'none',
                                                            background: 'transparent',
                                                            cursor: 'pointer',
                                                        }}
                                                        onClick={() =>
                                                            handleChangeCount(
                                                                'decrease',
                                                                order?.product,
                                                                order?.amount === 1,
                                                            )
                                                        }
                                                    >
                                                        <MinusOutlined style={{ color: '#000', fontSize: '10px' }} />
                                                    </button>
                                                    <WrapperInputNumber
                                                        defaultValue={order?.amount}
                                                        value={order?.amount}
                                                        size="small"
                                                        min={1}
                                                        max={order?.countInStock}
                                                    />
                                                    <button
                                                        style={{
                                                            border: 'none',
                                                            background: 'transparent',
                                                            cursor: 'pointer',
                                                        }}
                                                        onClick={() =>
                                                            handleChangeCount(
                                                                'increase',
                                                                order?.product,
                                                                order?.amount === order?.countInStock,
                                                                order?.amount === 1,
                                                            )
                                                        }
                                                    >
                                                        <PlusOutlined style={{ color: '#000', fontSize: '10px' }} />
                                                    </button>
                                                </WrapperCountOrder>
                                                <span
                                                    style={{
                                                        color: 'rgb(255, 66, 78)',
                                                        fontSize: '13px',
                                                        fontWeight: 500,
                                                    }}
                                                >
                                                    {convertPrice(order?.price * order?.amount)}
                                                </span>
                                                <DeleteOutlined
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => handleDeleteOrder(order?.product)}
                                                />
                                            </div>
                                        </WrapperItemOrder>
                                    );
                                })}
                            </WrapperListOrder>
                        </WrapperLeft>
                        <WrapperRight>
                            <div style={{ width: '100%' }}>
                                <WrapperInfo>
                                    <div>
                                        <span>Address: </span>
                                        <span style={{ fontWeight: 'bold' }}>{`${user?.address}, ${user?.city}`}</span>
                                        <span
                                            onClick={handleChangeAddress}
                                            style={{ color: 'blue', cursor: 'pointer' }}
                                        >
                                            Change
                                        </span>
                                    </div>
                                </WrapperInfo>
                                <WrapperInfo>
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <span>Tạm tính</span>
                                        <span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }}>
                                            {convertPrice(priceMemo)}
                                        </span>
                                    </div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <span>Giảm giá</span>
                                        <span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }}>
                                            {convertPrice(priceDiscountMemo)}
                                        </span>
                                    </div>

                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <span>Phí giao hàng</span>
                                        <span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }}>
                                            {convertPrice(deliveryPriceMemo)}
                                        </span>
                                    </div>
                                </WrapperInfo>
                                <WrapperTotal>
                                    <span>Tổng tiền</span>
                                    <span style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span
                                            style={{ color: 'rgb(254, 56, 52)', fontSize: '24px', fontWeight: 'bold' }}
                                        >
                                            {convertPrice(totalPriceMemo)}
                                        </span>
                                        <span style={{ color: '#000', fontSize: '11px' }}>(Đã bao gồm VAT nếu có)</span>
                                    </span>
                                </WrapperTotal>
                            </div>
                            <ButtonComponent
                                onClick={() => handleAddCard()}
                                size={40}
                                styleButton={{
                                    background: 'rgb(255, 57, 69)',
                                    height: '48px',
                                    width: '320px',
                                    border: 'none',
                                    borderRadius: '4px',
                                }}
                                textButton={'Mua hàng'}
                                styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                            ></ButtonComponent>
                        </WrapperRight>
                    </div>
                </div>
            </div>
            <ModalComponent
                forceRender
                title="
                Update delivery information"
                open={isOpenModalUpdateInfo}
                onCancel={handleCancelUpdate}
                onOk={handleUpdateInfoUser}
            >
                <Loading isLoading={isLoading}>
                    <Form
                        name="basic"
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 20 }}
                        // onFinish={onUpdateUser}
                        autoComplete="on"
                        form={form}
                    >
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[{ required: true, message: 'Please input your name!' }]}
                        >
                            <InputComponent
                                value={stateUserDetails['name']}
                                onChange={handleOnchangeDetails}
                                name="name"
                            />
                        </Form.Item>
                        <Form.Item
                            label="City"
                            city="city"
                            rules={[{ required: true, message: 'Please input your city!' }]}
                        >
                            <InputComponent
                                value={stateUserDetails['city']}
                                onChange={handleOnchangeDetails}
                                name="city"
                            />
                        </Form.Item>

                        <Form.Item
                            label="Phone"
                            name="phone"
                            rules={[{ required: true, message: 'Please input your phone!' }]}
                        >
                            <InputComponent
                                value={stateUserDetails.phone}
                                onChange={handleOnchangeDetails}
                                name="phone"
                            />
                        </Form.Item>
                        <Form.Item
                            label="Address"
                            name="address"
                            rules={[{ required: true, message: 'Please input your address!' }]}
                        >
                            <InputComponent
                                value={stateUserDetails.address}
                                onChange={handleOnchangeDetails}
                                name="address"
                            />
                        </Form.Item>
                    </Form>
                </Loading>
            </ModalComponent>
        </>
    );
};
export default OrderPage;
