import BasicHead from 'common/components/layout/BasicHead';
import RegisterDetails from 'features/Auth/RegisterDetails';

const RegisterDetailsPage = () => {
    return (
        <>
            <BasicHead title="goSolve | Onboarding" />
            <main>
                <RegisterDetails />
            </main>
        </>
    );
};

export default RegisterDetailsPage;
