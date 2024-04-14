import AdminPage from '../pages/AdminPage/AdminPage';
import DetailsOrderPage from '../pages/DetailsOrderPage/DetailsOrderPage';
import HomePage from '../pages/HomePage/HomePage';
import MyOrderPage from '../pages/MyOrderPage/MyOrderPage';
import NotFoundPage from '../pages/NotFoundPage/NotFoundPage';
import OrderPage from '../pages/OrderPage/OrderPage';
import OrderSuccess from '../pages/OrderSuccess/OrderSuccess';
import PaymentPage from '../pages/PaymentPage/PaymentPage';
import ProductDetailsPage from '../pages/ProductDetailsPage/ProductDetailsPage';
import ProductsPage from '../pages/ProductsPage/ProductsPage';
import ProfilePage from '../pages/Profile/ProfilePage';
import SignInPage from '../pages/SignInPage/SignInPage';
import SignUpPage from '../pages/SignUpPage/SignUpPage';
import TypeProductPage from '../pages/TypeProductPage/TypeProductPage';

export const routes = [
    {
        path: '/',
        page: HomePage,
        isShowHeader: true,
        isShowFooter: true,
    },
    {
        path: '/order',
        page: OrderPage,
        isShowHeader: true,
        isShowFooter: true,
    },
    {
        path: '/my-order',
        page: MyOrderPage,
        isShowHeader: true,
        isShowFooter: true,
    },
    {
        path: '/details-order/:id',
        page: DetailsOrderPage,
        isShowHeader: true,
        isShowFooter: true,
    },
    {
        path: '/payment',
        page: PaymentPage,
        isShowHeader: true,
        isShowFooter: true,
    },
    {
        path: '/orderSuccess',
        page: OrderSuccess,
        isShowHeader: true,
        isShowFooter: true,
    },
    {
        path: '/products',
        page: ProductsPage,
        isShowHeader: true,
        isShowFooter: true,
    },
    {
        path: '/product/:type',
        page: TypeProductPage,
        isShowHeader: true,
        isShowFooter: true,
    },
    {
        path: '/sign-in',
        page: SignInPage,
        isShowHeader: false,
        isShowFooter: true,
    },
    {
        path: '/sign-up',
        page: SignUpPage,
        isShowHeader: false,
        isShowFooter: true,
    },
    {
        path: '/product-details/:id',
        page: ProductDetailsPage,
        isShowHeader: true,
        isShowFooter: true,
    },
    {
        path: '/profile-user',
        page: ProfilePage,
        isShowHeader: true,
        isShowFooter: true,
    },
    {
        path: '/system/admin',
        page: AdminPage,
        isShowHeader: false,
        isShowFooter: true,
        isPrivate: true,
    },
    {
        path: '*',
        page: NotFoundPage,
    },
];
