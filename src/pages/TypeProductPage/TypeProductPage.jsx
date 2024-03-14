import React, { Fragment, useEffect, useState } from 'react';
import NavBarComponent from '../../components/NavbarComponent/NavBarComponent';
import CardComponent from '../../components/CardComponent/CardComponent';
import { Col, Pagination, Row } from 'antd';
import { WrapperNavbar, WrapperProducts } from './style';
import { useLocation } from 'react-router';
import { getProductType } from '../../services/ProductService';
import * as ProductService from '../../services/ProductService';
import Loading from '../../components/LoadingComponent/Loading';

const TypeProductPage = () => {
    const { state } = useLocation();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const fetchProductType = async (type) => {
        setLoading(true);
        const res = await ProductService.getProductType(state);
        if (res?.status === 'OK') {
            setLoading(false);
            setProducts(res?.data);
        } else {
            setLoading(false);
        }
        console.log('res', res);
    };

    useEffect(() => {
        if (state) {
            fetchProductType(state);
        }
    }, [state]);
    console.log('loading', loading);

    const onChange = () => {};
    return (
        <Loading isLoading={loading}>
            <div style={{ width: '100%', background: '#efefef', height: 'calc(100vh - 64px)' }}>
                <div style={{ width: '1270px', margin: '0 auto' }}>
                    <Row style={{ flexWrap: 'nowrap', paddingTop: '10px' }}>
                        <WrapperNavbar span={4}>
                            <NavBarComponent />
                        </WrapperNavbar>
                        <Col
                            span={20}
                            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                        >
                            <WrapperProducts>
                                {products?.map((product) => {
                                    return (
                                        <CardComponent
                                            key={product._id}
                                            countInStock={product.countInStock}
                                            description={product.description}
                                            image={product.image}
                                            name={product.name}
                                            price={product.price}
                                            rating={product.rating}
                                            type={product.type}
                                            selled={product.selled}
                                            discount={product.discount}
                                            id={product._id}
                                        />
                                    );
                                })}
                            </WrapperProducts>
                            <Pagination
                                defaultCurrent={2}
                                total={100}
                                onChange={onChange}
                                style={{ textAlign: 'center', marginTop: '10px' }}
                            />
                        </Col>
                    </Row>
                </div>
            </div>
        </Loading>
    );
};

export default TypeProductPage;
