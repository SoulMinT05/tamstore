import React, { useEffect, useMemo, useState } from 'react';
import {
    Label,
    WrapperInfo,
    WrapperContainer,
    WrapperValue,
    WrapperCountOrder,
    WrapperItemOrder,
    WrapperItemOrderInfo,
} from './style';

import { useSelector } from 'react-redux';
import Loading from '../../components/LoadingComponent/Loading';
import { useLocation } from 'react-router-dom';
import { orderConstant } from '../../constant';
import { convertPrice } from '../../utils';

const OrderSuccess = () => {
    const order = useSelector((state) => state.order);
    const location = useLocation();
    const { state } = location;
    return (
        <div style={{ background: '#f5f5fa', with: '100%', height: '100vh' }}>
            <Loading isLoading={false}>
                <div style={{ height: '100%', width: '1270px', margin: '0 auto' }}>
                    <h3>Đặt hàng thành công</h3>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <WrapperContainer>
                            <WrapperInfo>
                                <div>
                                    <Label>Chọn phương thức giao hàng</Label>
                                    <WrapperValue>
                                        <span style={{ color: '#ea8500', fontWeight: 'bold' }}>
                                            {orderConstant.delivery[state?.delivery]}
                                        </span>
                                        Giao hàng tiết kiệm
                                    </WrapperValue>
                                </div>
                            </WrapperInfo>

                            <WrapperInfo>
                                <div>
                                    <Label>Phương thức thanh toán</Label>
                                    <WrapperValue>{orderConstant.payment[state?.payment]}</WrapperValue>
                                </div>
                            </WrapperInfo>
                            <WrapperItemOrderInfo>
                                {state.orders?.map((order) => {
                                    return (
                                        <WrapperItemOrder key={order?.name}>
                                            <div
                                                style={{
                                                    width: '500px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 4,
                                                }}
                                            >
                                                <img
                                                    src={order.image}
                                                    style={{ width: '77px', height: '79px', objectFit: 'cover' }}
                                                    alt=""
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
                                                    gap: '10px',
                                                }}
                                            >
                                                <span>
                                                    <span style={{ fontSize: '13px', color: '#242424' }}>
                                                        Giá tiền: {convertPrice(order?.price)}
                                                    </span>
                                                </span>
                                                <span>
                                                    <span style={{ fontSize: '13px', color: '#242424' }}>
                                                        Số lượng: {order?.amount}
                                                    </span>
                                                </span>
                                            </div>
                                        </WrapperItemOrder>
                                    );
                                })}
                            </WrapperItemOrderInfo>
                            <div>
                                <span style={{ fontSize: '16px', color: 'red' }}>
                                    Tổng tiền: {convertPrice(state?.totalPriceMemo)}
                                </span>
                            </div>
                        </WrapperContainer>
                    </div>
                </div>
            </Loading>
        </div>
    );
};
export default OrderSuccess;
