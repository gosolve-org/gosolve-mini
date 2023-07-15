import Layout from "components/common/layout/Layout";
import BasicHead from "components/common/layout/BasicHead";

function NotFound() {
    return (
        <Layout>
            <BasicHead title="goSolve | Not Found" />
            <div className="flex min-h-full flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <h1 className="mt-6 px-4 py-2 text-center text-xl tracking-tight text-black ">
                        Not Found
                    </h1>
                </div>

                <div className="mt-3 sm:mx-auto w-full sm:max-w-md text-center">
                    <span>
                        The page you are looking for does not exist.
                    </span>
                </div>
            </div>
        </Layout>
    );
}

export default NotFound;
