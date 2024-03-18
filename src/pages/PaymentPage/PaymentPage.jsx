import { Checkbox, Form, Radio } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { Label, WrapperInfo, WrapperLeft, WrapperRadio, WrapperRight, WrapperTotal } from './style';

import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { WrapperInputNumber } from '../../components/ProductDetailsComponent/style';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import * as UserService from '../../services/UserService';
import * as OrderService from '../../services/OrderService';
import * as PaymentService from '../../services/PaymentService';
import * as message from '../../components/Message/Message';
import { useDispatch, useSelector } from 'react-redux';
import { removeAllOrderProduct } from '../../redux/slides/orderSlide';
import { convertPrice } from '../../utils';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import InputComponent from '../../components/InputComponent/InputComponent';
import { useMutationHooks } from '../../hooks/useMutationHook';
import Loading from '../../components/LoadingComponent/Loading';
import { updateUser } from '../../redux/slides/userSlide';
import { useNavigate } from 'react-router-dom';
import { PayPalButton } from 'react-paypal-button-v2';

const PaymentPage = () => {
    const navigate = useNavigate();
    const order = useSelector((state) => state.order);
    console.log('orderPayment', order);
    const user = useSelector((state) => state.user);

    const [delivery, setDelivery] = useState('fast');
    const [payment, setPayment] = useState('later_money');
    const [skdReady, setSkdReady] = useState(false);

    const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false);
    const [stateUserDetails, setStateUserDetails] = useState({
        name: '',
        phone: '',
        address: '',
        city: '',
    });
    const [form] = Form.useForm();
    const dispatch = useDispatch();

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

    const deliverPriceMemo = useMemo(() => {
        if (priceMemo > 100) {
            return 0;
        } else if (priceMemo === 0) {
            return 0;
        } else {
            return 5;
        }
    }, [priceMemo]);

    const totalPriceMemo = useMemo(() => {
        return Number(priceMemo) - Number(priceDiscountMemo) + Number(deliverPriceMemo);
    }, [priceMemo, priceDiscountMemo, deliverPriceMemo]);

    const handleAddOrder = () => {
        if (
            user?.access_token &&
            order?.orderItemsSelected &&
            user?.name &&
            user?.address &&
            user?.phone &&
            user?.city &&
            priceMemo &&
            user?.id
        ) {
            // eslint-disable-next-line no-unused-expressions
            mutationAddOrder.mutate({
                token: user?.access_token,
                orderItems: order?.orderItemsSelected,
                fullName: user?.name,
                address: user?.address,
                phone: user?.phone,
                city: user?.city,
                paymentMethod: payment,
                itemsPrice: priceMemo,
                shippingPrice: deliverPriceMemo,
                totalPrice: totalPriceMemo,
                user: user?.id,
            });
        }
    };
    console.log('order', order, user);

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

    const onSuccessPaypal = (details, data) => {
        console.log('details, data', details, data);
        mutationAddOrder.mutate({
            token: user?.access_token,
            orderItems: order?.orderItemsSelected,
            fullName: user?.name,
            address: user?.address,
            phone: user?.phone,
            city: user?.city,
            paymentMethod: payment,
            itemsPrice: priceMemo,
            shippingPrice: deliverPriceMemo,
            totalPrice: totalPriceMemo,
            user: user?.id,
            isPaid: true,
            paidAt: details.update_time,
        });
    };

    const mutationUpdate = useMutationHooks((data) => {
        const { id, token, ...rests } = data;
        const res = UserService.updateUser(id, { ...rests }, token);
        return res;
    });

    const mutationAddOrder = useMutationHooks((data) => {
        const { id, token, ...rests } = data;
        const res = OrderService.createOrder({ ...rests }, token);
        return res;
    });

    const { isLoading, data } = mutationUpdate;
    const { data: dataAdd, isLoading: isLoadingAddOrder, isSuccess, isError } = mutationAddOrder;

    useEffect(() => {
        if (isSuccess && dataAdd?.status === 'OK') {
            const arrayOrdered = [];
            order?.orderItemsSelected?.forEach((element) => {
                arrayOrdered.push(element.product);
            });
            dispatch(removeAllOrderProduct({ listChecked: arrayOrdered }));
            message.success('Order successfully!');
            navigate('/orderSuccess', {
                state: {
                    delivery,
                    payment,
                    orders: order?.orderItemsSelected,
                    totalPriceMemo: totalPriceMemo,
                },
            });
        } else if (isError) {
            message.error();
        }
    }, [isSuccess, isError]);

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
    const handleDilivery = (e) => {
        setDelivery(e.target.value);
    };

    const handlePayment = (e) => {
        setPayment(e.target.value);
    };

    const addPaypalScript = async () => {
        const { data } = await PaymentService.getConfig();
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = `https://www.paypal.com/sdk/js?client-id=${data}`;
        script.async = true;
        script.onload = () => {
            setSkdReady(true);
        };
        document.body.appendChild(script);
        console.log('data', data);
    };

    useEffect(() => {
        if (!window.paypal) {
            addPaypalScript();
        } else {
            setSkdReady(true);
        }
    }, []);

    return (
        <>
            <div style={{ background: '#f5f5fa', with: '100%', height: '100vh' }}>
                <Loading isLoading={isLoadingAddOrder}>
                    <div style={{ height: '100%', width: '1270px', margin: '0 auto' }}>
                        <h3>Payment Method</h3>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <WrapperLeft>
                                <WrapperInfo>
                                    <div>
                                        <Label>Chọn phương thức giao hàng</Label>
                                        <WrapperRadio onChange={handleDilivery} value={delivery}>
                                            <Radio value="fast">
                                                <span style={{ color: '#ea8500', fontWeight: 'bold' }}>FAST</span> Giao
                                                hàng tiết kiệm
                                            </Radio>
                                            <Radio value="gojek">
                                                <span style={{ color: '#ea8500', fontWeight: 'bold' }}>GO_JEK</span>{' '}
                                                Giao hàng tiết kiệm
                                            </Radio>
                                        </WrapperRadio>
                                    </div>
                                </WrapperInfo>
                                <WrapperInfo>
                                    <div>
                                        <Label>Chọn phương thức thanh toán</Label>
                                        <WrapperRadio onChange={handlePayment} value={payment}>
                                            <Radio value="later_money"> Thanh toán tiền mặt khi nhận hàng</Radio>
                                            <Radio value="paypal"> Thanh toán bằng paypal</Radio>
                                        </WrapperRadio>
                                    </div>
                                </WrapperInfo>
                            </WrapperLeft>
                            <WrapperRight>
                                <div style={{ width: '100%' }}>
                                    <WrapperInfo>
                                        <div>
                                            <span>Address: </span>
                                            <span
                                                style={{ fontWeight: 'bold' }}
                                            >{`${user?.address}, ${user?.city}`}</span>
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
                                                {convertPrice(priceDiscountMemo)}%
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
                                                {convertPrice(deliverPriceMemo)}
                                            </span>
                                        </div>
                                    </WrapperInfo>
                                    <WrapperTotal>
                                        <span>Tổng tiền</span>
                                        <span style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span
                                                style={{
                                                    color: 'rgb(254, 56, 52)',
                                                    fontSize: '24px',
                                                    fontWeight: 'bold',
                                                }}
                                            >
                                                {convertPrice(totalPriceMemo)}
                                            </span>
                                            <span style={{ color: '#000', fontSize: '11px' }}>
                                                (Đã bao gồm VAT nếu có)
                                            </span>
                                        </span>
                                    </WrapperTotal>
                                </div>
                                {payment === 'paypal' && skdReady ? (
                                    <div style={{ width: '320px' }}>
                                        <PayPalButton
                                            // amount="0.01"
                                            amount={totalPriceMemo / 3}
                                            // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
                                            onSuccess={onSuccessPaypal}
                                            onError={() => {
                                                alert('Error');
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <ButtonComponent
                                        onClick={() => handleAddOrder()}
                                        size={40}
                                        styleButton={{
                                            background: 'rgb(255, 57, 69)',
                                            height: '48px',
                                            width: '320px',
                                            border: 'none',
                                            borderRadius: '4px',
                                        }}
                                        textButton={'Order'}
                                        styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                                    ></ButtonComponent>
                                )}
                            </WrapperRight>
                        </div>
                    </div>
                </Loading>
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
export default PaymentPage;
