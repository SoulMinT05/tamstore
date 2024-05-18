import { Checkbox, Form } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import {
    WrapperContainer,
    WrapperCountOrder,
    WrapperFooterItem,
    WrapperHeaderItem,
    WrapperInfo,
    WrapperItemOrder,
    WrapperLeft,
    WrapperListOrder,
    WrapperRight,
    WrapperStatus,
    WrapperStyleHeader,
    WrapperStyleHeaderDelivery,
    WrapperTotal,
} from './style';
import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { WrapperInputNumber } from '../../components/ProductDetailsComponent/style';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import * as OrderService from '../../services/OrderService';
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
import Loading from '../../components/LoadingComponent/Loading';
import StepComponent from '../../components/StepComponent/StepComponent';
import { useQuery } from '@tanstack/react-query';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useMutationHooks } from '../../hooks/useMutationHook';

const MyOrderPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { state } = location;
    const fetchMyOrder = async () => {
        const res = await OrderService.getOrderByUserId(state?.id, state?.token);
        return res.data;
    };
    const queryOrder = useQuery(
        { queryKey: ['orders'], queryFn: fetchMyOrder },
        {
            enabled: state?.id && state?.token,
        },
    );
    const { isLoading, data } = queryOrder;
    console.log('data: ', data);
    const handleDetailsOrder = (id) => {
        navigate(`/details-order/${id}`, {
            state: {
                token: state?.token,
            },
        });
    };
    const mutation = useMutationHooks((data) => {
        const { id, token, orderItems } = data;
        const res = OrderService.cancelOrder(id, token, orderItems);
        return res;
    });

    const handleCancelOrder = (order) => {
        mutation.mutate(
            { id: order._id, token: state?.token, orderItems: order?.orderItems },
            {
                onSuccess: () => {
                    queryOrder.refetch();
                },
            },
        );
    };
    const {
        isLoading: isLoadingCancel,
        isSuccess: isSuccessCancel,
        isError: isErrorCancel,
        data: dataCancel,
    } = mutation;
    useEffect(() => {
        if (isSuccessCancel && dataCancel?.status === 'OK') {
            message.success();
        } else if (isErrorCancel) {
            message.error();
        }
    }, [isErrorCancel, isSuccessCancel]);
    const renderProduct = (data) => {
        console.log('data: ', data);
        if (data && typeof data.map === 'function') {
            return data?.map((order) => {
                return (
                    <WrapperHeaderItem key={order?._id}>
                        <img
                            src={order?.image}
                            alt=""
                            style={{
                                width: '70px',
                                height: '70px',
                                objectFit: 'cover',
                                border: '1px solid rgb(238, 238, 238)',
                                padding: '2px',
                            }}
                        />
                        <div
                            style={{
                                width: 260,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                marginLeft: '10px',
                            }}
                        >
                            {order?.name}
                        </div>
                        <span style={{ fontSize: '13px', color: '#242424', marginLeft: 'auto' }}>
                            Số lượng: {order?.amount}
                        </span>
                        <span style={{ fontSize: '13px', color: '#242424', marginLeft: 'auto' }}>
                            Giá: {convertPrice(order?.price)}
                        </span>
                    </WrapperHeaderItem>
                );
            });
        }
    };

    return (
        <Loading isLoading={isLoading || isLoadingCancel}>
            <WrapperContainer
            // onClick={() => window.location.reload()}
            >
                <div style={{ height: '100%', width: '1270px', margin: '0 auto' }}>
                    <h4>Đơn hàng của tôi</h4>
                    <WrapperListOrder>
                        {data?.length &&
                            data?.map((order) => {
                                return (
                                    <WrapperItemOrder key={order?._id}>
                                        <WrapperStatus>
                                            <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Đơn hàng</span>
                                            {/* <div>
                                            <span style={{ color: 'rgb(255, 66, 78)' }}>Giao hàng: </span>
                                            {`${order.isDelivered ? 'Đã giao hàng' : 'Chưa giao hàng'}`}
                                        </div> */}
                                            <div>
                                                <span style={{ color: 'rgb(255, 66, 78)' }}>
                                                    Trạng thái thanh toán:{' '}
                                                </span>
                                                {`${order.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}`}
                                                <span style={{ color: 'rgb(255, 66, 78)', marginLeft: '292px' }}>
                                                    Phương thức thanh toán:{' '}
                                                </span>
                                                {`${
                                                    order.paymentMethod === 'later_money'
                                                        ? 'Thanh toán khi nhận hàng'
                                                        : 'Thanh toán bằng paypal'
                                                }`}
                                            </div>
                                        </WrapperStatus>
                                        {renderProduct(order?.orderItems)}
                                        <WrapperFooterItem>
                                            <div>
                                                <span style={{ color: 'rgb(255, 66, 78)' }}>Tổng tiền: </span>
                                                <span
                                                    style={{
                                                        fontSize: '13px',
                                                        color: 'rgb(56, 56, 61)',
                                                        fontWeight: 700,
                                                    }}
                                                >
                                                    {convertPrice(order?.totalPrice)}
                                                </span>
                                            </div>
                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                {/* <ButtonComponent
                                                    onClick={() => handleCancelOrder(order)}
                                                    size={40}
                                                    styleButton={{
                                                        height: '36px',
                                                        border: '1px solid rgb(11, 116, 229)',
                                                        borderRadius: '4px',
                                                    }}
                                                    textbutton={'Hủy đơn hàng'}
                                                    styletextbutton={{ color: 'rgb(11, 116, 229)', fontSize: '14px' }}
                                                ></ButtonComponent> */}
                                                {/* <ButtonComponent
                                                onClick={() => handleDetailsOrder(order?._id)}
                                                size={40}
                                                styleButton={{
                                                    height: '36px',
                                                    border: '1px solid rgb(11, 116, 229)',
                                                    borderRadius: '4px',
                                                }}
                                                textbutton={'Xem chi tiết'}
                                                styletextbutton={{ color: 'rgb(11, 116, 229)', fontSize: '14px' }}
                                            ></ButtonComponent> */}
                                            </div>
                                        </WrapperFooterItem>
                                    </WrapperItemOrder>
                                );
                            })}
                    </WrapperListOrder>
                </div>
            </WrapperContainer>
        </Loading>
    );
};
export default MyOrderPage;
