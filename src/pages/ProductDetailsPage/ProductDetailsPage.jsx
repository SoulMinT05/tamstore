import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProductDetailsComponent from '../../components/ProductDetailsComponent/ProductDetailsComponent';

const ProductDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    return (
        <div style={{ padding: '0 120px', background: '#efefef', height: '1000px' }}>
            <h5>
                <span style={{cursor: 'pointer', fontWeight: 'bold'}}  onClick={() => navigate('/')}>Trang chủ</span>- Detail product
            </h5>
            <ProductDetailsComponent idProduct={id} />
        </div>
    );
};

export default ProductDetailsPage;
