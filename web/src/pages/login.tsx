import BasicHead from 'common/components/layout/BasicHead';
import Layout from 'common/components/layout/Layout';
import Login from 'features/Auth/Login';

const LoginPage = () => {
    return (
        <>
            <BasicHead />
            <Layout>
                <Login />
            </Layout>
        </>
    );
};

export default LoginPage;
