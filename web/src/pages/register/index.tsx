import BasicHead from 'common/components/layout/BasicHead';
import Layout from 'common/components/layout/Layout';
import Register from 'features/Auth/Register';

function RegisterPage() {
    return (
        <>
            <BasicHead title="goSolve | Register" />
            <Layout>
                <Register />
            </Layout>
        </>
    );
}

export default RegisterPage;
