import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProductDetailsComponent from '../../components/ProductDetailsComponent/ProductDetailsComponent';

const ProductDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    return (
        // <div style={{ padding: '0 120px', background: '#efefef', height: '1000px' }}>
        <div style={{ minHeight: '100vh', background: '#efefef', width: '100%' }}>
            <div style={{ width: '1270px', height: '100%', margin: '0 auto' }}>
                <h5>
                    <span style={{ cursor: 'pointer', fontWeight: 'bold' }} onClick={() => navigate('/')}>
                        Trang chủ
                    </span>
                    - Detail product
                </h5>
                <ProductDetailsComponent idProduct={id} />
            </div>
        </div>
    );
};

export default ProductDetailsPage;
