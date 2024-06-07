import { UserOutlined, ShoppingOutlined, ShoppingCartOutlined, DollarCircleOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Avatar, Card, Rate, Space, Statistic, Table, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import * as ProductService from '../../services/ProductService';
import * as UserService from '../../services/UserService';
import * as OrderService from '../../services/OrderService';
import Loading from '../LoadingComponent/Loading';
import { convertPrice } from '../../utils';
import TableComponent from '../TableComponent/TableComponent';
import './Dashboard.css';

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

function Dashboard() {
    const user = useSelector((state) => state?.user);
    const getAllProducts = async () => {
        const res = await ProductService.getAllProduct('', 20);
        return res;
    };
    const queryProduct = useQuery({ queryKey: ['products'], queryFn: getAllProducts });
    const { isLoading: isLoadingProducts, data: products } = queryProduct;

    const getAllUsers = async () => {
        const res = await UserService.getAllUser(user?.access_token);
        return res;
    };
    const queryUser = useQuery({ queryKey: ['users'], queryFn: getAllUsers });
    const { isLoading: isLoadingUsers, data: users } = queryUser;

    const getAllOrders = async () => {
        const res = await OrderService.getAllOrder(user?.access_token);
        return res;
    };
    const queryOrder = useQuery({ queryKey: ['orders'], queryFn: getAllOrders });
    const { isLoading: isLoadingOrders, data: orders } = queryOrder;
    let total = 0;
    let totalSold = 0;
    for (let i = 0; i < orders?.data.length; i++) {
        total += orders?.data[i]?.totalPrice;
        if (!isNaN(products?.data[i]?.sold)) {
            totalSold += Number(products?.data[i]?.sold);
        }
    }

    const columns = [
        {
            title: 'Image',
            dataIndex: 'image',
            render: (link) => {
                return <Avatar src={link} />;
            },
        },
        {
            title: 'Name',
            dataIndex: 'name',
            sorter: (a, b) => a.name.length - b.name.length,
        },
        {
            title: 'Price',
            dataIndex: 'price',
            render: (value) => <span>{convertPrice(value)}</span>,
            sorter: (a, b) => a.price - b.price,
        },
        {
            title: 'Type',
            dataIndex: 'type',
        },
        {
            title: 'Sold',
            dataIndex: 'sold',
            render: (value) => <span>{value}</span>,
            sorter: (a, b) => a.sold - b.sold,
        },
    ];
    const dataTable =
        products?.data?.length &&
        products?.data
            .sort((a, b) => b.sold - a.sold) // Sắp xếp sản phẩm theo rating giảm dần
            .slice(0, 3) // Lấy 3 sản phẩm đầu tiên
            .map((product) => {
                return { ...product, key: product._id };
            });
    return (
        <div>
            <Typography.Title level={4}>Dashboard</Typography.Title>
            <Loading isLoading={isLoadingUsers || isLoadingProducts || isLoadingOrders}>
                <Space direction="horizontal">
                    <DashboardCard
                        icon={
                            <UserOutlined
                                style={{
                                    color: 'purple',
                                    backgroundColor: 'rgba(0,255,255,0.25)',
                                    borderRadius: 20,
                                    fontSize: 24,
                                    padding: 8,
                                }}
                            />
                        }
                        title={'Người dùng'}
                        value={users?.data.length}
                    />
                    <DashboardCard
                        icon={
                            <ShoppingOutlined
                                style={{
                                    color: 'green',
                                    backgroundColor: 'rgba(0,255,0,0.25)',
                                    borderRadius: 20,
                                    fontSize: 24,
                                    padding: 8,
                                }}
                            />
                        }
                        title={'Sản phẩm'}
                        value={products?.data.length}
                    />
                    <DashboardCard
                        icon={
                            <ShoppingCartOutlined
                                style={{
                                    color: 'blue',
                                    backgroundColor: 'rgba(0,0,255,0.25)',
                                    borderRadius: 20,
                                    fontSize: 24,
                                    padding: 8,
                                }}
                            />
                        }
                        title={'Đơn hàng'}
                        value={orders?.data.length}
                    />
                    <DashboardCard
                        icon={
                            <ShoppingCartOutlined
                                style={{
                                    color: 'yellow',
                                    backgroundColor: 'rgba(0,0,255,0.25)',
                                    borderRadius: 20,
                                    fontSize: 24,
                                    padding: 8,
                                }}
                            />
                        }
                        title={'Sản phẩm đã bán'}
                        value={Number(totalSold)}
                    />
                    <DashboardCard
                        icon={
                            <DollarCircleOutlined
                                style={{
                                    color: 'red',
                                    backgroundColor: 'rgba(255,0,0,0.25)',
                                    borderRadius: 20,
                                    fontSize: 24,
                                    padding: 8,
                                }}
                            />
                        }
                        title={'Doanh thu'}
                        value={convertPrice(total)}
                    />
                </Space>
                {/* <div className="mt-24">
                    <h5 className="rating_product">Sản phẩm bán nhiều nhất</h5>
                    <TableComponent
                        columns={columns}
                        isLoading={isLoadingProducts}
                        data={dataTable}
                        pagination={false}
                    />
                </div> */}
                <Space direction="horizontal" className="mt-24">
                    <TableComponent
                        columns={columns}
                        isLoading={isLoadingProducts}
                        data={dataTable}
                        pagination={false}
                    />
                    <PieChart />
                </Space>
                <div className="mt-24">
                    <h3 className="rating_product">Áo bán nhiều nhất</h3>
                    <DashboardChart />
                </div>

                {/* <div className="mt-24">
                    <h3 className="rating_product">Số lượng loại áo đã bán</h3>
                    <PieChart />
                </div> */}
            </Loading>
        </div>
    );
}

const DashboardCard = ({ title, value, icon }) => {
    return (
        <Card>
            <Space direction="horizontal">
                {icon}
                <Statistic title={title} value={value} />
            </Space>
        </Card>
    );
};

export function DashboardChart() {
    const [revenueData, setRevenueData] = useState({
        labels: [],
        datasets: [],
    });
    useEffect(() => {
        OrderService.getAllOrder().then((res) => {
            const labels = res?.data.map((order) => {
                const dateObject = new Date(order?.createdAt);
                // Lấy ngày, tháng và năm
                const day = dateObject.getDate();
                const month = dateObject.getMonth() + 1; // Tháng bắt đầu từ 0 nên cần cộng thêm 1
                const year = dateObject.getFullYear();
                // console.log('labels: ', order);
                // Tạo chuỗi định dạng "ngày tháng năm"
                const formattedDate = `${day}/${month}/${year}`;
                // console.log(formattedDate);
                // return order?.shippingAddress?.fullName;
                return formattedDate;
            });
            const data = res?.data.map((order) => {
                return order.totalPrice;
            });
            const dataSource = {
                labels,
                datasets: [
                    {
                        label: 'Doanh thu',
                        data: data,
                        backgroundColor: 'rgba(255, 0, 0, 1)',
                    },
                ],
            };
            setRevenueData(dataSource);
        });
    }, []);
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
            },
            title: {
                display: true,
                text: 'Doanh thu đơn hàng',
            },
        },
        scales: {
            y: {
                ticks: {
                    // Định dạng số liệu trên trục tung
                    callback: function (value, index, values) {
                        return convertPrice(value); // Định dạng số liệu hiển thị với dấu $
                    },
                    // Các tùy chọn khác cho số liệu trên trục tung
                    fontSize: 12, // Cỡ chữ của số liệu
                    fontColor: '#aaaaaa', // Màu của số liệu
                    padding: 10, // Khoảng cách giữa số liệu và trục tung
                },
            },
        },
    };

    return (
        <Card>
            <Bar options={options} data={revenueData} />;
        </Card>
    );
}

export const PieChart = () => {
    const [dataPieChart, setDataPieChart] = useState(null);

    useEffect(() => {
        ProductService.getAllProduct().then((res) => {
            const products = res.data;
            const productTypes = {}; // Đếm số lượng sản phẩm của mỗi loại áo
            console.log('productTypes: ', productTypes);

            products.forEach((product) => {
                console.log('product: ', product);
                if (!isNaN(product.sold) || product.sold !== undefined) {
                    if (product.type in productTypes) {
                        productTypes[product.type] = productTypes[product.type] += product.sold;
                        console.log('product.type: ', product.type);
                    } else {
                        productTypes[product.type] = product.sold;
                        console.log('product.type: ', product.type);
                    }
                }
            });
            console.log('productTypes: ', productTypes);

            const labels = Object.keys(productTypes);
            const data = Object.values(productTypes);

            const dataSource = {
                labels: labels,
                datasets: [
                    {
                        data: data,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.6)',
                            'rgba(54, 162, 235, 0.6)',
                            'rgba(255, 206, 86, 0.6)',
                            'rgba(75, 192, 192, 0.6)',
                            'rgba(153, 102, 255, 0.6)',
                            'rgba(255, 159, 64, 0.6)',
                        ],
                    },
                ],
            };

            setDataPieChart(dataSource);
        });
    }, []);
    // const options = {
    //     legend: {
    //         display: true, // Hiển thị vùng chú thích
    //         position: 'bottom', // Vị trí của vùng chú thích (có thể là 'top', 'bottom', 'left', 'right')
    //         labels: {
    //             fontColor: 'black', // Màu chữ của các nhãn trong vùng chú thích
    //         },
    //     },
    // };

    const options = {
        tooltips: {
            callbacks: {
                label: function (tooltipItem, data) {
                    var dataset = data.datasets[tooltipItem.datasetIndex];
                    var total = dataset.data.reduce(function (previousValue, currentValue, currentIndex, array) {
                        return previousValue + currentValue;
                    });
                    var currentValue = dataset.data[tooltipItem.index];
                    var percentage = Math.floor((currentValue / total) * 100 + 0.5); // làm tròn phần trăm
                    return data.labels[tooltipItem.index] + ': ' + currentValue + ' (' + percentage + '%)';
                },
            },
        },
        legend: {
            display: true,
            position: 'bottom',
            labels: {
                fontColor: 'black',
            },
        },
    };

    return <div>{dataPieChart && <Pie data={dataPieChart} options={options} />}</div>;
};

// export const PieChart = () => {
//     const [dataPieChart, setDataPieChart] = useState(null);

//     useEffect(() => {
//         ProductService.getAllProduct().then((res) => {
//             const products = res.data;

//             // Đếm số lượng sản phẩm được bán của mỗi loại áo
//             const productTypes = {};
//             products.forEach((product) => {
//                 if (product.type in productTypes) {
//                     productTypes[product.type] += product.sold;
//                 } else {
//                     productTypes[product.type] = product.sold;
//                 }
//             });

//             // Sắp xếp các loại áo theo số lượng bán được giảm dần
//             const sortedTypes = Object.keys(productTypes).sort((a, b) => productTypes[b] - productTypes[a]);

//             // Chọn ra 3 loại áo đầu tiên
//             const top3Types = sortedTypes.slice(0, 3);

//             // Lấy dữ liệu số lượng sản phẩm bán được của 3 loại áo đó
//             const top3Data = top3Types.map((type) => productTypes[type]);

//             // Tạo dataSource cho biểu đồ tròn
//             const dataSource = {
//                 labels: top3Types,
//                 datasets: [
//                     {
//                         data: top3Data,
//                         backgroundColor: [
//                             'rgba(255, 99, 132, 0.6)',
//                             'rgba(54, 162, 235, 0.6)',
//                             'rgba(255, 206, 86, 0.6)',
//                         ],
//                     },
//                 ],
//             };

//             setDataPieChart(dataSource);
//         });
//     }, []);

//     return <div>{dataPieChart && <Pie data={dataPieChart} />}</div>;
// };

export default Dashboard;
