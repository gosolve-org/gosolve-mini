import BasicHead from "common/components/layout/BasicHead";
import Layout from "common/components/layout/Layout";
import Login from "features/Auth/Login";

function LoginPage() {
    return (
        <>
            <BasicHead title="goSolve | Login" />
            <Layout>
                <Login/>
            </Layout>
        </>
    );
}

export default LoginPage;
