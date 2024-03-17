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

const MyOrderPage = () => {
    const user = useSelector((state) => state.user);
    const fetchMyOrder = async () => {
        const res = await OrderService.getOrderByUserId(user?.id, user?.access_token);
        return res.data;
    };
    const queryOrder = useQuery(
        { queryKey: ['users'], queryFn: fetchMyOrder },
        {
            enabled: user?.id && user?.access_token,
        },
    );
    const { isLoading, data } = queryOrder;
    console.log('data', data);
    return (
        <Loading isLoading={isLoading}>
            <WrapperContainer>
                <div style={{ height: '100%', width: '1270px', margin: '0 auto' }}>
                    <h4>Đơn hàng của tôi</h4>
                    <WrapperListOrder>
                        {data?.orderItems?.map((order) => {
                            return (
                                <WrapperItemOrder key={order?._id}>
                                    <WrapperStatus>
                                        <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Trạng thái</span>
                                        <div>
                                            <span style={{ color: 'rgb(255, 66, 78)' }}>Giao hàng: </span>
                                            {`${order.isDelivered ? 'Đã giao hàng' : 'Chưa giao hàng'}`}
                                        </div>
                                        <div>
                                            <span style={{ color: 'rgb(255, 66, 78)' }}>Thanh toán:</span>
                                            {`${order.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}`}
                                        </div>
                                    </WrapperStatus>
                                    <WrapperHeaderItem>
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
                                            {convertPrice(order?.price)}
                                        </span>
                                    </WrapperHeaderItem>
                                    <WrapperFooterItem>
                                        <div>
                                            <span style={{ color: 'rgb(255, 66, 78)' }}>Tổng tiền: </span>
                                            <span
                                                style={{ fontSize: '13px', color: 'rgb(56, 56, 61)', fontWeight: 700 }}
                                            >
                                                {convertPrice(data?.totalPrice)}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <ButtonComponent
                                                // onClick={() => handleAddCard()}
                                                size={40}
                                                styleButton={{
                                                    height: '36px',
                                                    border: '1px solid rgb(11, 116, 229)',
                                                    borderRadius: '4px',
                                                }}
                                                textButton={'Hủy đơn hàng'}
                                                styleTextButton={{ color: 'rgb(11, 116, 229)', fontSize: '14px' }}
                                            ></ButtonComponent>
                                            <ButtonComponent
                                                // onClick={() => handleAddCard()}
                                                size={40}
                                                styleButton={{
                                                    height: '36px',
                                                    border: '1px solid rgb(11, 116, 229)',
                                                    borderRadius: '4px',
                                                }}
                                                textButton={'Xem chi tiết'}
                                                styleTextButton={{ color: 'rgb(11, 116, 229)', fontSize: '14px' }}
                                            ></ButtonComponent>
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
